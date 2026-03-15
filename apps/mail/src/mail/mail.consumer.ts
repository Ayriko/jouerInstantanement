import { InjectQueue } from '@nestjs/bullmq';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as mail from '@repo/mail';
import { Queue } from 'bullmq';

@Controller()
export class MailConsumer {
    constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

    @EventPattern(mail.MailEvent.USER_REGISTERED)
    async onUserRegistered(@Payload() data: mail.UserRegisteredPayload) {
        await this.mailQueue.add(mail.MailEvent.USER_REGISTERED, data, {
            attempts: 3,
            backoff: { delay: 2000, type: 'exponential' },
            removeOnComplete: true,
            removeOnFail: false, // garder les jobs échoués pour debug
        });
    }
}
