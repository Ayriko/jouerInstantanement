import { getTranslations } from 'next-intl/server';

import { Game, Pagination } from '@repo/shared-types';

import GameGrid from '@/components/home/GameGrid';
import { HeroBanner } from '@/components/home/HeroBanner';

async function fetchGames(): Promise<Game[]> {
    const res = await fetch(
        `${process.env.GATEWAY_URL}/api/games?page=1&take=9`,
        { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Pagination<Game>;
    return data.items;
}

export default async function Home() {
    const t = await getTranslations('home');
    const games = await fetchGames();
    const featuredGame = games[0];
    const gridGames = games.slice(1, 9);

    return (
        <>
            {featuredGame && <HeroBanner featuredGame={featuredGame} />}
            {/*<CategoryBar />*/}
            <GameGrid title={t('bestOffers.title')} games={gridGames} />
            {/*<GameGrid title="Nouveautes" games={newReleases} />*/}
        </>
    );
}
