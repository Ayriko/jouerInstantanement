import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { MailEvent, UserRegisteredPayload } from '@repo/mail';
import { Job } from 'bullmq';

import { MailService } from './mail.service';

@Processor('mail')
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name);

    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job): Promise<void> {
        this.logger.log(`Processing job ${job.name} (id: ${job.id})`);
        try {
            switch (job.name) {
                case MailEvent.USER_REGISTERED: {
                    await this.mailService.sendUserRegistered(
                        job.data as UserRegisteredPayload,
                    );
                    this.logger.log(`Email sent for job ${job.name} (id: ${job.id})`);
                    break;
                }

                default: {
                    throw new Error(`Job inconnu : ${job.name}`);
                }
            }
        } catch (error) {
            this.logger.error(`Job ${job.name} (id: ${job.id}) failed: ${String(error)}`, error instanceof Error ? error.stack : undefined);
            throw error; // re-throw pour que BullMQ gère le retry
        }
    }
}
