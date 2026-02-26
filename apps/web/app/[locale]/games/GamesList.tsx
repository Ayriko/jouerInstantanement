import { Game, Pagination } from '@repo/shared-types';
import { getTranslations } from 'next-intl/server';

import { GameCard } from '@/components/home/GameCard';
import { Link } from '@/i18n/navigation';

async function fetchGames(
    page: number,
    take: number,
): Promise<Pagination<Game>> {
    const res = await fetch(
        `${process.env.GATEWAY_URL}/api/games?page=${page}&take=${take}`,
        { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
    return (await res.json()) as Promise<Pagination<Game>>;
}

export default async function GamesList({
    page = 1,
    take = 24,
}: {
    page?: number;
    take?: number;
}) {
    const t = await getTranslations('games.list');
    let result: Pagination<Game>;

    try {
        result = await fetchGames(page, take);
    } catch {
        return <p className="text-center text-zinc-400 py-16">{t('error')}</p>;
    }

    const { hasNext, hasPrevious, items: games, total } = result;

    if (games.length === 0) {
        return <p className="text-center text-zinc-400 py-16">{t('empty')}</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                    {t('count', { count: total })}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>

            {(hasPrevious || hasNext) && (
                <div className="flex items-center justify-center gap-3 pt-4">
                    {hasPrevious && (
                        <Link
                            href={`/games?page=${page - 1}`}
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
                            href={`/games?page=${page + 1}`}
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
