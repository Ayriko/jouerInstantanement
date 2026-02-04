import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import GameDetail from './GameDetail';

import { games } from '@/data/games';


interface GameDetailsProps {
    game: string;
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<GameDetailsProps> }>): Promise<Metadata> {
    const t = await getTranslations();
    const { game } = await params;

    const gameDetails = findGameById(game);
    if (!gameDetails) return notFound();

    return {
        title: t("games.detail.meta.title", {gameTitle: gameDetails.title}),
        description: t("games.detail.meta.description", {gameTitle: gameDetails.title})
    };
}

export default async function Page({ params }: Readonly<{ params: Promise<GameDetailsProps> }>): Promise<React.JSX.Element> {
    const { game } = await params;

    const gameDetails = findGameById(game);
    if (!gameDetails) return notFound();

    return <GameDetail game={gameDetails} />
}

const findGameById = (id: string) => {
    return games.find(g => g.id === id) ?? null;
}
