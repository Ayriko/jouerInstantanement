import { GameCard } from './GameCard';

import type { Game } from "../../types/game";

export default function GameGrid({
  games,
  title,
}: {
  games: Game[];
  title: string;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
