'use client';

import { ArrowLeft, Play, Pause, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Game } from '@/types/game';
import Link from 'next/link';

interface GameHeaderProps {
  game: Game;
  isPaused: boolean;
  togglePause: () => void;
  toggleMute: () => void;
  muted: boolean;
  winningCard: number | null;
}

export default function GameHeader({
  game,
  isPaused,
  togglePause,
  toggleMute,
  muted,
  winningCard,
}: GameHeaderProps) {
  return (
    <div className="w-full max-w-7xl flex justify-between items-center mb-8">
      <Link href="/">
        <Button variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lobby
        </Button>
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">{game.title}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={togglePause}
          className="text-white hover:bg-white/20"
          disabled={winningCard !== null}
        >
          {isPaused ? (
            <Play className="h-5 w-5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={toggleMute}
          className="text-white hover:bg-white/20"
        >
          {muted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
