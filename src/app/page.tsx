'use client';

import { useState } from 'react';
import { PlusCircle, Users, Trophy, ArrowRight, Grid2x2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [gameName, setGameName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [gameCode, setGameCode] = useState('');

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement game creation logic
    console.log('Creating game:', { gameName, maxPlayers });
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
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Maximum Players</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="range"
                  id="maxPlayers"
                  min="2"
                  max="10"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="flex items-center gap-2 min-w-[80px]">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{maxPlayers}</span>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create Game
              <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
