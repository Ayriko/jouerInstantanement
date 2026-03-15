import { InjectQueue } from '@nestjs/bullmq'
import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import {
    MailEvent,
    UserRegisteredPayload,
    PurchaseInvoicePayload,
    WishlistRestockPayload,
} from '@repo/mail'
import { Queue } from 'bullmq'

@Controller()
export class MailConsumer {
    constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

    @EventPattern(MailEvent.USER_REGISTERED)
    async onUserRegistered(@Payload() data: UserRegisteredPayload) {
        await this.mailQueue.add(MailEvent.USER_REGISTERED, data, {
            attempts: 3,
            backoff: { delay: 2000, type: 'exponential' },
            removeOnComplete: true,
            removeOnFail: false, // garder les jobs échoués pour debug
        })
    }

    @EventPattern(MailEvent.PURCHASE_INVOICE)
    async onPurchaseInvoice(@Payload() data: PurchaseInvoicePayload) {
        await this.mailQueue.add(MailEvent.PURCHASE_INVOICE, data, {
            attempts: 5,
            backoff: { delay: 3000, type: 'exponential' },
            removeOnComplete: true,
            removeOnFail: false,
        })
    }

    @EventPattern(MailEvent.WISHLIST_RESTOCK)
    async onWishlistRestock(@Payload() data: WishlistRestockPayload) {
        await this.mailQueue.add(MailEvent.WISHLIST_RESTOCK, data, {
            attempts: 3,
            backoff: { delay: 5000, type: 'fixed' },
            removeOnComplete: true,
            removeOnFail: false,
        })
    }
}
