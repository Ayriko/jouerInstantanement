import { Game } from '@repo/shared-types';
import { getTranslations } from 'next-intl/server';

import GameCarousel from '@/components/home/GameCarousel';
import GameGrid from '@/components/home/GameGrid';
import { HeroBanner } from '@/components/home/HeroBanner';

async function fetchSuggestions(
    limit: number,
    genre?: string,
): Promise<Game[]> {
    const url = new URL(`${process.env.GATEWAY_URL}/api/games/suggestion`);
    url.searchParams.set('limit', String(limit));
    if (genre) url.searchParams.set('genres', genre);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json() as Promise<Game[]>;
}

export default async function Home() {
    const t = await getTranslations('home');

    const [allGames, actionGames, rpgGames, sportsGames, indieGames] =
        await Promise.all([
            fetchSuggestions(9),
            fetchSuggestions(10, 'Action'),
            fetchSuggestions(8, 'RPG'),
            fetchSuggestions(10, 'Sports'),
            fetchSuggestions(8, 'Indie'),
        ]);

    const featuredGame = allGames[0];
    const bestOffers = allGames
        .filter((g) => g.id !== featuredGame?.id)
        .slice(0, 8);

    return (
        <>
            {featuredGame && <HeroBanner featuredGame={featuredGame} />}

            {/* Meilleures offres — grille 4 colonnes */}
            <GameGrid
                title={t('bestOffers.title')}
                games={bestOffers}
                seeAllHref="/games"
                seeAllLabel={t('seeAll')}
            />

            {/* Action & Aventure — carousel horizontal */}
            {actionGames.length > 0 && (
                <div className="bg-zinc-900/50">
                    <GameCarousel
                        title={t('sections.action.title')}
                        games={actionGames}
                        seeAllHref="/games?genres=Action"
                        seeAllLabel={t('seeAll')}
                    />
                </div>
            )}

            {/* Jeux de Rôle (RPG) — grille 4 colonnes */}
            {rpgGames.length > 0 && (
                <GameGrid
                    title={t('sections.rpg.title')}
                    games={rpgGames}
                    seeAllHref="/games?genres=RPG"
                    seeAllLabel={t('seeAll')}
                />
            )}

            {/* Sports & Course — carousel horizontal */}
            {sportsGames.length > 0 && (
                <div className="bg-zinc-900/50">
                    <GameCarousel
                        title={t('sections.sports.title')}
                        games={sportsGames}
                        seeAllHref="/games?genres=Sports"
                        seeAllLabel={t('seeAll')}
                    />
                </div>
            )}

            {/* Jeux Indépendants — grille 4 colonnes */}
            {indieGames.length > 0 && (
                <GameGrid
                    title={t('sections.indie.title')}
                    games={indieGames}
                    seeAllHref="/games?genres=Indie"
                    seeAllLabel={t('seeAll')}
                />
            )}
        </>
    );
}
