'use server';

import 'server-only';
import * as jose from 'jose';

import cookies from '@/lib/cookies';

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

const auth = {
  isAuthenticated,
};

export default auth;
