import { z } from 'zod';

export const loginSchema = (t: (key: string) => string) =>
    z.object({
        email: z
            .email(t('validation.emailInvalid'))
            .min(1, t('validation.emailRequired')),
        password: z
            .string()
            .min(1, t('validation.passwordRequired'))
            .min(8, t('validation.passwordMin')),
    });

export const registerSchema = (t: (key: string) => string) =>
    z
        .object({
            name: z.string().min(1, t('validation.nameRequired')),
            email: z
                .email(t('validation.emailInvalid'))
                .min(1, t('validation.emailRequired')),
            password: z
                .string()
                .min(1, t('validation.passwordRequired'))
                .min(8, t('validation.passwordMin')),
            confirmPassword: z
                .string()
                .min(1, t('validation.confirmPasswordRequired')),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('validation.passwordsMismatch'),
            path: ['confirmPassword'],
        });

export const forgotPasswordSchema = (t: (key: string) => string) =>
    z.object({
        email: z
            .email(t('validation.emailInvalid'))
            .min(1, t('validation.emailRequired')),
    });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>;
export type ForgotPasswordFormData = z.infer<
    ReturnType<typeof forgotPasswordSchema>
>;
