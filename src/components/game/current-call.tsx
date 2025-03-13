'use client';

import { Pause, Trophy } from 'lucide-react';

interface CurrentCallProps {
  currentCall: { letter: string; number: number; full: string } | null;
  countdown: number;
  isPaused: boolean;
  winningCard: number | null;
}

export default function CurrentCall({
  currentCall,
  countdown,
  isPaused,
  winningCard,
}: CurrentCallProps) {
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
  );
}
