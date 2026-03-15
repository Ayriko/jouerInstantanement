export enum MailEvent {
    USER_REGISTERED = 'mail.user.registered',
}

export interface UserRegisteredPayload {
    event: MailEvent.USER_REGISTERED;
    userId: string;
    email: string;
    username: string;
}

export type MailPayload = UserRegisteredPayload;
