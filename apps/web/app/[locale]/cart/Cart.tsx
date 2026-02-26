'use client';

import { ShoppingCart, ArrowRight, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';

import { CartItemCard } from '@/components/cart/CartItemCard';
import { useCart } from '@/context/CartContext';
import { Link } from '@/i18n/navigation';

export default function Cart() {
    const t = useTranslations('cart');
    const { discount, items, removeItem, subtotal, total } = useCart();

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
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                        <ShoppingCart className="h-8 w-8" />
                        {t('title')}
                    </h1>
                    <p className="mt-1 text-zinc-400">
                        {t('itemCount', { count: items.length })}
                    </p>
                </motion.div>

                {items.length === 0 ? (
                    /* Empty state */
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
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Items list */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.map((item, index) => (
                                    <CartItemCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                        >
                            <h2 className="mb-4 text-lg font-semibold text-white">
                                {t('summary.title')}
                            </h2>

                            <div className="space-y-3 border-b border-zinc-800 pb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">
                                        {t('summary.subtotal')}
                                    </span>
                                    <span className="text-zinc-300">
                                        {subtotal.toFixed(2).replace('.', ',')}€
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">
                                        {t('summary.discount')}
                                    </span>
                                    <span className="text-green-400">
                                        -{discount.toFixed(2).replace('.', ',')}
                                        €
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-base font-semibold text-white">
                                    {t('summary.total')}
                                </span>
                                <span className="text-2xl font-bold text-brand">
                                    {total.toFixed(2).replace('.', ',')}€
                                </span>
                            </div>

                            <Link
                                href="/order"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-active"
                            >
                                {t('summary.checkout')}
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/"
                                className="mt-3 block text-center text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                            >
                                {t('summary.continueShopping')}
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
