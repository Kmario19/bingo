export type BingoCell = {
  number: number;
  checked: boolean;
};

export interface BingoCardProps {
  initialCells?: BingoCell[][];
}
