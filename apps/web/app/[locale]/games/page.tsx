import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import GamesList from './GamesList';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: `${t('games.meta.title')} ${t('common.metaSeparator')} ${t('common.siteName')}`,
        description: t('games.meta.description'),
    };
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}): Promise<React.JSX.Element> {
    const { page: pageParam } = await searchParams;
    const page = Math.max(1, parseInt(pageParam ?? '1', 10));

    const t = await getTranslations('games');

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
            <h1 className="text-3xl font-bold text-white mb-8">
                {t('meta.title')}
            </h1>
            <GamesList page={page} />
        </div>
    );
}
