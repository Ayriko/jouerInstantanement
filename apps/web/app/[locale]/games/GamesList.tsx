import { Game, Pagination } from '@repo/shared-types';
import { getTranslations } from 'next-intl/server';

import { GameCard } from '@/components/home/GameCard';
import { Link } from '@/i18n/navigation';

interface GamesListFilters {
    name?: string | string[];
    genres?: string | string[];
    platforms?: string | string[];
    rating?: string | string[];
    price?: string | string[];
    inStock?: string | string[];
}

async function fetchGames(
    page: number,
    take: number,
    filters: GamesListFilters,
): Promise<Pagination<Game>> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('take', String(take));

    const first = (v: string | string[] | undefined) =>
        Array.isArray(v) ? v[0] : v;

    if (filters.name) params.set('name', first(filters.name)!);
    if (filters.rating) params.set('rating', first(filters.rating)!);
    if (filters.price) params.set('price', first(filters.price)!);
    if (first(filters.inStock) === 'true') params.set('inStock', 'true');

    const toArray = (v: string | string[] | undefined) =>
        v === undefined ? [] : Array.isArray(v) ? v : [v];

    toArray(filters.genres).forEach((g) => params.append('genres', g));
    toArray(filters.platforms).forEach((p) => params.append('platforms', p));

    const res = await fetch(
        `${process.env.GATEWAY_URL}/api/games?${params.toString()}`,
        { cache: 'no-store' },
    );
    if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
    return res.json() as Promise<Pagination<Game>>;
}

function buildPaginationHref(page: number, filters: GamesListFilters): string {
    const params = new URLSearchParams();
    params.set('page', String(page));

    const first = (v: string | string[] | undefined) =>
        Array.isArray(v) ? v[0] : v;
    const toArray = (v: string | string[] | undefined) =>
        v === undefined ? [] : Array.isArray(v) ? v : [v];

    if (filters.name) params.set('name', first(filters.name)!);
    if (filters.rating) params.set('rating', first(filters.rating)!);
    if (filters.price) params.set('price', first(filters.price)!);
    if (first(filters.inStock) === 'true') params.set('inStock', 'true');
    toArray(filters.genres).forEach((g) => params.append('genres', g));
    toArray(filters.platforms).forEach((p) => params.append('platforms', p));

    return `/games?${params.toString()}`;
}

export default async function GamesList({
    page = 1,
    take = 24,
    filters = {},
}: {
    page?: number;
    take?: number;
    filters?: GamesListFilters;
}) {
    const t = await getTranslations('games.list');
    let result: Pagination<Game>;

    try {
        result = await fetchGames(page, take, filters);
    } catch {
        return <p className="text-center text-zinc-400 py-16">{t('error')}</p>;
    }

    const { hasNext, hasPrevious, items: games, total } = result;

    if (games.length === 0) {
        return <p className="text-center text-zinc-400 py-16">{t('empty')}</p>;
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-zinc-400">
                {t('count', { count: total })}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>

            {(hasPrevious || hasNext) && (
                <div className="flex items-center justify-center gap-3 pt-4">
                    {hasPrevious && (
                        <Link
                            href={buildPaginationHref(page - 1, filters)}
                            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                            {t('pagination.previous')}
                        </Link>
                    )}
                    <span className="text-sm text-zinc-500">
                        {t('pagination.page', { page })}
                    </span>
                    {hasNext && (
                        <Link
                            href={buildPaginationHref(page + 1, filters)}
                            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                            {t('pagination.next')}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
