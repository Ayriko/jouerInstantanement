'use client';

import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useCart } from '@/context/CartContext';
import { Link } from '@/i18n/navigation';
import { Game } from '@repo/shared-types';

interface CarouselGameCardProps {
    game: Game;
}

export const CarouselGameCard: React.FC<CarouselGameCardProps> = ({ game }) => {
    const { addItem, isInCart, removeItem } = useCart();
    const t = useTranslations('games.detail');

    const discount =
        game.initialPrice != null &&
        game.total != null &&
        game.initialPrice > game.total
            ? Math.round((1 - game.total / game.initialPrice) * 100)
            : 0;

    const inCart = isInCart(game.id);
    const outOfStock = game.availableKeyCount === 0;

    return (
        <motion.article
            layout
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-xl overflow-hidden shadow-xl cursor-pointer"
            style={{ aspectRatio: '3/4' }}
        >
            {/* Full-bleed cover image */}
            <img
                src={game.coverImage || game.backgroundImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Permanent gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Hover glow ring */}
            <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-brand/60 transition-all duration-300 shadow-[0_0_0_0] group-hover:shadow-[0_0_30px_rgba(255,84,0,0.25)] pointer-events-none" />

            {/* Discount badge */}
            {!outOfStock && discount > 0 && (
                <div className="absolute top-3 right-3 z-10 bg-brand text-white font-black text-xs px-2 py-1 rounded-lg shadow-lg">
                    -{discount}%
                </div>
            )}

            {/* Out of stock badge */}
            {outOfStock && (
                <div className="absolute top-3 right-3 z-10 bg-zinc-900/90 text-zinc-400 font-semibold text-xs px-2 py-1 rounded-lg">
                    {t('stock.outOfStock')}
                </div>
            )}

            {/* Bottom content */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Genre tags — fade in on hover */}
                {game.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {game.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre}
                                className="text-[10px] bg-white/15 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2">
                    <Link
                        href={`/games/${game.id}`}
                        className="after:absolute after:inset-0 after:z-[1] focus-visible:outline-none"
                    >
                        {game.name}
                    </Link>
                </h3>

                {/* Price row */}
                {game.total != null && (
                    <div className="flex items-center gap-2 mb-3">
                        {discount > 0 && game.initialPrice != null && (
                            <span className="text-zinc-400 text-xs line-through">
                                {game.initialPrice.toFixed(2).replace('.', ',')}
                                €
                            </span>
                        )}
                        <span
                            className={`font-black text-base ${discount > 0 ? 'text-green-400' : 'text-white'}`}
                        >
                            {game.total.toFixed(2).replace('.', ',')}€
                        </span>
                    </div>
                )}

                {/* Cart button — slides in on hover */}
                <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!outOfStock) {
                                inCart ? removeItem(game.id) : addItem(game);
                            }
                        }}
                        disabled={outOfStock}
                        aria-label={
                            outOfStock
                                ? `${t('stock.outOfStock')} – ${game.name}`
                                : inCart
                                  ? `${t('actions.cart.remove')} – ${game.name}`
                                  : `${t('actions.cart.add')} – ${game.name}`
                        }
                        className={`relative z-20 w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                            outOfStock
                                ? 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed'
                                : inCart
                                  ? 'bg-zinc-700 hover:bg-zinc-600 cursor-pointer'
                                  : 'bg-brand hover:bg-brand-active shadow-lg shadow-orange-500/40 cursor-pointer'
                        }`}
                    >
                        <ShoppingCart
                            aria-hidden="true"
                            className="w-3.5 h-3.5"
                        />
                        {outOfStock
                            ? t('stock.outOfStock')
                            : inCart
                              ? t('actions.cart.remove')
                              : t('actions.cart.add')}
                    </button>
                </div>
            </div>
        </motion.article>
    );
};
