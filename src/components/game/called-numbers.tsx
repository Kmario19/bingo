'use client';

import { BingoColumn } from '@/types/game';

interface CalledNumbersProps {
  bingoColumns: BingoColumn[];
  calledNumbersByColumn: Record<string, number[]>;
}

export default function CalledNumbers({
  bingoColumns,
  calledNumbersByColumn,
}: CalledNumbersProps) {
  return (
    <div className="bg-card/90 rounded-xl shadow-lg p-4 mb-8">
      <h3 className="text-lg font-medium text-card-foreground mb-4">
        Called Numbers
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {bingoColumns.map((column) => (
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
  );
}
