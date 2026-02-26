'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Link } from '@/i18n/navigation';
import { Game } from '@repo/shared-types';

interface HeroBannerProps {
    featuredGame: Game;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredGame }) => {
    const t = useTranslations('home.hero');

    return (
        <div className="relative h-[500px] w-full overflow-hidden mb-12">
            <div className="absolute inset-0">
                <img
                    src={featuredGame.backgroundImage}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block uppercase">
                        {t('highlightedGame.tag.trending')}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                        {featuredGame.name.slice(0, 30)}{' '}
                        {featuredGame.name.length > 30 && '...'}
                    </h2>
                    {featuredGame.genres.length > 0 && (
                        <p className="text-zinc-300 text-lg mb-6 line-clamp-2">
                            {featuredGame.genres.join(' · ')}
                        </p>
                    )}
                    {/* Prix */}
                    <div className="flex items-center gap-3 mb-5">
                        {featuredGame.initialPrice > featuredGame.total && (
                            <>
                                <span className="text-zinc-400 text-lg line-through">
                                    {featuredGame.initialPrice
                                        .toFixed(2)
                                        .replace('.', ',')}
                                    €
                                </span>
                                <span className="bg-brand text-white text-sm font-black px-2.5 py-1 rounded-lg">
                                    -
                                    {Math.round(
                                        (1 -
                                            featuredGame.total /
                                                featuredGame.initialPrice) *
                                            100,
                                    )}
                                    %
                                </span>
                            </>
                        )}
                        <span className="text-white text-3xl font-black">
                            {featuredGame.total.toFixed(2).replace('.', ',')}€
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/games/${featuredGame.id}`}
                            className="bg-brand hover:bg-brand-active text-white px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-orange-500/20 cursor-pointer"
                        >
                            {t('highlightedGame.buyButton', {
                                price: featuredGame.total
                                    .toFixed(2)
                                    .replace('.', ','),
                            })}
                        </Link>
                        <Link
                            href="/games"
                            className="bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold text-lg border border-zinc-700 transition-transform hover:scale-105 cursor-pointer"
                        >
                            {t('highlightedGame.discoverButton')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
