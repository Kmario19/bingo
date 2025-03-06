'use client';

import { BingoColumn, Card, CardColumn } from '@/types/game';

import { CheckCircle } from 'lucide-react';

const BINGO_COLUMNS: BingoColumn[] = [
  { letter: 'B', range: [1, 15] },
  { letter: 'I', range: [16, 30] },
  { letter: 'N', range: [31, 45] },
  { letter: 'G', range: [46, 60] },
  { letter: 'O', range: [61, 75] },
];

interface BingoCardProps {
  card: Card;
  previousCalls: string[];
}

export default function BingoCard({ card, previousCalls }: BingoCardProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg p-4">
      <div className="grid grid-cols-5 gap-1 mb-2">
        {BINGO_COLUMNS.map((column) => (
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
