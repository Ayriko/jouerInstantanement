import { MailEvent, UserRegisteredPayload } from '@repo/mail';
import { PrismaService } from '@repo/prisma';
import * as amqp from 'amqplib';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer } from 'better-auth/plugins';

// Load .env before better-auth initializes (runs before ConfigModule)
try {
    process.loadEnvFile('../../.env');
} catch {
    // .env might not exist in production — env vars come from system
}

console.log(
    '[better-auth.config] DATABASE_URL set:',
    !!process.env.DATABASE_URL,
);
console.log(
    '[better-auth.config] BETTER_AUTH_SECRET set:',
    !!process.env.BETTER_AUTH_SECRET,
);

// ─── RabbitMQ publisher (connexion lazy, singleton) ──────────────────────────
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type AmqpChannel = Awaited<ReturnType<amqp.Connection['createChannel']>>;

let mailChannel: AmqpChannel | null = null;

function resetMailChannel() {
    mailChannel = null;
}

/* eslint-disable
   @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-call,
   @typescript-eslint/no-unsafe-member-access
   -- amqplib typings are loosely typed (any), these warnings are false positives */
async function getMailChannel(): Promise<AmqpChannel> {
    if (mailChannel) return mailChannel;
    const conn = await amqp.connect(
        process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
    );
    mailChannel = await conn.createChannel();
    await mailChannel.assertQueue('mail_queue', { durable: true });
    conn.on('error', resetMailChannel);
    conn.on('close', resetMailChannel);
    return mailChannel;
}

async function publishUserRegistered(
    payload: UserRegisteredPayload,
): Promise<void> {
    try {
        const ch = await getMailChannel();
        ch.sendToQueue(
            'mail_queue',
            Buffer.from(
                JSON.stringify({
                    pattern: MailEvent.USER_REGISTERED,
                    data: payload,
                }),
            ),
            { persistent: true },
        );
    } catch (error) {
        console.error('[auth] Failed to publish mail.user.registered:', error);
    }
}
/* eslint-enable
   @typescript-eslint/no-unsafe-assignment,
   @typescript-eslint/no-unsafe-call,
   @typescript-eslint/no-unsafe-member-access */

// ─────────────────────────────────────────────────────────────────────────────

export const auth = betterAuth({
    baseURL: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    database: prismaAdapter(new PrismaService(), { provider: 'postgresql' }),
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await publishUserRegistered({
                        event: MailEvent.USER_REGISTERED,
                        userId: user.id,
                        email: user.email,
                        username: user.name,
                    });
                },
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [bearer()],
    secret: process.env.BETTER_AUTH_SECRET!,
    session: {
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24,
    },
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        roblox: {
            clientId: process.env.ROBLOX_CLIENT_ID!,
            clientSecret: process.env.ROBLOX_CLIENT_SECRET!,
        },
        twitch: {
            clientId: process.env.TWITCH_CLIENT_ID!,
            clientSecret: process.env.TWITCH_CLIENT_SECRET!,
        },
    },
    trustedOrigins: [
        process.env.GATEWAY_URL ?? 'http://localhost:3000',
        process.env.FRONTEND_URL ?? 'http://localhost:3001',
    ],
});

export type Auth = typeof auth;
