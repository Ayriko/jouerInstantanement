import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
    MailEvent,
    UserRegisteredPayload,
    PurchaseInvoicePayload,
    WishlistRestockPayload,
} from '@repo/mail';
import { Job } from 'bullmq';

import { MailService } from './mail.service';

@Processor('mail')
export class MailProcessor extends WorkerHost {
    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job): Promise<void> {
        switch (job.name) {
            case MailEvent.USER_REGISTERED: {
                await this.mailService.sendUserRegistered(
                    job.data as UserRegisteredPayload,
                );
                break;
            }

            case MailEvent.PURCHASE_INVOICE: {
                await this.mailService.sendPurchaseInvoice(
                    job.data as PurchaseInvoicePayload,
                );
                break;
            }

            case MailEvent.WISHLIST_RESTOCK: {
                await this.mailService.sendWishlistRestock(
                    job.data as WishlistRestockPayload,
                );
                break;
            }

            default: {
                throw new Error(`Job inconnu : ${job.name}`);
            }
        }
    }
}
