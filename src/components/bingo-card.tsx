'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

import { BingoCell, BingoCardProps } from '@/types/bingo';
import { COLUMN_COLORS, COLUMN_BG_COLORS } from '@/lib/constants';

export default function BingoCard({ initialCells }: BingoCardProps) {
  const [cells, setCells] = useState<BingoCell[][]>(initialCells || []);

  useEffect(() => {
    if (!initialCells) {
      generateBingoCard();
    }
  }, [initialCells]);

  const randomNumberBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateBingoCard = () => {
    const newCells: BingoCell[][] = [];
    const usedNumbers = new Set<number>();

    for (let i = 0; i < 5; i++) {
      const row: BingoCell[] = [];
      for (let j = 0; j < 5; j++) {
        if (i === 2 && j === 2) {
          row.push({ number: 0, checked: true }); // FREE space
        } else {
          let number: number;
          const minNumber = j * 15 + 1;
          const maxNumber = (j + 1) * 15;
          do {
            number = randomNumberBetween(minNumber, maxNumber);
          } while (usedNumbers.has(number));
          usedNumbers.add(number);
          row.push({ number, checked: false });
        }
      }
      newCells.push(row);
    }

    setCells(newCells);
  };

  const toggleCell = (rowIndex: number, colIndex: number) => {
    setCells((prevCells) => {
      const newCells = [...prevCells];
      newCells[rowIndex] = [...newCells[rowIndex]];
      newCells[rowIndex][colIndex] = {
        ...newCells[rowIndex][colIndex],
        checked: !newCells[rowIndex][colIndex].checked,
      };
      return newCells;
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Bingo Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl overflow-hidden">
          {/* Column Headers */}
          <div className="grid grid-cols-5 gap-px bg-white">
            {Object.entries(COLUMN_COLORS).map(([letter, colorClass]) => (
              <div
                key={letter}
                className={`${colorClass} text-center py-3 font-bold text-2xl ${COLUMN_BG_COLORS[letter]}`}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Bingo Grid */}
          <div className="grid grid-cols-5 gap-px bg-white">
            {cells.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const letter = Object.keys(COLUMN_COLORS)[colIndex];
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                    className={`
                      aspect-square flex items-center justify-center text-xl font-bold
                      transition-all duration-200
                      ${COLUMN_BG_COLORS[letter]}
                      ${cell.checked ? `${COLUMN_COLORS[letter]} scale-95` : 'hover:scale-95'}
                      ${cell.number === 0 ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    disabled={cell.number === 0}
                  >
                    {cell.number === 0 ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Star className="w-8 h-8 text-green-500" />
                      </div>
                    ) : (
                      cell.number
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
      {!initialCells && (
        <CardFooter>
          <Button
            onClick={generateBingoCard}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Generate New Card
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
