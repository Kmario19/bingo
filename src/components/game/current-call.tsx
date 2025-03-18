'use client';

import { useState } from 'react';
import { Game } from '@/types/game';
import { Pause, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrentCallProps {
  currentCall: { letter: string; number: number; full: string } | null;
  countdown: number;
  isPaused: boolean;
  winningCard: number | null;
  game: Game;
}

// Create an empty 5x5 pattern
const createEmptyPattern = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

export default function CurrentCall({
  currentCall,
  countdown,
  isPaused,
  winningCard,
  game,
}: CurrentCallProps) {
  const [winPattern, setWinPattern] = useState(
    game.winPattern || createEmptyPattern()
  );
  const [isDrawing, setIsDrawing] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const toggleCell = (rowIndex: number, colIndex: number) => {
    setWinPattern((prev) => {
      const newPattern = prev.map((row) => [...row]);
      newPattern[rowIndex][colIndex] = !newPattern[rowIndex][colIndex];
      return newPattern;
    });
  };

  const handlePatternCellMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDragging(true);
    // Set drawing mode based on target cell's current state
    setIsDrawing(!winPattern[rowIndex][colIndex]);
    toggleCell(rowIndex, colIndex);
  };

  const handlePatternCellMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isDragging || isDrawing === null) return;
    setWinPattern((prev) => {
      const newPattern = prev.map((row) => [...row]);
      newPattern[rowIndex][colIndex] = isDrawing;
      return newPattern;
    });
  };

  const handlePatternMouseUp = () => {
    setIsDragging(false);
    setIsDrawing(null);
  };

  const clearPattern = () => {
    setWinPattern(createEmptyPattern());
  };

  // Preset patterns
  const presetPatterns = {
    full: createEmptyPattern().map((row) => row.map(() => true)),
    line: createEmptyPattern().map((row, i) => row.map(() => i === 2)),
    column: createEmptyPattern().map((row) => row.map((_, j) => j === 2)),
    cross: createEmptyPattern().map((row, i) =>
      row.map((_, j) => i === j || i === 4 - j)
    ),
    corners: createEmptyPattern().map((row, i) =>
      row.map((_, j) => (i === 0 || i === 4) && (j === 0 || j === 4))
    ),
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl p-8 mb-8 text-center relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-medium">
        {isPaused ? (
          <span className="flex items-center gap-1">
            <Pause className="h-3 w-3" /> Game Paused
          </span>
        ) : winningCard !== null ? (
          <span className="flex items-center gap-1">
            <Trophy className="h-3 w-3" /> Game Over
          </span>
        ) : (
          `Next call in: ${countdown}s`
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Winning Pattern
          </h2>
          <div className="space-y-4">
            <div
              className="grid grid-cols-5 gap-1 max-w-[240px] mx-auto"
              onMouseLeave={handlePatternMouseUp}
              onMouseUp={handlePatternMouseUp}
            >
              {winPattern.map((row, rowIndex) =>
                row.map((isSelected, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                        aspect-square rounded-md cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary' : 'bg-card border border-border hover:bg-primary/20'}
                      `}
                    onMouseDown={() =>
                      handlePatternCellMouseDown(rowIndex, colIndex)
                    }
                    onMouseEnter={() =>
                      handlePatternCellMouseEnter(rowIndex, colIndex)
                    }
                  />
                ))
              )}
            </div>

            {/* Preset Patterns */}
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearPattern}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWinPattern(presetPatterns.full)}
              >
                Full
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWinPattern(presetPatterns.line)}
              >
                Line
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWinPattern(presetPatterns.column)}
              >
                Column
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWinPattern(presetPatterns.cross)}
              >
                Cross
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setWinPattern(presetPatterns.corners)}
              >
                Corners
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Current Call
          </h2>

          {currentCall ? (
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <div className="text-8xl font-bold text-primary mb-2 flex items-center">
                <span>{currentCall.letter}</span>
                <span>{currentCall.number}</span>
              </div>
              <p className="text-xl text-card-foreground/70">
                {currentCall.letter} - {currentCall.number}
              </p>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-xl text-card-foreground/70">
                Waiting for first call...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
