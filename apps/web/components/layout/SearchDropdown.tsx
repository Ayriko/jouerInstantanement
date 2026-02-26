'use client';

import { Game, Pagination } from '@repo/shared-types';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from '@/i18n/navigation';

interface SearchDropdownProps {
    inputClassName?: string;
    placeholder: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
    inputClassName = '',
    placeholder,
}) => {
    const t = useTranslations('header.search');
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchGames = useCallback(async (name: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `/api/games?name=${encodeURIComponent(name)}&take=6&page=1`,
            );
            if (!res.ok) throw new Error();
            const data: Pagination<Game> = await res.json();
            setResults(data.items);
            setIsOpen(true);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            void fetchGames(value.trim());
        }, 300);
    };

    const handleSelect = (game: Game) => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        router.push(`/games/${game.id}`);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <label htmlFor="search" className="sr-only">
                    {t('label')}
                </label>
                <input
                    id="search"
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleChange}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    autoComplete="off"
                    className={inputClassName}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    {isLoading ? (
                        <div className="px-4 py-3 text-sm text-zinc-400 text-center">
                            <span className="animate-pulse">...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-zinc-400 text-center">
                            {t('noResults')}
                        </div>
                    ) : (
                        <ul>
                            {results.map((game) => (
                                <li key={game.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(game)}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-700 transition-colors text-left"
                                    >
                                        <img
                                            src={game.backgroundImage}
                                            alt={game.name}
                                            className="w-12 h-8 object-cover rounded flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">
                                                {game.name}
                                            </p>
                                            {game.genres.length > 0 && (
                                                <p className="text-xs text-zinc-400 truncate">
                                                    {game.genres
                                                        .slice(0, 2)
                                                        .join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        {game.total != null && (
                                            <span className="text-sm font-bold text-white flex-shrink-0">
                                                {game.total
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                                €
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
