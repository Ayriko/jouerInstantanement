'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

import type { Game } from '@repo/shared-types';

import { CarouselGameCard } from './CarouselGameCard';
import { Link } from '@/i18n/navigation';

interface GameCarouselProps {
    games: Game[];
    title?: string;
    seeAllHref?: string;
    seeAllLabel?: string;
}

export default function GameCarousel({
    games,
    title,
    seeAllHref,
    seeAllLabel,
}: Readonly<GameCarouselProps>) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = scrollRef.current.clientWidth * 0.75;
        scrollRef.current.scrollBy({
            left: direction === 'right' ? amount : -amount,
            behavior: 'smooth',
        });
    };

    if (games.length === 0) return null;

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    {title && (
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full bg-brand" />
                            <h2 className="text-2xl font-bold text-white">
                                {title}
                            </h2>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        {seeAllHref && seeAllLabel && (
                            <Link
                                href={seeAllHref}
                                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                {seeAllLabel}
                            </Link>
                        )}
                        <div className="flex gap-1">
                            <button
                                onClick={() => scroll('left')}
                                aria-label="Précédent"
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                aria-label="Suivant"
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {games.map((game) => (
                        <div key={game.id} className="flex-none w-64">
                            <CarouselGameCard game={game} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
