'use client';

import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Link } from '@/i18n/navigation';
import { Game } from '@repo/shared-types';

export default function Wishlist() {
    const t = useTranslations('account.wishlist');
    const { games, isLoading, toggleWishlist } = useWishlist();

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-zinc-950 px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
                    <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-8" />
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-32 bg-zinc-800 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950 px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-white">
                        {t('title')}
                    </h1>
                    {games.length > 0 && (
                        <p className="text-zinc-400 text-sm mt-1">
                            {t('count', { count: games.length })}
                        </p>
                    )}
                </motion.div>

                {games.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6 text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                            <Heart className="w-10 h-10 text-zinc-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                {t('empty.title')}
                            </h2>
                            <p className="text-zinc-400 text-sm">
                                {t('empty.description')}
                            </p>
                        </div>
                        <Link
                            href="/games"
                            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-active text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            {t('empty.cta')}
                        </Link>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <div className="space-y-4">
                            {games.map((game, i) => (
                                <WishlistItem
                                    key={game.id}
                                    game={game}
                                    index={i}
                                    onRemove={() =>
                                        void toggleWishlist(game.id)
                                    }
                                    removeLabel={t('remove')}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

function WishlistItem({
    game,
    index,
    onRemove,
    removeLabel,
}: {
    readonly game: Game;
    readonly index: number;
    readonly onRemove: () => void;
    readonly removeLabel: string;
}) {
    const { addItem, isInCart, removeItem } = useCart();
    const t = useTranslations('games.detail');

    const inCart = isInCart(game.id);
    const outOfStock = game.availableKeyCount === 0;

    const discount =
        game.initialPrice > game.total
            ? Math.round((1 - game.total / game.initialPrice) * 100)
            : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
        >
            {/* Cover image */}
            <Link href={`/games/${game.id}`} className="flex-shrink-0">
                <img
                    src={game.coverImage}
                    alt={game.name}
                    className="h-28 w-20 rounded-lg object-cover"
                />
            </Link>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                    <Link
                        href={`/games/${game.id}`}
                        className="font-semibold text-white hover:text-brand transition-colors line-clamp-2"
                    >
                        {game.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        {game.platforms.length > 0 && (
                            <span className="rounded border border-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400">
                                {game.platforms[0]}
                            </span>
                        )}
                        {game.genres.length > 0 && (
                            <span className="text-xs text-zinc-500">
                                {game.genres[0]}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                        <Heart className="h-3 w-3 fill-red-400" />
                        {removeLabel}
                    </button>
                    <button
                        type="button"
                        disabled={outOfStock}
                        onClick={() => {
                            if (!outOfStock) {
                                inCart ? removeItem(game.id) : addItem(game);
                            }
                        }}
                        className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
                            outOfStock
                                ? 'text-zinc-600 cursor-not-allowed'
                                : inCart
                                  ? 'text-zinc-400 hover:text-zinc-300 cursor-pointer'
                                  : 'text-brand hover:text-brand-active cursor-pointer'
                        }`}
                    >
                        <ShoppingCart className="h-3 w-3" />
                        {outOfStock
                            ? t('stock.outOfStock')
                            : inCart
                              ? t('actions.cart.remove')
                              : t('actions.cart.add')}
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end justify-between flex-shrink-0">
                {discount > 0 && (
                    <span className="text-xs text-zinc-500 line-through">
                        {game.initialPrice.toFixed(2).replace('.', ',')}€
                    </span>
                )}
                <div className="flex items-center gap-2">
                    {discount > 0 && (
                        <span className="rounded bg-brand/20 px-1.5 py-0.5 text-xs font-bold text-brand">
                            -{discount}%
                        </span>
                    )}
                    <span className="text-lg font-bold text-white">
                        {game.total.toFixed(2).replace('.', ',')}€
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
