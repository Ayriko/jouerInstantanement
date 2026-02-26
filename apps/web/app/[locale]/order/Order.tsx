'use client';

import {
    ArrowLeft,
    ArrowRight,
    CreditCard,
    Lock,
    PackageOpen,
    Shield,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useCart } from '@/context/CartContext';
import { Link } from '@/i18n/navigation';

export default function Order() {
    const t = useTranslations('order');
    const { discount, items, subtotal, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
                <div className="mx-auto max-w-5xl px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900 py-16 text-center"
                    >
                        <PackageOpen className="mb-4 h-16 w-16 text-zinc-600" />
                        <h2 className="text-xl font-semibold text-white">
                            {t('empty.title')}
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                            {t('empty.subtitle')}
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active"
                        >
                            {t('empty.cta')}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
            <div className="mx-auto max-w-5xl px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <Link
                        href="/cart"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('checkout.backToCart')}
                    </Link>
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                        <CreditCard className="h-8 w-8" />
                        {t('checkout.title')}
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left: Payment method */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                                <Lock className="h-5 w-5 text-brand" />
                                {t('checkout.paymentMethod')}
                            </h2>

                            {/* Stripe placeholder */}
                            <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-700 bg-zinc-800/50 py-16">
                                <CreditCard className="mb-4 h-12 w-12 text-zinc-600" />
                                <p className="text-sm text-zinc-400">
                                    {t('checkout.paymentPlaceholder')}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                                <Shield className="h-3.5 w-3.5" />
                                {t('checkout.securePayment')}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Order summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                    >
                        <h2 className="mb-4 text-lg font-semibold text-white">
                            {t('checkout.orderSummary')}
                        </h2>

                        {/* Items */}
                        <div className="space-y-3 border-b border-zinc-800 pb-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={item.coverImage}
                                        alt={item.name}
                                        className="h-12 w-9 flex-shrink-0 rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-white">
                                            {item.name}
                                        </p>
                                        {item.platforms.length > 0 && (
                                            <span className="text-xs text-zinc-500">
                                                {item.platforms[0]}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-white">
                                        {item.total
                                            .toFixed(2)
                                            .replace('.', ',')}
                                        €
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-4 space-y-3 border-b border-zinc-800 pb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-400">
                                    {t('checkout.subtotal')}
                                </span>
                                <span className="text-zinc-300">
                                    {subtotal.toFixed(2).replace('.', ',')}€
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-400">
                                    {t('checkout.discount')}
                                </span>
                                <span className="text-green-400">
                                    -{discount.toFixed(2).replace('.', ',')}€
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-base font-semibold text-white">
                                {t('checkout.total')}
                            </span>
                            <span className="text-2xl font-bold text-brand">
                                {total.toFixed(2).replace('.', ',')}€
                            </span>
                        </div>

                        {/* Pay button (disabled for now) */}
                        <button
                            type="button"
                            disabled
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
                        >
                            <Lock className="h-4 w-4" />
                            {t('checkout.pay')} —{' '}
                            {total.toFixed(2).replace('.', ',')}€
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
