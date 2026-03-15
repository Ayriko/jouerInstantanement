'use client';

import { ChevronRight, PackageOpen, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

interface OrderItem {
    id: string;
    gameName: string;
    quantity: number;
    unitPrice: number;
    assignedKey: string | null;
}

interface Order {
    id: string;
    stripePaymentId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

const STATUS_STYLES: Record<string, string> = {
    PAID: 'bg-green-500/10 text-green-400 border-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
    REFUNDED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function Orders() {
    const t = useTranslations('account.orders');
    const { data: session } = authClient.useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session) return;
        fetch('/api/payments/orders', {
            headers: { Authorization: `Bearer ${session.session.token}` },
        })
            .then((r) => r.json() as Promise<Order[]>)
            .then((data) =>
                setOrders(
                    data.sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                    ),
                ),
            )
            .catch(() => setOrders([]))
            .finally(() => setIsLoading(false));
    }, [session]);

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-zinc-950 px-4 py-12">
                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-8" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 bg-zinc-800 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950 px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-white">
                        {t('title')}
                    </h1>
                    {orders.length > 0 && (
                        <p className="text-zinc-400 text-sm mt-1">
                            {t('count', { count: orders.length })}
                        </p>
                    )}
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6 text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                            <PackageOpen className="w-10 h-10 text-zinc-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                {t('empty.title')}
                            </h2>
                            <p className="text-zinc-400 text-sm">
                                {t('empty.description')}
                            </p>
                        </div>
                        <Link
                            href="/games"
                            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-active text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            {t('empty.cta')}
                        </Link>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-3">
                            {orders.map((order, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Link
                                        href={`/my-account/orders/${order.id}`}
                                        className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors group"
                                    >
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-mono text-xs text-zinc-500 truncate">
                                                    #
                                                    {order.id
                                                        .slice(0, 8)
                                                        .toUpperCase()}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-zinc-700 text-zinc-300'}`}
                                                >
                                                    {t(
                                                        `status.${order.status}`,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white font-medium truncate">
                                                {order.items
                                                    .map(
                                                        (item) => item.gameName,
                                                    )
                                                    .join(', ')}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(
                                                    order.createdAt,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className="text-lg font-bold text-white">
                                                {order.totalAmount
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                                €
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
