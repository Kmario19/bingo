import 'server-only';
import jwt from 'jsonwebtoken';

import cookies from '@/lib/cookies';

const isAuthenticated = async () => {
  const token = await cookies.get('token');

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
