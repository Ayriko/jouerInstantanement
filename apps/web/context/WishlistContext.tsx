'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { authClient } from '@/lib/auth-client';
import { Game } from '@repo/shared-types';

interface WishlistContextValue {
    games: Game[];
    isLoading: boolean;
    isWishlisted: (gameId: string) => boolean;
    toggleWishlist: (gameId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    const { data: session } = authClient.useSession();
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const token = session?.session?.token;

    const fetchWishlist = useCallback(async (t: string) => {
        const data = (await fetch('/api/wishlists', {
            headers: { Authorization: `Bearer ${t}` },
        }).then((r) => r.json())) as { games: Game[] };
        setGames(data.games ?? []);
    }, []);

    useEffect(() => {
        if (!token) {
            setGames([]);
            return;
        }

        setIsLoading(true);
        fetchWishlist(token).finally(() => setIsLoading(false));
    }, [token, fetchWishlist]);

    const isWishlisted = useCallback(
        (gameId: string) => games.some((g) => g.id === gameId),
        [games],
    );

    const toggleWishlist = useCallback(
        async (gameId: string) => {
            if (!token) return;

            const wishlisted = games.some((g) => g.id === gameId);

            if (wishlisted) {
                // Optimistic remove
                setGames((prev) => prev.filter((g) => g.id !== gameId));

                const res = await fetch('/api/wishlists/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ gameId }),
                });

                if (!res.ok) {
                    await fetchWishlist(token);
                }
            } else {
                const res = await fetch('/api/wishlists/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ gameId }),
                });

                if (res.ok) {
                    await fetchWishlist(token);
                }
            }
        },
        [games, token, fetchWishlist],
    );

    return (
        <WishlistContext.Provider
            value={{ games, isLoading, isWishlisted, toggleWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist(): WishlistContextValue {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
