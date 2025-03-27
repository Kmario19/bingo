'use client';

import { useState } from 'react';
import { PlusCircle, Users, Trophy, ArrowRight, Grid2x2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useIndexDB from '@/hooks/useIndexDB';
import { GameStatus, type NewGame } from '@/types/game';
import random from '@/lib/random';
import { redirect } from 'next/navigation';

const createEmptyPattern = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

export default function Home() {
  const [gameName, setGameName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [gameCode, setGameCode] = useState('');
  const [, setGame] = useIndexDB<NewGame | null>('game', null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const game = {
      id: random.generateUniqueCode(),
      title: gameName,
      maxPlayers,
      winPattern: createEmptyPattern(),
      status: GameStatus.Open,
    };

    setGame(game);

    redirect(`/game/${game.id}`);
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement game joining logic
    console.log('Joining game with code:', gameCode);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-4">
      {/* Animated Logo */}
      <div className="mb-12 mt-8 text-center animate-fade-in">
        <div className="relative inline-flex items-center justify-center">
          <Grid2x2 className="w-24 h-24 text-white animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white tracking-wider animate-bounce">
              B
            </span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mt-4 tracking-wide animate-fade-in-up">
          BINGO
        </h1>
        <p className="text-white/80 mt-2 animate-fade-in-up delay-200">
          Create or join a game to start playing!
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-8">
        {/* Left side - Join Game */}
        <div className="bg-card rounded-2xl shadow-xl p-8 animate-fade-in-left">
          <h2 className="text-3xl font-bold text-card-foreground mb-6 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Join Game
          </h2>
          <form onSubmit={handleJoinGame} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameCode">Game Code</Label>
              <Input
                id="gameCode"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter game code"
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Join Game
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Right side - Create Game */}
        <div className="bg-card rounded-2xl shadow-xl p-8 animate-fade-in-right">
          <h2 className="text-3xl font-bold text-card-foreground mb-6 flex items-center gap-2">
            <PlusCircle className="w-8 h-8 text-primary" />
            Create Game
          </h2>
          <form onSubmit={handleCreateGame} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameName">Game Name</Label>
              <Input
                id="gameName"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter game name"
                required
              />
            </div>
            <div>
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Maximum Players</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    id="maxPlayers"
                    min="2"
                    max="45"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="flex-1 shadow-none"
                  />
                  <div className="flex items-center text-right gap-2 min-w-[45px]">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{maxPlayers}</span>
                  </div>
                </div>
              </div>
            </div>
            {isLoading ? (
              <Button type="button" className="w-full" disabled>
                Creating Game...
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Create Game
                <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
