import React from 'react';

import type { GameProduct as Game } from '@repo/shared-types';

import { GameCard } from '@/components/home/GameCard';

interface GamesGridProps {
    games: Game[];
    title?: string;
}

export default function GamesGrid({
    games,
    title,
}: Readonly<GamesGridProps>): React.JSX.Element {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            {title && (
                <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </section>
    );
}
