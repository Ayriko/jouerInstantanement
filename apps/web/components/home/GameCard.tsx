'use client';

import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useCart } from '@/context/CartContext';
import { Game } from '@repo/shared-types';

interface GameCardProps {
    game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
    const router = useRouter();
    const { addItem, removeItem, isInCart } = useCart();
    const t = useTranslations('games.detail.actions.cart');

    const discount =
        game.initialPrice != null &&
        game.total != null &&
        game.initialPrice > game.total
            ? Math.round((1 - game.total / game.initialPrice) * 100)
            : 0;

    const inCart = isInCart(game.id);

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
            {game.rating !== null && (
                <div className="absolute top-2 left-2 z-10 bg-zinc-900/80 backdrop-blur-sm text-yellow-400 font-bold px-2 py-1 rounded text-sm shadow-md flex items-center gap-1">
                    <span>★</span>
                    <span>{game.rating.toFixed(1)}</span>
                </div>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-2 right-2 z-10 bg-brand text-white font-black px-2 py-1 rounded text-sm shadow-md">
                    -{discount}%
                </div>
            )}

            {/* Image Container */}
            <div className="aspect-video overflow-hidden relative">
                <img
                    src={game.backgroundImage}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Add to cart button - slides up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            inCart ? removeItem(game.id) : addItem(game);
                        }}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm text-white transition-colors cursor-pointer ${
                            inCart
                                ? 'bg-zinc-700 hover:bg-zinc-600'
                                : 'bg-brand hover:bg-brand-active shadow-lg shadow-orange-500/30'
                        }`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {inCart ? t('remove') : t('add')}
                    </button>
                </div>
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
                {game.total != null && (
                    <div className="mt-2 flex items-center gap-2">
                        {discount > 0 && game.initialPrice != null && (
                            <span className="text-zinc-500 text-xs line-through">
                                {game.initialPrice.toFixed(2).replace('.', ',')}
                                €
                            </span>
                        )}
                        <span
                            className={`font-bold text-sm ${discount > 0 ? 'text-green-400' : 'text-white'}`}
                        >
                            {game.total.toFixed(2).replace('.', ',')}€
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
