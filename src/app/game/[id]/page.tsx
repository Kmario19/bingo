'use client';

import Header from '@/components/header';
import useIndexDB from '@/hooks/useIndexDB';
import { Game, BingoColumn, Card } from '@/types/game';
import { redirect } from 'next/navigation';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import { Trophy } from 'lucide-react';
import GameControls from '@/components/game/game-controls';
import PreviousCalls from '@/components/game/previous-calls';
import CalledNumbers from '@/components/game/called-numbers';
import BingoCards from '@/components/game/bingo-cards';
import CurrentCall from '@/components/game/current-call';
import GameHeader from '@/components/game/game-header';

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

const checkForWin = (card: Card, previousCalls: string[]) => {
  // Check rows
  for (let row = 0; row < 5; row++) {
    let rowComplete = true;
    for (let col = 0; col < 5; col++) {
      const number = card[col].numbers[row];
      const call = `${card[col].letter}${number}`;
      if (number !== 0 && !previousCalls.includes(call)) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) return true;
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    let colComplete = true;
    for (let row = 0; row < 5; row++) {
      const number = card[col].numbers[row];
      const call = `${card[col].letter}${number}`;
      if (number !== 0 && !previousCalls.includes(call)) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) return true;
  }

  // Check diagonals
  let diagonal1Complete = true;
  let diagonal2Complete = true;
  for (let i = 0; i < 5; i++) {
    const number1 = card[i].numbers[i];
    const call1 = `${card[i].letter}${number1}`;
    if (number1 !== 0 && !previousCalls.includes(call1)) {
      diagonal1Complete = false;
    }

    const number2 = card[i].numbers[4 - i];
    const call2 = `${card[i].letter}${number2}`;
    if (number2 !== 0 && !previousCalls.includes(call2)) {
      diagonal2Complete = false;
    }
  }

  return diagonal1Complete || diagonal2Complete;
};

const createEmptyPattern = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default function GamePage({ params }: GamePageProps) {
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
  const [isPaused, setIsPaused] = useState(true);
  const [winningCard, setWinningCard] = useState<number | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isGeneratingCall = useRef(false);
  const [game] = useIndexDB<Game | null>('game', null);
  const [winPattern, setWinPattern] = useState(
    game?.winPattern || createEmptyPattern()
  );

  const { id } = use(params);

  useEffect(() => {
    if ((game?.maxPlayers ?? 0) > 0 && game?.id !== id) {
      // Mismatched game ID, redirecting to home
      redirect('/');
    }
  }, [game?.maxPlayers, game?.id, id]);

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
  }, [game?.maxPlayers]);

  useEffect(() => {
    if (game && game.winPattern !== winPattern) {
      game.winPattern = winPattern;
    }
  }, [game, winPattern]);

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
        console.log('Duplicate call:');
        newCall = getRandomBingoCall();
      }

      setCurrentCall(newCall);
      setPreviousCalls((prev) => {
        const newCalls = [newCall.full, ...prev];

        // Check for wins after adding new call
        cards.forEach((card, index) => {
          if (checkForWin(card, newCalls)) {
            setWinningCard(index);
            setIsPaused(true);
          }
        });

        return newCalls;
      });

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
    } finally {
      isGeneratingCall.current = false;
    }
  }, [calledNumbersByColumn, cards, muted]);

  // Timer for changing numbers
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isPaused && winningCard === null) {
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
  }, [isPaused, winningCard, generateNewCall]);

  // Toggle sound
  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  // Toggle pause/resume
  const togglePause = () => {
    if (!game?.winPattern) return;
    if (winningCard !== null) return;
    setIsPaused((prev) => !prev);
  };

  // Manual call generation (only when paused)
  const handleManualCall = () => {
    if (isPaused && winningCard === null && game?.winPattern) {
      generateNewCall();
    }
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center p-4">
        <GameHeader
          game={game}
          isPaused={isPaused}
          togglePause={togglePause}
          toggleMute={toggleMute}
          muted={muted}
          winningCard={winningCard}
        />

        <div className="w-full max-w-7xl">
          {winningCard !== null && (
            <div className="bg-yellow-500/90 text-white rounded-2xl shadow-xl p-8 mb-8 text-center animate-fade-in">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">BINGO!</h2>
              <p className="text-xl">Card {winningCard + 1} has won!</p>
            </div>
          )}

          <CurrentCall
            currentCall={currentCall}
            countdown={countdown}
            isPaused={isPaused}
            togglePause={togglePause}
            winningCard={winningCard}
            game={game}
            winPattern={winPattern}
            setWinPattern={setWinPattern}
            setCountdown={setCountdown}
          />

          <GameControls
            isPaused={isPaused}
            togglePause={togglePause}
            muted={muted}
            toggleMute={toggleMute}
            handleManualCall={handleManualCall}
            winningCard={winningCard}
          />

          <CalledNumbers
            bingoColumns={BINGO_COLUMNS}
            calledNumbersByColumn={calledNumbersByColumn}
          />

          <PreviousCalls previousCalls={previousCalls} />

          <BingoCards
            cards={cards}
            bingoColumns={BINGO_COLUMNS}
            previousCalls={previousCalls}
            winningCard={winningCard}
          />
        </div>
      </div>
    </main>
  );
}
