'use client';

import { Card } from '@/types/game';
import BingoCard from './bingo-card';

interface BingoCardsProps {
  cards: Card[];
  previousCalls: string[];
}

export default function BingoCards({ cards, previousCalls }: BingoCardsProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Your Bingo Cards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, cardIndex) => (
          <BingoCard
            card={card}
            key={cardIndex}
            previousCalls={previousCalls}
          />
        ))}
      </div>
    </div>
  );
}
