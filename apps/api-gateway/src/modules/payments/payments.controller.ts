import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Req,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentIntentDto, OrderResponseDto } from '@repo/shared-types';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';

import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { RpcExceptionFilter } from '../../common/filters/rpc-exception.filter.js';
import { JwtAuthGuard } from '../../common/guards/auth.guard.js';

@ApiTags('payments')
@Controller('payments')
@UseFilters(new RpcExceptionFilter())
export class PaymentsController {
    constructor(
        @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
    ) {}

    @Post('create-intent')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a Stripe PaymentIntent for cart items' })
    @ApiResponse({ status: 201, description: 'Returns clientSecret' })
    createIntent(
        @CurrentUser() user: { id: string; email: string },
        @Body() dto: CreatePaymentIntentDto,
    ): Observable<{ clientSecret: string }> {
        return this.paymentClient.send<{ clientSecret: string }>(
            { cmd: 'payment.createIntent' },
            { userId: user.id, dto },
        );
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Stripe webhook endpoint (no auth)' })
    @ApiResponse({ status: 200, description: 'Webhook received' })
    async handleWebhook(
        @Req() req: Request & { rawBody?: Buffer },
    ): Promise<{ received: boolean }> {
        const rawBody = req.rawBody?.toString('utf8') ?? '';
        const signature = req.headers['stripe-signature'] as string;

        return firstValueFrom(
            this.paymentClient.send<{ received: boolean }>(
                { cmd: 'payment.handleWebhook' },
                { rawBody, signature },
            ),
        );
    }

    @Get('orders')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get order history for authenticated user' })
    @ApiResponse({ status: 200, description: 'Returns list of orders' })
    getOrders(
        @CurrentUser() user: { id: string; email: string },
    ): Observable<OrderResponseDto[]> {
        return this.paymentClient.send<OrderResponseDto[]>(
            { cmd: 'payment.getOrders' },
            { userId: user.id },
        );
    }
}
