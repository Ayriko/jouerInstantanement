import { Injectable } from '@nestjs/common';
import {
    UserRegisteredPayload,
    PurchaseInvoicePayload,
    WishlistRestockPayload,
} from '@repo/mail';
import * as Mailjet from 'node-mailjet';

@Injectable()
export class MailService {
    private readonly client: Mailjet.Client;
    private readonly from = {
        Email: process.env.MAIL_FROM ?? 'noreply@gamestore.com',
        Name: 'GameStore',
    };

    // IDs des templates depuis le dashboard Mailjet
    private readonly templates = {
        purchaseInvoice: Number.parseInt(process.env.MJ_TPL_PURCHASE_INVOICE!),
        userRegistered: Number.parseInt(process.env.MJ_TPL_USER_REGISTERED!),
        wishlistRestock: Number.parseInt(process.env.MJ_TPL_WISHLIST_RESTOCK!),
    };

    constructor() {
        this.client = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY!,
            process.env.MAILJET_SECRET_KEY!,
        );
    }

    // ─── Helpers ─────────────────────────────────────────────

    private async send(
        to: string,
        subject: string,
        templateId: number,
        variables: Record<string, unknown>,
    ) {
        await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: this.from,
                    Subject: subject,
                    TemplateID: templateId,
                    TemplateLanguage: true, // obligatoire pour que les variables soient injectées
                    To: [{ Email: to }],
                    Variables: variables,
                },
            ],
        });
    }

    private async sendBulk(
        recipients: { Email: string; Name: string }[],
        subject: string,
        templateId: number,
        variables: Record<string, unknown>,
    ) {
        await this.client.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: this.from,
                    Subject: subject,
                    TemplateID: templateId,
                    TemplateLanguage: true,
                    To: recipients,
                    Variables: variables,
                },
            ],
        });
    }

    // ─── Méthodes publiques ───────────────────────────────────

    async sendUserRegistered(data: UserRegisteredPayload) {
        await this.send(
            data.email,
            `Bienvenue ${data.username} 🎮`,
            this.templates.userRegistered,
            {
                username: data.username,
            },
        );
    }

    async sendPurchaseInvoice(data: PurchaseInvoicePayload) {
        await this.send(
            data.email,
            `Votre facture #${data.orderId}`,
            this.templates.purchaseInvoice,
            {
                games: data.games,
                orderId: data.orderId,
                purchasedAt: data.purchasedAt,
                total: data.total,
            },
        );
    }

    async sendWishlistRestock(data: WishlistRestockPayload) {
        const recipients = data.users.map((u) => ({
            Email: u.email,
            Name: u.username,
        }));
        await this.sendBulk(
            recipients,
            `${data.game.title} est de retour ! 🔥`,
            this.templates.wishlistRestock,
            {
                gameImageUrl: data.game.imageUrl,
                gamePrice: data.game.price,
                gameSlug: data.game.slug,
                gameTitle: data.game.title,
            },
        );
    }
}
