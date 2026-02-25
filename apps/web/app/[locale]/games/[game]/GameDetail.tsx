'use client';

import { Heart, /*ShoppingCart,*/ Download, Shield, Key, BadgeCheck, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { Link } from '@/i18n/navigation';

// TODO: uncomment when cart supports ApiGame (needs price, originalPrice, discount fields)
// import { useCart } from '@/context/CartContext';
import { ApiGame } from './page';

interface GameDetailProps {
  game: ApiGame;
}

const GameDetail: React.FC<GameDetailProps> = ({ game }) => {
  const t = useTranslations("games.detail");
  // const { addItem, removeItem, isInCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  // const inCart = isInCart(game.id);

    const features = [
        { icon: Download, label: t('reassurance.instantDownload') },
        { icon: Shield, label: t('reassurance.securePayment') },
        { icon: Key, label: t('reassurance.officialKey') },
        { icon: BadgeCheck, label: t('reassurance.bestPrice') },
    ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <img
          src={game.backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <Link
          href="/games"
          className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("backToList")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50">
              {/* TODO: use a dedicated portrait coverImage field (e.g. coverImage: string) instead of backgroundImage */}
              <img
                src={game.backgroundImage}
                alt={game.name}
                className="w-full aspect-video object-cover"
              />
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Title, Platforms & Genres */}
            <div>
              {game.platforms.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {game.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-0.5 rounded border border-zinc-700 text-zinc-400 text-sm"
                    >
                      {platform}
                    </span>
                  ))}
                  {game.genres.slice(0, 2).map((genre) => (
                    <span key={genre} className="text-zinc-500 text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-white">{game.name}</h1>
              <div className="flex items-center gap-1 mt-2 text-yellow-400">
                <span className="text-lg">★</span>
                <span className="text-lg font-semibold">{game.rating.toFixed(1)}</span>
                <span className="text-zinc-500 text-sm ml-1">/ 5</span>
              </div>
            </div>

            {/* Price Block — TODO: add price, originalPrice, discount fields to the games DB table */}
            {/*
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-zinc-500 text-lg line-through">{game.originalPrice.toFixed(2)}€</span>
                <span className="bg-brand text-white font-bold px-2 py-1 rounded text-sm">-{game.discount}%</span>
                <span className="text-white font-bold text-3xl">{game.price.toFixed(2)}€</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { inCart ? removeItem(game.id) : addItem(game); }}
                  className={`flex-1 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 ${
                    inCart
                      ? 'bg-zinc-700 hover:bg-zinc-600'
                      : 'bg-brand hover:bg-brand-active shadow-lg shadow-orange-500/20'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inCart ? t("actions.cart.remove") : t("actions.cart.add")}
                </button>
                <button
                  onClick={() => { setIsWishlisted(!isWishlisted); }}
                  className={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    isWishlisted
                      ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-400' : ''}`} />
                  <span className="sm:inline hidden">
                    {isWishlisted ? t("actions.wishlist.remove") : t("actions.wishlist.add")}
                  </span>
                </button>
              </div>
            </div>
            */}

            {/* Wishlist button (standalone until price is available) */}
            <div className="flex gap-3">
              <button
                onClick={() => { setIsWishlisted(!isWishlisted); }}
                className={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  isWishlisted
                    ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-400' : ''}`} />
                <span>{isWishlisted ? t("actions.wishlist.remove") : t("actions.wishlist.add")}</span>
              </button>
            </div>

                        {/* Réassurance */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-2"
                                >
                                    <feature.icon className="w-4 h-4 text-brand flex-shrink-0" />
                                    <span className="text-zinc-300 text-xs">
                                        {feature.label}
                                    </span>
                                </div>
                            ))}
                        </div>

            {/* Description — TODO: add description field to the games DB table */}
            {/*
            <div>
              <h2 className="text-xl font-bold text-white mb-3">{t("description")}</h2>
              <p className="text-zinc-400 leading-relaxed">{game.description}</p>
            </div>
            */}

            {/* Tags */}
            {game.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-3">{t("tags")}</h2>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details Table */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">{t("details.title")}</h2>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
                {/* TODO: add developer, publisher, releaseDate fields to the games DB table */}
                {/* <DetailRow label={t("details.developer")} value={game.developer} /> */}
                {/* <DetailRow label={t("details.publisher")} value={game.publisher} /> */}
                {/* <DetailRow label={t("details.releaseDate")} value={new Date(game.releaseDate).toLocaleDateString()} /> */}
                {game.genres.length > 0 && (
                  <DetailRow label={t("details.category")} value={game.genres.join(', ')} />
                )}
                {game.platforms.length > 0 && (
                  <DetailRow label={t("details.platform")} value={game.platforms.join(', ')} />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Screenshots */}
        {game.screenshots.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{t("screenshots")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {game.screenshots.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video bg-zinc-800">
                  <img src={src} alt={`${game.name} screenshot ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

function DetailRow({
    label,
    value,
}: Readonly<{ label: string; value: string }>) {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            <span className="text-zinc-500 text-sm">{label}</span>
            <span className="text-zinc-200 text-sm font-medium">{value}</span>
        </div>
    );
}

export default GameDetail;
