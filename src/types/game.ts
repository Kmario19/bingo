export type Game = {
  id: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  numberOfCards: number;
  maxPlayers: number;
};

export type NewGame = Omit<Game, 'dateStart' | 'dateEnd' | 'numberOfCards'>;
