'use client';

import {
    CheckCircle,
    Package,
    ArrowLeft,
    Key,
    XCircle,
    Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useCart } from '@/context/CartContext';
import { Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

interface OrderItem {
    id: string;
    gameId: string;
    gameName: string;
    quantity: number;
    unitPrice: number;
}

interface Order {
    id: string;
    stripePaymentId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderConfirmation() {
    const t = useTranslations('order.confirmation');
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const redirectStatus = searchParams.get('redirect_status');
    const succeeded = redirectStatus === 'succeeded';

    const { data: session } = authClient.useSession();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(succeeded);
    const cartCleared = useRef(false);

    useEffect(() => {
        if (!succeeded || !session) return;

        if (!cartCleared.current) {
            cartCleared.current = true;
            clearCart();
        }

        fetch('/api/payments/orders', {
            headers: { Authorization: `Bearer ${session.session.token}` },
        })
            .then((res) => res.json() as Promise<Order[]>)
            .then((orders) => setOrder(orders[0] ?? null))
            .catch(() => setOrder(null))
            .finally(() => setIsLoading(false));
    }, [session]);

    if (!succeeded) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
                <div className="mx-auto max-w-3xl px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center text-center"
                    >
                        <XCircle className="mb-4 h-16 w-16 text-red-400" />
                        <h1 className="text-3xl font-bold text-white">
                            {t('failed.title')}
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            {t('failed.subtitle')}
                        </p>
                        <Link
                            href="/order"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t('failed.retry')}
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    const orderDate = order
        ? new Date(order.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString();

    const subtotal =
        order?.items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0,
        ) ??
        order?.totalAmount ??
        0;

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
                {order && (
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
                                    {order.stripePaymentId}
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
                )}

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
                {order && order.items.length > 0 && (
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
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <p className="font-medium text-white">
                                        {item.gameName}
                                    </p>
                                    <span className="font-bold text-white">
                                        {item.unitPrice
                                            .toFixed(2)
                                            .replace('.', ',')}
                                        €
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Payment summary */}
                {order && (
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
                                    {subtotal.toFixed(2).replace('.', ',')}€
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-base font-semibold text-white">
                                {t('payment.total')}
                            </span>
                            <span className="text-2xl font-bold text-brand">
                                {order.totalAmount.toFixed(2).replace('.', ',')}
                                €
                            </span>
                        </div>
                    </motion.div>
                )}

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
