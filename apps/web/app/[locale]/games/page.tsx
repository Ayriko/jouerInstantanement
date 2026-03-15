import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { GameFiltersValue } from '@repo/shared-types';

import { GamesFilters } from './GamesFilters';
import GamesList from './GamesList';

async function fetchFiltersValue(): Promise<GameFiltersValue> {
    const res = await fetch(
        `${process.env.GATEWAY_URL}/api/games/filters-value`,
        { cache: 'force-cache' },
    );
    if (!res.ok) return { genres: [], platforms: [], tags: [] };
    const data = (await res.json()) as GameFiltersValue | GameFiltersValue[];
    // $queryRawUnsafe returns an array with one row
    const row = Array.isArray(data) ? data[0] : data;
    return {
        genres: (row?.genres ?? []).filter(Boolean).sort(),
        platforms: (row?.platforms ?? []).filter(Boolean).sort(),
        tags: (row?.tags ?? []).filter(Boolean).sort(),
    };
}

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
    searchParams: Promise<{
        page?: string;
        name?: string | string[];
        genres?: string | string[];
        platforms?: string | string[];
        rating?: string | string[];
        price?: string | string[];
        inStock?: string | string[];
    }>;
}): Promise<React.JSX.Element> {
    const params = await searchParams;
    const page = Math.max(1, parseInt((params.page as string) ?? '1', 10));

    const t = await getTranslations('games');
    const filtersValue = await fetchFiltersValue();

    const filters = {
        name: params.name,
        genres: params.genres,
        platforms: params.platforms,
        rating: params.rating,
        price: params.price,
        inStock: params.inStock,
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-screen-xl">
            <h1 className="text-3xl font-bold text-white mb-8">
                {t('meta.title')}
            </h1>

            <div className="flex gap-8 items-start">
                {/* Sidebar filtres */}
                <aside className="w-64 flex-none sticky top-4">
                    <Suspense fallback={null}>
                        <GamesFilters filtersValue={filtersValue} />
                    </Suspense>
                </aside>

                {/* Liste des jeux */}
                <div className="flex-1 min-w-0">
                    <GamesList page={page} filters={filters} />
                </div>
            </div>
        </div>
    );
}
