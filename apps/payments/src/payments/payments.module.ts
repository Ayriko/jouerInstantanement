import { Module } from '@nestjs/common';
import { PrismaService } from '@repo/prisma';

import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

@Module({
    controllers: [PaymentsController],
    providers: [PaymentsService, PrismaService],
})
export class PaymentsModule {}
