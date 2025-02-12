import * as jose from 'jose';

import cookies from '@/lib/cookies';

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.JWT_SECRET),
};

export async function POST(request: Request) {
  const { email, password } = await request.json();

  let role = 'player';

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    role = 'admin';
  }

  const token = await new jose.SignJWT({
    email,
    role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(jwtConfig.secret);

  await cookies.set('token', token, Date.now() + 7 * 24 * 60 * 60 * 1000);

  return Response.json({
    token,
    role,
  });
}
