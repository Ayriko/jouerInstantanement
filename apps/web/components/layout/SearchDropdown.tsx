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

const LISTBOX_ID = 'search-listbox';

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
    const [focusedIndex, setFocusedIndex] = useState(-1);
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
            setFocusedIndex(-1);
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
        setFocusedIndex(-1);

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
        setFocusedIndex(-1);
        router.push(`/games/${game.id}`);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        setFocusedIndex(-1);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setFocusedIndex(-1);
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            e.preventDefault();
            handleSelect(results[focusedIndex]);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setFocusedIndex(-1);
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

    const activeDescendant =
        focusedIndex >= 0 && results[focusedIndex]
            ? `search-option-${results[focusedIndex].id}`
            : undefined;

    const hasResults = isOpen && results.length > 0;

    // Live region announcement
    let liveAnnouncement = '';
    if (isLoading) {
        liveAnnouncement = t('loading');
    } else if (isOpen && results.length === 0) {
        liveAnnouncement = t('noResults');
    } else if (hasResults) {
        liveAnnouncement = t('resultsCount', { count: results.length });
    }

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Live region for status announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {liveAnnouncement}
            </div>

            <div className="relative">
                <label htmlFor="search" className="sr-only">
                    {t('label')}
                </label>
                <input
                    id="search"
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={hasResults ? LISTBOX_ID : undefined}
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-activedescendant={activeDescendant}
                    placeholder={placeholder}
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    autoComplete="off"
                    className={inputClassName}
                />
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none"
                    aria-hidden="true"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                        aria-label={t('clear')}
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    {isLoading ? (
                        <div
                            className="px-4 py-3 text-sm text-zinc-400 text-center"
                            aria-hidden="true"
                        >
                            <span className="animate-pulse">...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div
                            className="px-4 py-3 text-sm text-zinc-400 text-center"
                            aria-hidden="true"
                        >
                            {t('noResults')}
                        </div>
                    ) : (
                        <ul
                            id={LISTBOX_ID}
                            role="listbox"
                            aria-label={t('label')}
                        >
                            {results.map((game, index) => (
                                <li
                                    key={game.id}
                                    id={`search-option-${game.id}`}
                                    role="option"
                                    aria-selected={focusedIndex === index}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(game)}
                                        tabIndex={-1}
                                        className={`w-full flex items-center gap-3 px-3 py-2 transition-colors text-left ${
                                            focusedIndex === index
                                                ? 'bg-zinc-600'
                                                : 'hover:bg-zinc-700'
                                        }`}
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
