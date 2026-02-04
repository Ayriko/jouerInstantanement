"use client";

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Game } from '../../types/game';

interface HeroBannerProps {
  featuredGame: Game;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredGame }) => {
  const t = useTranslations("home.hero");
  const router = useRouter();

  return (
    <div className="relative h-[500px] w-full overflow-hidden mb-12">
      <div className="absolute inset-0">
        <img src={featuredGame.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block uppercase">{t("highlightedGame.tag.trending")}</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{featuredGame.title}</h2>
          <p className="text-zinc-300 text-lg mb-6 line-clamp-2">{featuredGame.description}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { router.push(`/games/${featuredGame.id}`); }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              {t("highlightedGame.buyButton", { price: featuredGame.price })}
            </button>
            <div className="bg-zinc-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-700">
              <span className="text-zinc-400 text-sm line-through mr-2">{featuredGame.originalPrice}€</span>
              <span className="text-orange-500 font-bold">-{featuredGame.discount}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
