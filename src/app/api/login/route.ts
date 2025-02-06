import jwt from 'jsonwebtoken';

import cookies from '@/lib/cookies';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  let role = 'player';

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    role = 'admin';
  }

  const token = jwt.sign({ role }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  cookies.set('token', token, Date.now() + 7 * 24 * 60 * 60 * 1000);

  return Response.json({
    token,
    role,
  });
}
