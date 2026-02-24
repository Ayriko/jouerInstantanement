'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Game } from '@/types/game';

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
            {/* Discount Badge */}
            <div className="absolute top-2 left-2 z-10 bg-brand text-white font-bold px-2 py-1 rounded text-sm shadow-md">
                -{game.discount}%
            </div>

            {/* Image Container */}
            <div className="aspect-[3/4] overflow-hidden relative">
                <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {/* Quick action could go here if needed */}
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3
                    className="text-white font-medium truncate text-sm mb-1"
                    title={game.title}
                >
                    {game.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-zinc-500 text-xs line-through">
                        {game.originalPrice.toFixed(2)}€
                    </span>
                    <span className="text-brand font-bold text-lg">
                        {game.price.toFixed(2)}€
                    </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                    <span
                        className={`px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-400`}
                    >
                        {game.platform}
                    </span>
                    <span className="truncate">{game.category}</span>
                </div>
            </div>
        </motion.div>
    );
};
