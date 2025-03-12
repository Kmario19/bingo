'use client';

import { BingoColumn, Card, CardColumn } from '@/types/game';

import { CheckCircle, Trophy } from 'lucide-react';

interface BingoCardProps {
  card: Card;
  cardKey: number;
  bingoColumns: BingoColumn[];
  previousCalls: string[];
  winningCard: number | null;
}

export default function BingoCard({
  card,
  cardKey,
  bingoColumns,
  previousCalls,
  winningCard,
}: BingoCardProps) {
  return (
    <div
      className={`bg-card rounded-xl shadow-lg p-4 relative ${winningCard === cardKey ? 'ring-4 ring-yellow-500' : ''}`}
    >
      {winningCard === cardKey && (
        <div className="absolute -top-4 -right-4 bg-yellow-500 text-white rounded-full p-2">
          <Trophy className="w-6 h-6" />
        </div>
      )}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {bingoColumns.map((column) => (
          <div
            key={column.letter}
            className="bg-primary text-primary-foreground font-bold text-center py-2 rounded-md"
          >
            {column.letter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1">
        {card.map((column: CardColumn, colIndex: number) =>
          column.numbers.map((number: number, numIndex: number) => {
            const isMarked = previousCalls.includes(
              `${column.letter}${number}`
            );
            const isFreeSpace =
              number === 0 && colIndex === 2 && numIndex === 2;

            return (
              <div
                key={`${colIndex}-${numIndex}`}
                className={`aspect-square flex items-center justify-center rounded-md text-lg font-medium
                          ${isFreeSpace ? 'bg-primary/20' : 'bg-card'}
                          ${isMarked ? 'bg-primary/30 text-primary-foreground relative' : 'border border-border'}
                        `}
              >
                {isFreeSpace ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <>
                    {number}
                    {isMarked && (
                      <div className="absolute w-full h-0.5 bg-primary-foreground rotate-45"></div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
