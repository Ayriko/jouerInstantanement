import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { games } from '../../../data/games';

import GameDetail from './GameDetail';

interface GameDetailsProps {
    game: string;
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("home");

    return {
        title: t("meta.title"),
        description: t("meta.description")
    };
}

export default async function Page({ params }: Readonly<{ params: Promise<GameDetailsProps> }>): Promise<React.JSX.Element> {
    const { game } = await params;

    const gameDetails = games.find(g => g.id === game) ?? null;
    if (!gameDetails) return notFound();

    return <GameDetail game={gameDetails} />
}
