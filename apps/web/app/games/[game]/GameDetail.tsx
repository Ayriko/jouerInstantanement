import { useTranslations } from 'next-intl';
import React from 'react';

import { Game } from '../../../types/game';

interface GameDetailProps {
  game: Game;
}

const GameDetail: React.FC<GameDetailProps> = ({ game }: GameDetailProps) => {
  const t = useTranslations("home");

  return (
    <h1>{game.title}</h1>
  );
}

export default GameDetail;