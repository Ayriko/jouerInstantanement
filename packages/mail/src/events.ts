export enum MailEvent {
    USER_REGISTERED = 'mail.user.registered',
    PURCHASE_INVOICE = 'mail.purchase.invoice',
    WISHLIST_RESTOCK = 'mail.wishlist.restock',
}

export interface UserRegisteredPayload {
    event: MailEvent.USER_REGISTERED;
    userId: string;
    email: string;
    username: string;
}

export interface PurchaseInvoicePayload {
    event: MailEvent.PURCHASE_INVOICE;
    userId: string;
    email: string;
    orderId: string;
    games: { title: string; price: number }[];
    total: number;
    purchasedAt: string;
}

export interface WishlistRestockPayload {
    event: MailEvent.WISHLIST_RESTOCK;
    users: { email: string; username: string }[];
    game: {
        title: string;
        slug: string;
        price: number;
        imageUrl: string;
    };
}

export type MailPayload =
    | UserRegisteredPayload
    | PurchaseInvoicePayload
    | WishlistRestockPayload;
