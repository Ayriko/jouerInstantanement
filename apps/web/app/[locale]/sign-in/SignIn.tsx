'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Link, useRouter } from '@/i18n/navigation';
import {
    loginSchema,
    registerSchema,
    type LoginFormData,
    type RegisterFormData,
} from '@/lib/validations/auth';
import { authClient } from '@/lib/auth-client';

type Tab = 'login' | 'register';

export default function SignIn() {
    const t = useTranslations('account.signIn');
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showMoreProviders, setShowMoreProviders] = useState(false);

    const loginForm = useForm<LoginFormData>({
        defaultValues: { email: '', password: '' },
        resolver: zodResolver(loginSchema(t)),
    });

    const registerForm = useForm<RegisterFormData>({
        defaultValues: { confirmPassword: '', email: '', password: '' },
        resolver: zodResolver(registerSchema(t)),
    });

    const handleTabSwitch = (tab: Tab) => {
        setActiveTab(tab);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setErrorMessage(null);
        setShowMoreProviders(false);
    };

    const onLoginSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setErrorMessage(null);
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        });
        if (error) {
            setErrorMessage(
                error.code === 'INVALID_EMAIL_OR_PASSWORD'
                    ? t('errors.invalidCredentials')
                    : t('errors.generic'),
            );
        } else {
            router.push('/');
        }
        setIsLoading(false);
    };

    const onRegisterSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setErrorMessage(null);
        const { error } = await authClient.signUp.email({
            email: data.email,
            name: data.name,
            password: data.password,
        });
        if (error) {
            setErrorMessage(
                error.code === 'USER_ALREADY_EXISTS' ||
                    error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
                    ? t('errors.emailTaken')
                    : t('errors.generic'),
            );
        } else {
            router.push('/');
        }
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        {t('title')}
                    </h1>
                    <p className="mt-2 text-zinc-400">{t('subtitle')}</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    {/* Tabs */}
                    <div className="relative mb-6 flex rounded-xl bg-zinc-800 p-1">
                        {(['login', 'register'] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                    handleTabSwitch(tab);
                                }}
                                className="relative z-10 flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer"
                                style={{
                                    color:
                                        activeTab === tab ? '#fff' : '#a1a1aa',
                                }}
                            >
                                {t(`tabs.${tab}`)}
                            </button>
                        ))}
                        <motion.div
                            layoutId="activeTab"
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-brand"
                            style={{
                                left:
                                    activeTab === 'login'
                                        ? 4
                                        : 'calc(50% + 0px)',
                            }}
                            transition={{
                                damping: 30,
                                stiffness: 400,
                                type: 'spring',
                            }}
                        />
                    </div>

                    {/* Forms */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'login' ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                                className="space-y-4"
                            >
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="mb-1.5 block text-sm font-medium text-zinc-300"
                                    >
                                        {t('fields.email.label')}
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="login-email"
                                            type="email"
                                            placeholder={t(
                                                'fields.email.placeholder',
                                            )}
                                            {...loginForm.register('email')}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                                        />
                                    </div>
                                    {loginForm.formState.errors.email && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {
                                                loginForm.formState.errors.email
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="login-password"
                                        className="mb-1.5 block text-sm font-medium text-zinc-300"
                                    >
                                        {t('fields.password.label')}
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="login-password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder={t(
                                                'fields.password.placeholder',
                                            )}
                                            {...loginForm.register('password')}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPassword(!showPassword);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {loginForm.formState.errors.password && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {
                                                loginForm.formState.errors
                                                    .password.message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Forgot password */}
                                <div className="text-right">
                                    <Link
                                        href="/sign-in/forgot-password"
                                        className="text-xs text-brand hover:underline"
                                    >
                                        {t('forgotPasswordCta')}
                                    </Link>
                                </div>

                                {/* Error message */}
                                {errorMessage && (
                                    <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
                                        {errorMessage}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer disabled:cursor-default disabled:bg-zinc-700 disabled:text-zinc-400"
                                >
                                    {t('actions.login')}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-zinc-700" />
                                    <span className="text-xs text-zinc-500">
                                        {t('orContinueWith')}
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-700" />
                                </div>

                                {/* Google */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        void authClient.signIn.social({
                                            provider: 'google',
                                            callbackURL: `${window.location.origin}/`,
                                        });
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </button>

                                {/* Discord + Roblox */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void authClient.signIn.social({
                                                provider: 'discord',
                                                callbackURL: `${window.location.origin}/`,
                                            });
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 fill-current"
                                            aria-hidden="true"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                        Discord
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void authClient.signIn.social({
                                                provider: 'twitch',
                                                callbackURL: `${window.location.origin}/`,
                                            });
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 fill-current"
                                            aria-hidden="true"
                                        >
                                            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                                        </svg>
                                        Twitch
                                    </button>
                                </div>

                                {/* More providers toggle */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMoreProviders(
                                            !showMoreProviders,
                                        );
                                    }}
                                    className="flex w-full items-center justify-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                >
                                    {t('moreOptions')}
                                    <ChevronDown
                                        className="h-3 w-3 transition-transform duration-200"
                                        style={{
                                            transform: showMoreProviders
                                                ? 'rotate(180deg)'
                                                : 'rotate(0deg)',
                                        }}
                                    />
                                </button>

                                {/* Hidden providers */}
                                <AnimatePresence>
                                    {showMoreProviders && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void authClient.signIn.social(
                                                        {
                                                            provider: 'roblox',
                                                            callbackURL: `${window.location.origin}/`,
                                                        },
                                                    );
                                                }}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-4 w-4 fill-current"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M4.597 0L0 19.098 15.4 23 20 3.902zM13.37 14.057l-4.57-1.158 1.158-4.57 4.57 1.158z" />
                                                </svg>
                                                Roblox
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={registerForm.handleSubmit(
                                    onRegisterSubmit,
                                )}
                                className="space-y-4"
                            >
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="register-name"
                                        className="mb-1.5 block text-sm font-medium text-zinc-300"
                                    >
                                        {t('fields.name.label')}
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-name"
                                            type="text"
                                            placeholder={t(
                                                'fields.name.placeholder',
                                            )}
                                            {...registerForm.register('name')}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                                        />
                                    </div>
                                    {registerForm.formState.errors.name && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {
                                                registerForm.formState.errors
                                                    .name.message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="register-email"
                                        className="mb-1.5 block text-sm font-medium text-zinc-300"
                                    >
                                        {t('fields.email.label')}
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-email"
                                            type="email"
                                            placeholder={t(
                                                'fields.email.placeholder',
                                            )}
                                            {...registerForm.register('email')}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                                        />
                                    </div>
                                    {registerForm.formState.errors.email && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {
                                                registerForm.formState.errors
                                                    .email.message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="register-password"
                                        className="mb-1.5 block text-sm font-medium text-zinc-300"
                                    >
                                        {t('fields.password.label')}
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder={t(
                                                'fields.password.placeholder',
                                            )}
                                            {...registerForm.register(
                                                'password',
                                            )}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPassword(!showPassword);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {registerForm.formState.errors.password && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {
                                                registerForm.formState.errors
                                                    .password.message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="register-confirm-password"
                                        className="mb-1.5 block text-sm font-medium text-zinc-300"
                                    >
                                        {t('fields.confirmPassword.label')}
                                    </label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder={t(
                                                'fields.confirmPassword.placeholder',
                                            )}
                                            {...registerForm.register(
                                                'confirmPassword',
                                            )}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                );
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {registerForm.formState.errors
                                        .confirmPassword && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {
                                                registerForm.formState.errors
                                                    .confirmPassword.message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Error message */}
                                {errorMessage && (
                                    <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
                                        {errorMessage}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer"
                                >
                                    {t('actions.register')}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-zinc-700" />
                                    <span className="text-xs text-zinc-500">
                                        {t('orContinueWith')}
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-700" />
                                </div>

                                {/* Google */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        void authClient.signIn.social({
                                            provider: 'google',
                                            callbackURL: `${window.location.origin}/`,
                                        });
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </button>

                                {/* Discord + Roblox */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void authClient.signIn.social({
                                                provider: 'discord',
                                                callbackURL: `${window.location.origin}/`,
                                            });
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 fill-current"
                                            aria-hidden="true"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                        Discord
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void authClient.signIn.social({
                                                provider: 'twitch',
                                                callbackURL: `${window.location.origin}/`,
                                            });
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 fill-current"
                                            aria-hidden="true"
                                        >
                                            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                                        </svg>
                                        Twitch
                                    </button>
                                </div>

                                {/* More providers toggle */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMoreProviders(
                                            !showMoreProviders,
                                        );
                                    }}
                                    className="flex w-full items-center justify-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                                >
                                    {t('moreOptions')}
                                    <ChevronDown
                                        className="h-3 w-3 transition-transform duration-200"
                                        style={{
                                            transform: showMoreProviders
                                                ? 'rotate(180deg)'
                                                : 'rotate(0deg)',
                                        }}
                                    />
                                </button>

                                {/* Hidden providers */}
                                <AnimatePresence>
                                    {showMoreProviders && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void authClient.signIn.social(
                                                        {
                                                            provider: 'roblox',
                                                            callbackURL: `${window.location.origin}/`,
                                                        },
                                                    );
                                                }}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-4 w-4 fill-current"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M4.597 0L0 19.098 15.4 23 20 3.902zM13.37 14.057l-4.57-1.158 1.158-4.57 4.57 1.158z" />
                                                </svg>
                                                Roblox
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
