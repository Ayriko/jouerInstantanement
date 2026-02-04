import { useTranslations } from 'next-intl';

import GameGrid from '@/components/home/GameGrid';
import { HeroBanner } from '@/components/home/HeroBanner';
import { games } from '@/data/games';

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      {games.length > 0 && games[0] && (
        <HeroBanner featuredGame={games[0]} />
      )}
      {/*<CategoryBar />*/}
      <GameGrid title={t("bestOffers.title")} games={games} />
      {/*<GameGrid title="Nouveautes" games={newReleases} />*/}
    </>
  );
}
