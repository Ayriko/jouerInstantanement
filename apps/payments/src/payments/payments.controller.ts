import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentIntentDto, OrderResponseDto } from '@repo/shared-types';

import { PaymentsService } from './payments.service.js';

@Controller()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @MessagePattern({ cmd: 'payment.createIntent' })
    createIntent(
        @Payload() payload: { userId: string; dto: CreatePaymentIntentDto },
    ): Promise<{ clientSecret: string }> {
        return this.paymentsService.createPaymentIntent(
            payload.userId,
            payload.dto,
        );
    }

    @MessagePattern({ cmd: 'payment.handleWebhook' })
    handleWebhook(
        @Payload() payload: { rawBody: string; signature: string },
    ): Promise<{ received: boolean }> {
        return this.paymentsService.handleWebhook(
            payload.rawBody,
            payload.signature,
        );
    }

    @MessagePattern({ cmd: 'payment.getOrders' })
    getOrders(
        @Payload() payload: { userId: string },
    ): Promise<OrderResponseDto[]> {
        return this.paymentsService.getOrders(payload.userId);
    }
}
