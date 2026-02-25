import { Link } from '@/i18n/navigation';

interface Game {
    backgroundImage: string;
    genres: string[];
    id: string;
    name: string;
    platforms: string[];
    rating: number;
}

interface PaginationResult {
    hasNext: boolean;
    hasPrevious: boolean;
    items: Game[];
    page: number;
    take: number;
    total: number;
}

async function fetchGames(
    page: number,
    take: number,
): Promise<PaginationResult> {
    const res = await fetch(
        `${process.env.GATEWAY_URL}/api/games?page=${page}&take=${take}`,
        { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
    return res.json() as Promise<PaginationResult>;
}

export default async function GamesList({
    page = 1,
    take = 24,
}: {
    page?: number;
    take?: number;
}) {
    let result: PaginationResult;

    try {
        result = await fetchGames(page, take);
    } catch {
        return (
            <p className="text-center text-zinc-400 py-16">
                Impossible de charger les jeux. Veuillez réessayer plus tard.
            </p>
        );
    }

    const { items: games, total, hasNext, hasPrevious } = result;

    if (games.length === 0) {
        return (
            <p className="text-center text-zinc-400 py-16">
                Aucun jeu disponible.
            </p>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">
                    {total} jeu{total > 1 ? 'x' : ''}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {games.map((game) => (
                    <Link
                        key={game.id}
                        href={`/games/${game.id}`}
                        className="group block bg-zinc-800 rounded-xl overflow-hidden hover:ring-1 ring-brand transition-all duration-200"
                    >
                        <div className="aspect-video overflow-hidden">
                            <img
                                src={game.backgroundImage}
                                alt={game.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="p-3 space-y-2">
                            <h3
                                className="text-white text-sm font-medium truncate"
                                title={game.name}
                            >
                                {game.name}
                            </h3>

                            <div className="flex items-center gap-1 text-xs text-yellow-400">
                                <span>★</span>
                                <span>{game.rating.toFixed(1)}</span>
                            </div>

                            {game.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {game.genres.slice(0, 2).map((genre) => (
                                        <span
                                            key={genre}
                                            className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {game.platforms.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {game.platforms
                                        .slice(0, 2)
                                        .map((platform) => (
                                            <span
                                                key={platform}
                                                className="text-xs border border-zinc-600 text-zinc-400 px-1.5 py-0.5 rounded"
                                            >
                                                {platform}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {(hasPrevious || hasNext) && (
                <div className="flex items-center justify-center gap-3 pt-4">
                    {hasPrevious && (
                        <Link
                            href={`/games?page=${page - 1}`}
                            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                            Précédent
                        </Link>
                    )}
                    <span className="text-sm text-zinc-500">Page {page}</span>
                    {hasNext && (
                        <Link
                            href={`/games?page=${page + 1}`}
                            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                        >
                            Suivant
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
