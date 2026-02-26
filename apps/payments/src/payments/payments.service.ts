import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '@repo/prisma';
import { CreatePaymentIntentDto, OrderResponseDto } from '@repo/shared-types';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    private readonly stripe: Stripe;

    constructor(private readonly prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
            apiVersion: '2025-02-24.acacia',
        });
    }

    async createPaymentIntent(
        userId: string,
        dto: CreatePaymentIntentDto,
    ): Promise<{ clientSecret: string }> {
        const gameIds = dto.items.map((item) => item.gameId);
        const games = await this.prisma.game.findMany({
            where: { id: { in: gameIds } },
        });

        if (games.length !== gameIds.length) {
            const foundIds = new Set(games.map((g) => g.id));
            const missing = gameIds.filter((id) => !foundIds.has(id));
            throw new RpcException(
                new NotFoundException(`Games not found: ${missing.join(', ')}`),
            );
        }

        const gameMap = new Map(games.map((g) => [g.id, g]));
        let totalAmount = 0;
        const lineItems = dto.items.map((item) => {
            const game = gameMap.get(item.gameId)!;
            totalAmount += game.total * item.quantity;
            return {
                gameId: item.gameId,
                quantity: item.quantity,
                unitPrice: game.total,
            };
        });

        const amountInCents = Math.round(totalAmount * 100);

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            metadata: {
                userId,
                items: JSON.stringify(lineItems),
            },
        });

        if (!paymentIntent.client_secret) {
            throw new RpcException('Failed to create payment intent');
        }

        return { clientSecret: paymentIntent.client_secret };
    }

    async handleWebhook(
        rawBody: string,
        signature: string,
    ): Promise<{ received: boolean }> {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                webhookSecret,
            );
        } catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err}`);
            throw new RpcException(`Webhook Error: ${err}`);
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await this.createOrderFromPaymentIntent(paymentIntent);
        }

        return { received: true };
    }

    private async createOrderFromPaymentIntent(
        paymentIntent: Stripe.PaymentIntent,
    ): Promise<void> {
        const existing = await this.prisma.order.findUnique({
            where: { stripePaymentId: paymentIntent.id },
        });

        if (existing) {
            this.logger.log(
                `Order already exists for payment ${paymentIntent.id}, skipping`,
            );
            return;
        }

        const userId = paymentIntent.metadata['userId'];
        const itemsRaw = paymentIntent.metadata['items'];

        if (!userId || !itemsRaw) {
            this.logger.error(
                `Missing metadata in payment intent ${paymentIntent.id}`,
            );
            return;
        }

        const items: Array<{
            gameId: string;
            quantity: number;
            unitPrice: number;
        }> = JSON.parse(itemsRaw);

        const totalAmount = paymentIntent.amount / 100;

        await this.prisma.order.create({
            data: {
                userId,
                stripePaymentId: paymentIntent.id,
                totalAmount,
                status: 'PAID',
                items: {
                    create: items.map((item) => ({
                        gameId: item.gameId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
        });

        this.logger.log(
            `Order created for user ${userId}, payment ${paymentIntent.id}`,
        );
    }

    async getOrders(userId: string): Promise<OrderResponseDto[]> {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { game: true },
                },
            },
        });

        return orders.map((order) => ({
            id: order.id,
            stripePaymentId: order.stripePaymentId,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                gameId: item.gameId,
                gameName: item.game.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
        }));
    }
}
