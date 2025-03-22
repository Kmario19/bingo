export enum GameStatus {
  Open = 'open',
  Closed = 'closed',
  InProgress = 'in-progress',
  Finished = 'finished',
}

export type Game = {
  id: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  numberOfCards: number;
  maxPlayers: number;
  winPattern?: Array<Array<boolean>>;
  status: GameStatus;
};

export type NewGame = Omit<Game, 'dateStart' | 'dateEnd' | 'numberOfCards'>;

export type BingoColumn = {
  letter: string;
  range: [number, number];
};

export type CardColumn = {
  letter: string;
  numbers: Array<number>;
};

export type Card = Array<CardColumn>;
