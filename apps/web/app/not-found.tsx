import { Gamepad2, Home } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';

export default async function RootNotFound() {
    const t = await getTranslations({
        locale: routing.defaultLocale,
        namespace: 'notFound',
    });

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                <div className="mb-8 inline-block">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand/20 rounded-full blur-2xl scale-150" />
                        <Gamepad2
                            className="relative h-20 w-20 text-brand"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                <h1 className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent select-none">
                    404
                </h1>

                <p className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {t('title')}
                </p>
                <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
                    {t('description')}
                </p>

                <a
                    href={`/${routing.defaultLocale}`}
                    className="inline-flex items-center gap-2 bg-brand hover:bg-brand-active text-white px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-brand/20"
                >
                    <Home className="h-5 w-5" />
                    {t('backHome')}
                </a>
            </div>
        </div>
    );
}
