'use client';

import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { GameFiltersValue } from '@repo/shared-types';

function FilterSection({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-zinc-800 py-4">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between text-sm font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && <div className="mt-3">{children}</div>}
        </div>
    );
}

interface GamesFiltersProps {
    filtersValue: GameFiltersValue;
}

export function GamesFilters({ filtersValue }: GamesFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchParamsRef = useRef(searchParams);
    searchParamsRef.current = searchParams;

    const activeGenres = searchParams.getAll('genres');
    const activePlatforms = searchParams.getAll('platforms');
    const activeRating = searchParams.get('rating') ?? '';
    const activePrice = searchParams.get('price') ?? '';
    const activeInStock = searchParams.get('inStock') === 'true';

    const [nameInput, setNameInput] = useState(searchParams.get('name') ?? '');

    const activeFilterCount =
        activeGenres.length +
        activePlatforms.length +
        (activeRating ? 1 : 0) +
        (activePrice ? 1 : 0) +
        (searchParams.get('name') ? 1 : 0) +
        (activeInStock ? 1 : 0);

    const updateParam = (key: string, value: string | string[] | null) => {
        const params = new URLSearchParams(searchParamsRef.current.toString());
        params.delete('page');
        params.delete(key);
        if (value !== null) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
            } else {
                params.set(key, value);
            }
        }
        router.push(`/games?${params.toString()}`);
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            const current = searchParamsRef.current.get('name') ?? '';
            if (nameInput !== current) {
                const params = new URLSearchParams(
                    searchParamsRef.current.toString(),
                );
                params.delete('page');
                params.delete('name');
                if (nameInput) params.set('name', nameInput);
                router.push(`/games?${params.toString()}`);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [nameInput, router]);

    const toggleMulti = (key: string, value: string, active: string[]) => {
        const next = active.includes(value)
            ? active.filter((v) => v !== value)
            : [...active, value];
        updateParam(key, next.length ? next : null);
    };

    const clearAll = () => {
        setNameInput('');
        router.push('/games');
    };

    return (
        <div className="bg-zinc-900 rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                    <span className="font-semibold text-white text-sm">
                        Filtres
                    </span>
                    {activeFilterCount > 0 && (
                        <span className="bg-brand text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-3 h-3" />
                        Effacer
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Rechercher un jeu..."
                    className="w-full bg-zinc-800 text-white text-sm rounded-lg pl-9 pr-8 py-2 placeholder:text-zinc-500 border border-zinc-700 focus:border-brand focus:outline-none transition-colors"
                />
                {nameInput && (
                    <button
                        onClick={() => setNameInput('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* En stock */}
            <div className="border-b border-zinc-800 py-4">
                <button
                    onClick={() =>
                        updateParam('inStock', activeInStock ? null : 'true')
                    }
                    className="flex w-full items-center justify-between cursor-pointer group"
                >
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        En stock uniquement
                    </span>
                    <span
                        className={`relative inline-flex h-5 w-9 flex-none rounded-full transition-colors duration-200 ${
                            activeInStock ? 'bg-brand' : 'bg-zinc-700'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
                                activeInStock
                                    ? 'translate-x-4'
                                    : 'translate-x-0.5'
                            }`}
                        />
                    </span>
                </button>
            </div>

            {/* Genres */}
            {filtersValue.genres.length > 0 && (
                <FilterSection title="Genres">
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1 [scrollbar-width:thin]">
                        {filtersValue.genres.map((genre) => {
                            const checked = activeGenres.includes(genre);
                            return (
                                <label
                                    key={genre}
                                    className="flex items-center gap-2.5 cursor-pointer group"
                                >
                                    <span
                                        className={`w-4 h-4 flex-none rounded border-2 flex items-center justify-center transition-colors ${
                                            checked
                                                ? 'bg-brand border-brand'
                                                : 'border-zinc-600 group-hover:border-zinc-400'
                                        }`}
                                        onClick={() =>
                                            toggleMulti(
                                                'genres',
                                                genre,
                                                activeGenres,
                                            )
                                        }
                                    >
                                        {checked && (
                                            <svg
                                                viewBox="0 0 10 8"
                                                className="w-2.5 h-2.5 fill-white"
                                            >
                                                <path
                                                    d="M1 4l2.5 2.5L9 1"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    <span
                                        className={`text-sm transition-colors ${checked ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'}`}
                                        onClick={() =>
                                            toggleMulti(
                                                'genres',
                                                genre,
                                                activeGenres,
                                            )
                                        }
                                    >
                                        {genre}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </FilterSection>
            )}

            {/* Platforms */}
            {filtersValue.platforms.length > 0 && (
                <FilterSection title="Plateformes">
                    <div className="space-y-2">
                        {filtersValue.platforms.map((platform) => {
                            const checked = activePlatforms.includes(platform);
                            return (
                                <label
                                    key={platform}
                                    className="flex items-center gap-2.5 cursor-pointer group"
                                >
                                    <span
                                        className={`w-4 h-4 flex-none rounded border-2 flex items-center justify-center transition-colors ${
                                            checked
                                                ? 'bg-brand border-brand'
                                                : 'border-zinc-600 group-hover:border-zinc-400'
                                        }`}
                                        onClick={() =>
                                            toggleMulti(
                                                'platforms',
                                                platform,
                                                activePlatforms,
                                            )
                                        }
                                    >
                                        {checked && (
                                            <svg
                                                viewBox="0 0 10 8"
                                                className="w-2.5 h-2.5 fill-white"
                                            >
                                                <path
                                                    d="M1 4l2.5 2.5L9 1"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    <span
                                        className={`text-sm transition-colors ${checked ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'}`}
                                        onClick={() =>
                                            toggleMulti(
                                                'platforms',
                                                platform,
                                                activePlatforms,
                                            )
                                        }
                                    >
                                        {platform}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </FilterSection>
            )}

            {/* Min rating */}
            <FilterSection title="Note minimale" defaultOpen={false}>
                <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => {
                        const active = activeRating === String(r);
                        return (
                            <button
                                key={r}
                                onClick={() =>
                                    updateParam(
                                        'rating',
                                        active ? null : String(r),
                                    )
                                }
                                className={`w-9 h-9 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                    active
                                        ? 'bg-brand text-white shadow-lg shadow-brand/30'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                }`}
                            >
                                {r}+
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            {/* Max price */}
            <FilterSection title="Prix maximum" defaultOpen={false}>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">0 €</span>
                        <span
                            className={`text-sm font-semibold ${activePrice ? 'text-brand' : 'text-zinc-400'}`}
                        >
                            {activePrice ? `${activePrice} €` : '100 €'}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={activePrice || 100}
                        onChange={(e) =>
                            updateParam(
                                'price',
                                e.target.value === '100'
                                    ? null
                                    : e.target.value,
                            )
                        }
                        className="w-full h-1.5 rounded-full appearance-none bg-zinc-700 cursor-pointer accent-brand [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
                    />
                </div>
            </FilterSection>
        </div>
    );
}
