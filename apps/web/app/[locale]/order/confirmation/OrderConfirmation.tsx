'use client';

import { CheckCircle, Package, ArrowLeft, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { games as allGames } from '@/data/games';
import { Link } from '@/i18n/navigation';

const orderedItems = allGames.slice(0, 3);
const orderNumber = 'JI-20260205-4829';
const orderDate = new Date().toLocaleDateString();

export default function OrderConfirmation() {
    const t = useTranslations('order.confirmation');

    const subtotal = orderedItems.reduce(
        (sum, item) => sum + item.originalPrice,
        0,
    );
    const total = orderedItems.reduce((sum, item) => sum + item.price, 0);
    const discount = subtotal - total;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
            <div className="mx-auto max-w-3xl px-4 py-12">
                {/* Success banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8 flex flex-col items-center text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            stiffness: 300,
                            type: 'spring',
                        }}
                    >
                        <CheckCircle className="mb-4 h-16 w-16 text-green-400" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white">
                        {t('title')}
                    </h1>
                    <p className="mt-2 text-zinc-400">{t('subtitle')}</p>
                </motion.div>

                {/* Order info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('orderNumber')}
                            </span>
                            <p className="font-mono text-sm font-semibold text-white">
                                {orderNumber}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('date')}
                            </span>
                            <p className="text-sm font-semibold text-white">
                                {orderDate}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('status')}
                            </span>
                            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-400">
                                <span className="h-2 w-2 rounded-full bg-green-400" />
                                {t('statusValue')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Delivery info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                        <Key className="h-5 w-5 text-brand" />
                        {t('delivery.title')}
                    </h2>
                    <p className="text-sm font-medium text-zinc-300">
                        {t('delivery.method')}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                        {t('delivery.info')}
                    </p>
                </motion.div>

                {/* Ordered items */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                        <Package className="h-5 w-5 text-brand" />
                        {t('items.title')}
                    </h2>
                    <div className="divide-y divide-zinc-800">
                        {orderedItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                            >
                                <img
                                    src={item.coverImage}
                                    alt={item.title}
                                    className="h-16 w-12 flex-shrink-0 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-white">
                                        {item.title}
                                    </p>
                                    <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400">
                                        {item.platform}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-zinc-500 line-through">
                                        {item.originalPrice.toFixed(2)}€
                                    </span>
                                    <span className="font-bold text-white">
                                        {item.price.toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Payment summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                    <div className="space-y-3 border-b border-zinc-800 pb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">
                                {t('payment.subtotal')}
                            </span>
                            <span className="text-zinc-300">
                                {subtotal.toFixed(2)}€
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">
                                {t('payment.discount')}
                            </span>
                            <span className="text-green-400">
                                -{discount.toFixed(2)}€
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-base font-semibold text-white">
                            {t('payment.total')}
                        </span>
                        <span className="text-2xl font-bold text-brand">
                            {total.toFixed(2)}€
                        </span>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex justify-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('actions.backHome')}
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
