import React from 'react';

import type { Game } from '@repo/shared-types';

import { GameCard } from '@/components/home/GameCard';
import { Link } from '@/i18n/navigation';

interface GamesGridProps {
    games: Game[];
    title?: string;
    seeAllHref?: string;
    seeAllLabel?: string;
    cols?: 3 | 4;
}

export default function GamesGrid({
    games,
    title,
    seeAllHref,
    seeAllLabel,
    cols = 4,
}: Readonly<GamesGridProps>): React.JSX.Element {
    if (games.length === 0) return <></>;

    const gridClass =
        cols === 3
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full bg-brand" />
                        <h2 className="text-2xl font-bold text-white">
                            {title}
                        </h2>
                    </div>
                    {seeAllHref && seeAllLabel && (
                        <Link
                            href={seeAllHref}
                            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            {seeAllLabel}
                        </Link>
                    )}
                </div>
            )}
            <div className={gridClass}>
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </section>
    );
}
