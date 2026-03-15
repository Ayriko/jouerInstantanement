'use client';

import { ArrowLeft, Check, Copy, Key, Loader2, Package } from 'lucide-react';
import { motion } from 'motion/react';
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

export default function OrderDetail({
    orderId,
}: Readonly<{ orderId: string }>) {
    const t = useTranslations('account.orders');
    const { data: session } = authClient.useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!session) return;
        fetch('/api/payments/orders', {
            headers: { Authorization: `Bearer ${session.session.token}` },
        })
            .then((r) => r.json() as Promise<Order[]>)
            .then((data) => {
                const found = data.find((o) => o.id === orderId) ?? null;
                if (!found) setNotFound(true);
                setOrder(found);
            })
            .catch(() => setNotFound(true))
            .finally(() => setIsLoading(false));
    }, [session, orderId]);

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    if (notFound || !order) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-zinc-950 px-4 py-12">
                <div className="max-w-2xl mx-auto text-center py-16">
                    <p className="text-zinc-400">{t('detail.notFound')}</p>
                    <Link
                        href="/my-account/orders"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-brand hover:text-brand-active transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('detail.back')}
                    </Link>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950 px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/my-account/orders"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('detail.back')}
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('detail.orderNumber')}
                            </span>
                            <p className="font-mono text-sm font-semibold text-white mt-0.5">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('detail.date')}
                            </span>
                            <p className="text-sm font-semibold text-white mt-0.5">
                                {orderDate}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('detail.status')}
                            </span>
                            <p className="mt-0.5">
                                <span
                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-zinc-700 text-zinc-300'}`}
                                >
                                    {t(`status.${order.status}`)}
                                </span>
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500">
                                {t('detail.total')}
                            </span>
                            <p className="text-sm font-bold text-brand mt-0.5">
                                {order.totalAmount.toFixed(2).replace('.', ',')}
                                €
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Items */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                    <h2 className="flex items-center gap-2 text-base font-semibold text-white mb-4">
                        <Package className="h-4 w-4 text-brand" />
                        {t('detail.items')}
                    </h2>
                    <div className="divide-y divide-zinc-800">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="py-4 first:pt-0 last:pb-0"
                            >
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <p className="font-medium text-white">
                                        {item.gameName}
                                    </p>
                                    <span className="text-sm font-bold text-white flex-shrink-0">
                                        {item.unitPrice
                                            .toFixed(2)
                                            .replace('.', ',')}
                                        €
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Key className="h-3.5 w-3.5 flex-shrink-0 text-brand" />
                                    <span className="text-xs text-zinc-500">
                                        {t('detail.key')} :
                                    </span>
                                    {item.assignedKey ? (
                                        <CopyableKey
                                            value={item.assignedKey}
                                            copyLabel={t('detail.copy')}
                                            copiedLabel={t('detail.copied')}
                                        />
                                    ) : (
                                        <span className="text-xs text-zinc-600 italic">
                                            {t('detail.keyPending')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function CopyableKey({
    value,
    copyLabel,
    copiedLabel,
}: Readonly<{ value: string; copyLabel: string; copiedLabel: string }>) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        void navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex items-center gap-1.5 min-w-0">
            <code className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs font-semibold tracking-wider text-green-400 select-all truncate">
                {value}
            </code>
            <button
                type="button"
                onClick={handleCopy}
                className="flex-shrink-0 rounded p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                aria-label={copyLabel}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
            </button>
        </div>
    );
}
