import 'server-only';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

const isAuthenticated = (request: NextRequest) => {
  const [, token] = request.headers.get('authorization')?.split(' ') || [];

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const auth = {
  isAuthenticated,
};

export default auth;
