'use client';

import { Game } from '@repo/shared-types';
import {
    Heart,
    ShoppingCart,
    Download,
    Shield,
    Key,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

interface GameDetailProps {
    game: Game;
}

const GameDetail: React.FC<GameDetailProps> = ({ game }) => {
    const t = useTranslations('games.detail');
    const locale = useLocale();
    const router = useRouter();
    const { addItem, isInCart, removeItem } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const { data: session } = authClient.useSession();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
    }, []);
    const prevScreenshot = useCallback(() => {
        setLightboxIndex((i) =>
            i === null
                ? null
                : (i - 1 + game.screenshots.length) % game.screenshots.length,
        );
    }, [game.screenshots.length]);
    const nextScreenshot = useCallback(() => {
        setLightboxIndex((i) =>
            i === null ? null : (i + 1) % game.screenshots.length,
        );
    }, [game.screenshots.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevScreenshot();
            if (e.key === 'ArrowRight') nextScreenshot();
        };
        globalThis.addEventListener('keydown', handleKey);
        return () => {
            globalThis.removeEventListener('keydown', handleKey);
        };
    }, [lightboxIndex, closeLightbox, prevScreenshot, nextScreenshot]);

    const handleBackToList = () => {
        if (globalThis.history.length > 1) {
            router.back();
        } else {
            router.push('/games');
        }
    };
    const inCart = isInCart(game.id);

    const features = [
        { icon: Download, label: t('reassurance.instantDownload') },
        { icon: Shield, label: t('reassurance.securePayment') },
        { icon: Key, label: t('reassurance.officialKey') },
        { icon: BadgeCheck, label: t('reassurance.bestPrice') },
    ];

    const discount =
        game.initialPrice > game.total
            ? Math.round((1 - game.total / game.initialPrice) * 100)
            : 0;

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
                <button
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {t('backToList')}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Cover Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                            <img
                                src={game.coverImage}
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
                                        <span
                                            key={genre}
                                            className="text-zinc-500 text-sm"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-3xl md:text-4xl font-black text-white">
                                {game.name}
                            </h1>
                            {game.rating !== null && (
                                <div className="flex items-center gap-1 mt-2 text-yellow-400">
                                    <span className="text-lg">★</span>
                                    <span className="text-lg font-semibold">
                                        {game.rating.toFixed(1)}
                                    </span>
                                    <span className="text-zinc-500 text-sm ml-1">
                                        / 10
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Price Block */}
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                            <div className="flex items-center gap-4 mb-4">
                                {discount > 0 && (
                                    <>
                                        <span className="text-zinc-500 text-lg line-through">
                                            {game.initialPrice
                                                .toFixed(2)
                                                .replace('.', ',')}
                                            €
                                        </span>
                                        <span className="bg-brand text-white font-bold px-2 py-1 rounded text-sm">
                                            -{discount}%
                                        </span>
                                    </>
                                )}
                                <span className="text-white font-bold text-3xl">
                                    {game.total.toFixed(2).replace('.', ',')}€
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => {
                                        inCart
                                            ? removeItem(game.id)
                                            : addItem(game);
                                    }}
                                    className={`flex-1 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 ${
                                        inCart
                                            ? 'bg-zinc-700 hover:bg-zinc-600'
                                            : 'bg-brand hover:bg-brand-active shadow-lg shadow-orange-500/20'
                                    }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {inCart
                                        ? t('actions.cart.remove')
                                        : t('actions.cart.add')}
                                </button>
                                <button
                                    onClick={() => {
                                        if (!session?.user) {
                                            router.push('/sign-in');
                                            return;
                                        }
                                        void toggleWishlist(game.id);
                                    }}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                                        isWishlisted(game.id)
                                            ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
                                            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                                    }`}
                                >
                                    <Heart
                                        className={`w-5 h-5 ${isWishlisted(game.id) ? 'fill-red-400' : ''}`}
                                    />
                                    <span>
                                        {isWishlisted(game.id)
                                            ? t('actions.wishlist.remove')
                                            : t('actions.wishlist.add')}
                                    </span>
                                </button>
                            </div>
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

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-3">
                                {t('description')}
                            </h2>
                            <p className="text-zinc-400 leading-relaxed">
                                {game.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {game.tags.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-3">
                                    {t('tags')}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {game.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1 rounded-lg capitalize"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details Table */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-3">
                                {t('details.title')}
                            </h2>
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
                                <DetailRow
                                    label={t('details.developer')}
                                    value={game.developer}
                                />
                                <DetailRow
                                    label={t('details.publisher')}
                                    value={game.editor}
                                />
                                <DetailRow
                                    label={t('details.releaseDate')}
                                    value={new Date(
                                        game.releaseDate,
                                    ).toLocaleDateString(locale)}
                                />
                                {game.genres.length > 0 && (
                                    <DetailRow
                                        label={t('details.category')}
                                        value={game.genres.join(', ')}
                                    />
                                )}
                                {game.platforms.length > 0 && (
                                    <DetailRow
                                        label={t('details.platform')}
                                        value={game.platforms.join(', ')}
                                    />
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
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {t('screenshots')}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {game.screenshots.map((src, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setLightboxIndex(i);
                                    }}
                                    className="rounded-xl overflow-hidden aspect-video bg-zinc-800 cursor-pointer group relative"
                                    aria-label={`${game.name} screenshot ${i + 1}`}
                                >
                                    <img
                                        src={src}
                                        alt={`${game.name} screenshot ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </button>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                        onClick={closeLightbox}
                    >
                        {/* Close */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Counter */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-zinc-400 text-sm">
                            {lightboxIndex + 1} / {game.screenshots.length}
                        </div>

                        {/* Prev */}
                        {game.screenshots.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevScreenshot();
                                }}
                                className="absolute left-4 p-3 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Image */}
                        <motion.img
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            src={game.screenshots[lightboxIndex]}
                            alt={`${game.name} screenshot ${lightboxIndex + 1}`}
                            className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        />

                        {/* Next */}
                        {game.screenshots.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextScreenshot();
                                }}
                                className="absolute right-4 p-3 rounded-full bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}

                        {/* Thumbnails */}
                        {game.screenshots.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2 pb-1">
                                {game.screenshots.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLightboxIndex(i);
                                        }}
                                        className={`flex-shrink-0 w-16 h-10 rounded-md overflow-hidden border-2 transition-colors cursor-pointer ${
                                            i === lightboxIndex
                                                ? 'border-white'
                                                : 'border-transparent opacity-50 hover:opacity-80'
                                        }`}
                                        aria-label={`Go to screenshot ${i + 1}`}
                                    >
                                        <img
                                            src={src}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
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
