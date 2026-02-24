'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Link } from '@/i18n/navigation';
import {
    loginSchema,
    registerSchema,
    type LoginFormData,
    type RegisterFormData,
} from '@/lib/validations/auth';

type Tab = 'login' | 'register';

export default function SignIn() {
    const t = useTranslations('account.signIn');
    const [activeTab, setActiveTab] = useState<Tab>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    };

    const onLoginSubmit = (data: LoginFormData) => {
        console.log('Login:', data);
    };

    const onRegisterSubmit = (data: RegisterFormData) => {
        console.log('Register:', data);
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

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer"
                                >
                                    {t('actions.login')}
                                </button>

                                {/* Switch to register */}
                                <p className="text-center text-sm text-zinc-400">
                                    {t('noAccount')}{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleTabSwitch('register');
                                        }}
                                        className="text-brand hover:underline cursor-pointer"
                                    >
                                        {t('tabs.register')}
                                    </button>
                                </p>
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

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer"
                                >
                                    {t('actions.register')}
                                </button>

                                {/* Switch to login */}
                                <p className="text-center text-sm text-zinc-400">
                                    {t('hasAccount')}{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleTabSwitch('login');
                                        }}
                                        className="text-brand hover:underline cursor-pointer"
                                    >
                                        {t('tabs.login')}
                                    </button>
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
