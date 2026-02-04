import React from 'react';

import { Game } from '@/types/game';

interface GameDetailProps {
  game: Game;
}

const GameDetail: React.FC<GameDetailProps> = ({ game }: GameDetailProps) => {
  return (
    <h1>{game.title}</h1>
  );
}

export default GameDetail;