'use client';

import {
    ChevronRight,
    Eye,
    EyeOff,
    PackageOpen,
    Receipt,
    X,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import type { Account } from 'better-auth';

import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

const PROVIDER_LABELS: Record<string, string> = {
    discord: 'Discord',
    google: 'Google',
    roblox: 'Roblox',
    twitch: 'Twitch',
};

const STATUS_STYLES: Record<string, string> = {
    PAID: 'bg-green-500/10 text-green-400 border-green-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
    REFUNDED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

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

export default function MyAccount() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('account.myAccount');
    const tOrders = useTranslations('account.orders');
    const { data: session, isPending } = authClient.useSession();
    const [socialProviders, setSocialProviders] = useState<string[]>([]);
    const [hasCredential, setHasCredential] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        void authClient.listAccounts().then(({ data }) => {
            const accounts = (data as Account[]) ?? [];
            setHasCredential(
                accounts.some((a) => a.providerId === 'credential'),
            );
            setSocialProviders(
                accounts
                    .map((a) => a.providerId)
                    .filter((p) => p !== 'credential'),
            );
        });
    }, [session?.user]);

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
            .finally(() => setOrdersLoading(false));
    }, [session]);

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/sign-in');
    };

    if (isPending) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <p className="text-zinc-400">{t('loading')}</p>
            </div>
        );
    }

    const recentOrders = orders.slice(0, 3);

    return (
        <>
            <div className="min-h-[calc(100vh-80px)] px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Left — User profile */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
                            <h1 className="text-2xl font-bold text-white">
                                {t('title')}
                            </h1>

                            {session?.user ? (
                                <div className="space-y-4">
                                    {session.user.image && (
                                        <img
                                            src={session.user.image}
                                            alt=""
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                    )}

                                    <div className="space-y-3">
                                        <Field
                                            label={t('fields.name')}
                                            value={session.user.name}
                                        />
                                        <Field
                                            label={t('fields.email')}
                                            value={session.user.email}
                                        />
                                        <Field
                                            label={t('fields.emailVerified')}
                                            value={
                                                session.user.emailVerified
                                                    ? t('fields.yes')
                                                    : t('fields.no')
                                            }
                                        />
                                        <Field
                                            label={t('fields.createdAt')}
                                            value={new Date(
                                                session.user.createdAt,
                                            ).toLocaleDateString(locale, {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        />
                                        {socialProviders.length > 0 && (
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-xs text-zinc-500 uppercase tracking-wide">
                                                    {t('fields.connectedVia')}
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {socialProviders.map(
                                                        (provider) => (
                                                            <span
                                                                key={provider}
                                                                className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300"
                                                            >
                                                                {PROVIDER_LABELS[
                                                                    provider
                                                                ] ?? provider}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-zinc-400">
                                    {t('noSession')}
                                </p>
                            )}

                            <div className="space-y-3 pt-2">
                                {hasCredential && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(true);
                                        }}
                                        className="w-full rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 cursor-pointer"
                                    >
                                        {t('actions.changePassword')}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 cursor-pointer"
                                >
                                    {t('actions.signOut')}
                                </button>
                            </div>
                        </div>

                        {/* Right — Recent orders */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-brand" />
                                    {t('actions.orders')}
                                </h2>
                                {orders.length > 0 && (
                                    <Link
                                        href="/my-account/orders"
                                        className="text-xs text-brand hover:text-brand-active transition-colors"
                                    >
                                        {tOrders('count', {
                                            count: orders.length,
                                        })}
                                    </Link>
                                )}
                            </div>

                            {ordersLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-20 bg-zinc-800 rounded-xl animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="flex flex-col items-center gap-4 py-10 text-center">
                                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <PackageOpen className="w-7 h-7 text-zinc-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white mb-1">
                                            {tOrders('empty.title')}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {tOrders('empty.description')}
                                        </p>
                                    </div>
                                    <Link
                                        href="/games"
                                        className="inline-flex items-center gap-2 bg-brand hover:bg-brand-active text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        {tOrders('empty.cta')}
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/my-account/orders/${order.id}`}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-800/40 p-3.5 hover:border-zinc-700 hover:bg-zinc-800 transition-colors group"
                                        >
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono text-xs text-zinc-500">
                                                        #
                                                        {order.id
                                                            .slice(0, 8)
                                                            .toUpperCase()}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-zinc-700 text-zinc-300'}`}
                                                    >
                                                        {tOrders(
                                                            `status.${order.status}`,
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white font-medium truncate">
                                                    {order.items
                                                        .map(
                                                            (item) =>
                                                                item.gameName,
                                                        )
                                                        .join(', ')}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {new Date(
                                                        order.createdAt,
                                                    ).toLocaleDateString(
                                                        locale,
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-sm font-bold text-white">
                                                    {order.totalAmount
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                    €
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                            </div>
                                        </Link>
                                    ))}

                                    {orders.length > 3 && (
                                        <Link
                                            href="/my-account/orders"
                                            className="flex items-center justify-center gap-1 w-full py-2.5 rounded-xl border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/40 transition-colors"
                                        >
                                            {t('actions.orders')}
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => {
                        setShowPasswordModal(false);
                    }}
                />
            )}
        </>
    );
}

function ChangePasswordModal({ onClose }: { readonly onClose: () => void }) {
    const t = useTranslations('account.myAccount.changePassword');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('errors.passwordsMismatch'));
            return;
        }
        setIsLoading(true);
        setError(null);
        const { error: err } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: false,
        });
        if (err) {
            setError(
                err.code === 'INVALID_PASSWORD'
                    ? t('errors.invalidPassword')
                    : t('errors.generic'),
            );
        } else {
            setSuccess(true);
        }
        setIsLoading(false);
    };

    return (
        <div
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
            <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        {t('title')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {success ? (
                    <div className="space-y-4">
                        <p className="text-sm text-green-400">{t('success')}</p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer"
                        >
                            {t('actions.close')}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <PasswordField
                            id="current-password"
                            label={t('fields.currentPassword')}
                            onChange={setCurrentPassword}
                            onToggle={() => {
                                setShowCurrent(!showCurrent);
                            }}
                            show={showCurrent}
                            value={currentPassword}
                        />
                        <PasswordField
                            id="new-password"
                            label={t('fields.newPassword')}
                            onChange={setNewPassword}
                            onToggle={() => {
                                setShowNew(!showNew);
                            }}
                            show={showNew}
                            value={newPassword}
                        />
                        <PasswordField
                            id="confirm-password"
                            label={t('fields.confirmPassword')}
                            onChange={setConfirmPassword}
                            onToggle={() => {
                                setShowConfirm(!showConfirm);
                            }}
                            show={showConfirm}
                            value={confirmPassword}
                        />

                        {error && (
                            <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer disabled:cursor-default disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                            {t('actions.confirm')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function PasswordField({
    id,
    label,
    onChange,
    onToggle,
    show,
    value,
}: {
    readonly id: string;
    readonly label: string;
    readonly onChange: (v: string) => void;
    readonly onToggle: () => void;
    readonly show: boolean;
    readonly value: string;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-4 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-brand"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                    {show ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
}

function Field({
    label,
    mono = false,
    value,
}: {
    readonly label: string;
    readonly mono?: boolean;
    readonly value: string | undefined | null;
}) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-zinc-500 uppercase tracking-wide">
                {label}
            </span>
            <span className={`text-sm text-white ${mono ? 'font-mono' : ''}`}>
                {value}
            </span>
        </div>
    );
}
