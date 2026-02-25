import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import GameDetail from './GameDetail';

export interface ApiGame {
    id: string;
    name: string;
    backgroundImage: string;
    rating: number;
    platforms: string[];
    genres: string[];
    tags: string[];
    screenshots: string[];
}

async function fetchGame(id: string): Promise<ApiGame | null> {
    try {
        const res = await fetch(`${process.env.GATEWAY_URL}/api/games/${id}`, {
            next: { revalidate: 60 },
        });
        if (res.status === 404) return null;
        if (!res.ok) return null;
        return res.json() as Promise<ApiGame>;
    } catch {
        return null;
    }
}

interface PageProps {
    params: Promise<{ game: string }>;
}

export async function generateMetadata({
    params,
}: Readonly<PageProps>): Promise<Metadata> {
    const t = await getTranslations();
    const { game: id } = await params;

    const game = await fetchGame(id);
    if (!game) return notFound();

    return {
        title: t('games.detail.meta.title', { gameTitle: game.name }),
        description: t('games.detail.meta.description', {
            gameTitle: game.name,
        }),
    };
}

export default async function Page({
    params,
}: Readonly<PageProps>): Promise<React.JSX.Element> {
    const { game: id } = await params;

    const game = await fetchGame(id);
    if (!game) return notFound();

    return <GameDetail game={game} />;
}
