'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

const PROVIDER_LABELS: Record<string, string> = {
    discord: 'Discord',
    google: 'Google',
    github: 'GitHub',
};

interface Account {
    providerId: string;
    accountId: string;
    userId: string;
    updatedAt: Date;
}

export default function MyAccount() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [socialProviders, setSocialProviders] = useState<string[]>([]);
    const [hasCredential, setHasCredential] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

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

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/sign-in');
    };

    if (isPending) {
        return (
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                <p className="text-zinc-400">Chargement...</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-white">
                        Mon compte
                    </h1>

                    {session?.user ? (
                        <div className="space-y-4">
                            {session.user.image && (
                                <img
                                    src={session.user.image}
                                    alt="Avatar"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            )}

                            <div className="space-y-3">
                                <Field label="Nom" value={session.user.name} />
                                <Field
                                    label="Email"
                                    value={session.user.email}
                                />
                                <Field
                                    label="Email vérifié"
                                    value={
                                        session.user.emailVerified
                                            ? 'Oui'
                                            : 'Non'
                                    }
                                />
                                <Field
                                    label="Compte créé le"
                                    value={new Date(
                                        session.user.createdAt,
                                    ).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                />
                                {socialProviders.length > 0 && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                                            Connexion via
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {socialProviders.map((provider) => (
                                                <span
                                                    key={provider}
                                                    className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300"
                                                >
                                                    {PROVIDER_LABELS[
                                                        provider
                                                    ] ?? provider}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-zinc-400">Aucune session active.</p>
                    )}

                    {hasCredential && (
                        <button
                            type="button"
                            onClick={() => {
                                setShowPasswordModal(true);
                            }}
                            className="w-full rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 cursor-pointer"
                        >
                            Changer le mot de passe
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 cursor-pointer"
                    >
                        Se déconnecter
                    </button>
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
            setError('Les mots de passe ne correspondent pas.');
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
                    ? 'Mot de passe actuel incorrect.'
                    : 'Une erreur est survenue, veuillez réessayer.',
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
                        Changer le mot de passe
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
                        <p className="text-sm text-green-400">
                            Mot de passe modifié avec succès.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-active cursor-pointer"
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <PasswordField
                            id="current-password"
                            label="Mot de passe actuel"
                            onChange={setCurrentPassword}
                            onToggle={() => {
                                setShowCurrent(!showCurrent);
                            }}
                            show={showCurrent}
                            value={currentPassword}
                        />
                        <PasswordField
                            id="new-password"
                            label="Nouveau mot de passe"
                            onChange={setNewPassword}
                            onToggle={() => {
                                setShowNew(!showNew);
                            }}
                            show={showNew}
                            value={newPassword}
                        />
                        <PasswordField
                            id="confirm-password"
                            label="Confirmer le nouveau mot de passe"
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
                            Confirmer
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
