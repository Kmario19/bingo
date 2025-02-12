'use server';

import 'server-only';
import * as jose from 'jose';

import cookies from '@/lib/cookies';

import { JwtPayload, Role } from '@/types/auth';

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

const isAuthenticated = async () => {
  const token = await cookies.get('token');

  if (!token) {
    return false;
  }

  try {
    const decoded = await jose.jwtVerify(token, jwtConfig.secret);
    return decoded.payload ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getSession = async () => {
  const token = await cookies.get('token');
  const anon = { email: '', role: Role.Anon };

  if (!token) {
    return anon;
  }

  try {
    const decoded = await jose.jwtVerify<JwtPayload>(token, jwtConfig.secret);
    return decoded.payload;
  } catch (error) {
    console.error(error);
    return anon;
  }
};

const auth = {
  isAuthenticated,
  getSession,
};

export default auth;
