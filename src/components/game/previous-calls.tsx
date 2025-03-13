'use client';

interface PreviousCallsProps {
  previousCalls: string[];
}

export default function PreviousCalls({ previousCalls }: PreviousCallsProps) {
  return (
    <div className="bg-card/90 rounded-xl shadow-lg p-4 mb-8">
      <h3 className="text-lg font-medium text-card-foreground mb-2">
        Recent Calls
      </h3>
      <div className="flex flex-wrap gap-2">
        {previousCalls.slice(0, 15).map((call, index) => (
          <div
            key={index}
            className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm font-medium"
          >
            {call}
          </div>
        ))}
        {previousCalls.length === 0 && (
          <p className="text-sm text-card-foreground/70">No previous calls</p>
        )}
      </div>
    </div>
  );
}
