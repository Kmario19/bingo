'use client';

import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  isPaused: boolean;
  togglePause: () => void;
  muted: boolean;
  toggleMute: () => void;
  handleManualCall: () => void;
  winningCard: number | null;
}

export default function GameControls({
  isPaused,
  togglePause,
  muted,
  toggleMute,
  handleManualCall,
  winningCard,
}: GameControlsProps) {
  return (
    <div className="bg-card/90 rounded-xl shadow-lg p-4 mb-8">
      <h3 className="text-lg font-medium text-card-foreground mb-2">
        Game Controls
      </h3>
      <div className="flex gap-2">
        <Button
          onClick={togglePause}
          variant="outline"
          className="flex items-center gap-2"
          disabled={winningCard !== null}
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
        {isPaused && winningCard === null && (
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
  );
}
