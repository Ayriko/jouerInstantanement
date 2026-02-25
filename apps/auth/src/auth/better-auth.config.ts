import { PrismaService } from '@repo/prisma';
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

export const auth = betterAuth({
    baseURL: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    database: prismaAdapter(new PrismaService(), { provider: 'postgresql' }),
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
    },
    trustedOrigins: [
        process.env.GATEWAY_URL ?? 'http://localhost:3000',
        process.env.FRONTEND_URL ?? 'http://localhost:3001',
    ],
});

export type Auth = typeof auth;
