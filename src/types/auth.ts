export enum Role {
  Admin = 'admin',
  Player = 'player',
  Anon = 'anon',
}

export interface JwtPayload {
  email: string;
  role: Role;
  iat: number;
  exp: number;
}
