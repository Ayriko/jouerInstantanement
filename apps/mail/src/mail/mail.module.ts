import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { MailConsumer } from './mail.consumer';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
    imports: [BullModule.registerQueue({ name: 'mail' })],
    controllers: [MailConsumer],
    providers: [MailProcessor, MailService],
})
export class MailModule {}
