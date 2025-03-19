export type Game = {
  id: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  numberOfCards: number;
  maxPlayers: number;
  winPattern?: Array<Array<boolean>>;
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
