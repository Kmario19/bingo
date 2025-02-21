'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import BingoCard from '@/components/bingo-card';

import type { BingoCell } from '@/types/bingo';
import Header from '@/components/header';

export default function AdminPage() {
  const [gameTitle, setGameTitle] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [numCards, setNumCards] = useState(45);
  const [generatedCards, setGeneratedCards] = useState<BingoCell[][][]>([]);

  const generateUniqueCards = (count: number) => {
    const cards: BingoCell[][][] = [];
    const usedNumbers = new Set<string>();

    for (let cardIndex = 0; cardIndex < count; cardIndex++) {
      const card: BingoCell[][] = [];
      const cardNumbers = new Set<number>();

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
              number =
                Math.floor(Math.random() * (maxNumber - minNumber + 1)) +
                minNumber;
            } while (
              cardNumbers.has(number) ||
              usedNumbers.has(`${cardIndex}-${number}`)
            );
            cardNumbers.add(number);
            usedNumbers.add(`${cardIndex}-${number}`);
            row.push({ number, checked: false });
          }
        }
        card.push(row);
      }
      cards.push(card);
    }

    return cards;
  };

  const createGame = async () => {
    const response = await fetch('/api/juego', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: gameTitle,
        dateStart,
        dateEnd,
        numberOfCards: numCards,
      }),
    });

    if (response.ok) {
      const newGame = await response.json();
      console.log('New game created:', newGame);
    } else {
      console.error('Failed to create new game:', response.statusText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cards = generateUniqueCards(numCards);
    setGeneratedCards(cards);
    createGame();
  };

  return (
    <div>
      <Header />
      <Card className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-center">Generate Bingo Cards</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameTitle">Game Title</Label>
              <Input
                id="gameTitle"
                type="text"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="Enter game title"
                required
                className="rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numCards">Number of Cards</Label>
              <Input
                id="numCards"
                type="number"
                min="1"
                max="100"
                value={numCards}
                onChange={(e) => setNumCards(Number.parseInt(e.target.value))}
                required
                className="rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateStart">Date Start</Label>
              <Input
                id="dateStart"
                type="datetime-local"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                placeholder="Enter date start"
                required
                className="rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateEnd">Date End</Label>
              <Input
                id="dateEnd"
                type="datetime-local"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                placeholder="Enter date end"
                required
                className="rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl h-12 text-lg font-semibold"
            >
              Generate Cards
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generatedCards.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            {gameTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-2">Card {index + 1}</h3>
                <BingoCard initialCells={card} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
