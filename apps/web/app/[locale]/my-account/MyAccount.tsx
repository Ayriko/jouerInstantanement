'use client';

import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export default function MyAccount() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

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
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
                <h1 className="text-2xl font-bold text-white">Mon compte</h1>

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
                            <Field label="Email" value={session.user.email} />
                            <Field
                                label="Email vérifié"
                                value={
                                    session.user.emailVerified ? 'Oui' : 'Non'
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
                        </div>
                    </div>
                ) : (
                    <p className="text-zinc-400">Aucune session active.</p>
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
    );
}

function Field({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string | undefined | null;
    mono?: boolean;
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
