'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Game } from '@repo/shared-types';

interface GameCardProps {
    game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
    const router = useRouter();

    return (
        <motion.div
            layout
            whileHover={{ y: -5 }}
            className="group relative bg-zinc-800 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-orange-500/10 transition-all duration-300"
            onClick={() => {
                router.push(`/games/${game.id}`);
            }}
        >
            {/* Rating Badge */}
            <div className="absolute top-2 left-2 z-10 bg-zinc-900/80 backdrop-blur-sm text-yellow-400 font-bold px-2 py-1 rounded text-sm shadow-md flex items-center gap-1">
                <span>★</span>
                <span>{game.rating.toFixed(1)}</span>
            </div>

            {/* Image Container */}
            <div className="aspect-video overflow-hidden relative">
                <img
                    src={game.backgroundImage}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-3">
                <h3
                    className="text-white font-medium truncate text-sm mb-2"
                    title={game.name}
                >
                    {game.name}
                </h3>
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
                    <div className="mt-1 flex flex-wrap gap-1">
                        {game.platforms.slice(0, 2).map((platform) => (
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
        </motion.div>
    );
};
