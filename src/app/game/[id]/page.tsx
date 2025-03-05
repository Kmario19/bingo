'use client';

import Header from '@/components/header';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Game, BingoColumn, CardColumn, Card } from '@/types/game';
import { redirect } from 'next/navigation';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  CheckCircle,
  Pause,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Bingo columns with their corresponding letters
const BINGO_COLUMNS: BingoColumn[] = [
  { letter: 'B', range: [1, 15] },
  { letter: 'I', range: [16, 30] },
  { letter: 'N', range: [31, 45] },
  { letter: 'G', range: [46, 60] },
  { letter: 'O', range: [61, 75] },
];

// Generate a random number within a range
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random bingo call (letter + number)
const getRandomBingoCall = () => {
  const columnIndex = Math.floor(Math.random() * BINGO_COLUMNS.length);
  const column = BINGO_COLUMNS[columnIndex];
  const number = getRandomNumber(column.range[0], column.range[1]);
  return { letter: column.letter, number, full: `${column.letter}${number}` };
};

// Generate a bingo card with random numbers
const generateBingoCard = () => {
  const card: Card = BINGO_COLUMNS.map((column) => {
    const numbers = [];
    const usedNumbers = new Set();

    // Generate 5 unique random numbers for each column
    while (numbers.length < 5) {
      const num = getRandomNumber(column.range[0], column.range[1]);
      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
        numbers.push(num);
      }
    }

    return {
      letter: column.letter,
      numbers: numbers,
    };
  });

  // Set the middle spot as a free space
  card[2].numbers[2] = 0; // Free space

  return card;
};

export default function GamePage() {
  const [currentCall, setCurrentCall] = useState<{
    letter: string;
    number: number;
    full: string;
  } | null>(null);
  const [previousCalls, setPreviousCalls] = useState<string[]>([]);
  const [calledNumbersByColumn, setCalledNumbersByColumn] = useState<
    Record<string, number[]>
  >({
    B: [],
    I: [],
    N: [],
    G: [],
    O: [],
  });
  const [cards, setCards] = useState<Card[]>([]);
  const [muted, setMuted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isGeneratingCall = useRef(false);
  const [game] = useLocalStorage<Game | null>('game', null);

  useEffect(() => {
    const id = location.pathname.split('/').pop();
    if (!game || game.id !== id) {
      redirect('/');
    }
  }, [game]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesisRef.current = new SpeechSynthesisUtterance();
      speechSynthesisRef.current.rate = 0.9;
      speechSynthesisRef.current.pitch = 1;
    }

    // Generate initial cards
    const newCards = Array(game?.maxPlayers)
      .fill(0)
      .map(() => generateBingoCard());
    setCards(newCards);

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Clear any existing timer when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [game]);

  // Generate a new call
  const generateNewCall = useCallback(() => {
    // Validate if the game is over
    // Prevent multiple simultaneous calls
    if (isGeneratingCall.current) return;

    isGeneratingCall.current = true;

    try {
      // Generate a new call
      let newCall = getRandomBingoCall();

      // Ensure we don't repeat a call
      while (calledNumbersByColumn[newCall.letter].includes(newCall.number)) {
        newCall = getRandomBingoCall();
      }

      setCurrentCall(newCall);
      setPreviousCalls((prev) => [newCall.full, ...prev]);

      // Update called numbers by column
      setCalledNumbersByColumn((prev) => {
        const newState = { ...prev };
        newState[newCall.letter] = [
          ...newState[newCall.letter],
          newCall.number,
        ].sort((a, b) => a - b);
        return newState;
      });

      // Play sound for the new call
      if (
        !muted &&
        speechSynthesisRef.current &&
        typeof window !== 'undefined' &&
        window.speechSynthesis
      ) {
        speechSynthesisRef.current.text = `${newCall.letter} ${newCall.number}`;
        window.speechSynthesis.speak(speechSynthesisRef.current);
      }

      // Reset countdown
      setCountdown(10);
    } finally {
      isGeneratingCall.current = false;
    }
  }, [calledNumbersByColumn, muted]);

  // Timer for changing numbers
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only set up the timer if the game is not paused
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Generate a new call when countdown reaches 0
            generateNewCall();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, generateNewCall]);

  // Toggle sound
  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  // Toggle pause/resume
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Manual call generation (only when paused)
  const handleManualCall = () => {
    if (isPaused) {
      generateNewCall();
    }
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-4">
        {/* Header with logo and back button */}
        <div className="w-full max-w-7xl flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lobby
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-white">{game?.title}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={togglePause}
              className="text-white hover:bg-white/20"
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

        {/* Main game display */}
        <div className="w-full max-w-7xl">
          {/* Current call display */}
          <div className="bg-card rounded-2xl shadow-xl p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary/20 text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
              {isPaused ? (
                <span className="flex items-center gap-1">
                  <Pause className="h-3 w-3" /> Game Paused
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

          {/* Called Numbers Table */}
          <div className="bg-card/90 rounded-xl shadow-lg p-4 mb-8">
            <h3 className="text-lg font-medium text-card-foreground mb-4">
              Called Numbers
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {BINGO_COLUMNS.map((column) => (
                <div key={column.letter} className="flex flex-col">
                  <div className="bg-primary text-primary-foreground font-bold text-center py-2 rounded-t-md">
                    {column.letter}
                  </div>
                  <div className="bg-card border border-border rounded-b-md p-2 min-h-[200px]">
                    <div className="grid grid-cols-3 gap-1">
                      {calledNumbersByColumn[column.letter].map((number) => (
                        <div
                          key={`${column.letter}-${number}`}
                          className="bg-primary/10 text-primary-foreground rounded-md px-2 py-1 text-sm font-medium text-center"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous calls */}
          <div className="bg-card/90 rounded-xl shadow-lg p-4 mb-8">
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              Recent Calls
            </h3>
            <div className="flex flex-wrap gap-2">
              {previousCalls.slice(0, 15).map((call, index) => (
                <div
                  key={index}
                  className="bg-primary/10 text-primary-foreground rounded-md px-2 py-1 text-sm font-medium"
                >
                  {call}
                </div>
              ))}
              {previousCalls.length === 0 && (
                <p className="text-sm text-card-foreground/70">
                  No previous calls
                </p>
              )}
            </div>
          </div>

          {/* Game controls */}
          <div className="bg-card/90 rounded-xl shadow-lg p-4 mb-8">
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              Game Controls
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={togglePause}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" /> Resume Game
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" /> Pause Game
                  </>
                )}
              </Button>
              <Button
                onClick={toggleMute}
                variant="outline"
                className="flex items-center gap-2"
              >
                {muted ? (
                  <>
                    <Volume2 className="h-4 w-4" /> Unmute
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" /> Mute
                  </>
                )}
              </Button>
              {isPaused && (
                <Button
                  onClick={handleManualCall}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Next Call
                </Button>
              )}
            </div>
          </div>

          {/* Bingo cards */}
          <h3 className="text-xl font-bold text-white mb-4">
            Your Bingo Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, cardIndex) => (
              <div key={cardIndex} className="bg-card rounded-xl shadow-lg p-4">
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
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
