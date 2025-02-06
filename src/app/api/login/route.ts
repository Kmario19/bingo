import jwt from 'jsonwebtoken';

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
    expiresIn: '1h',
  });

  return Response.json({
    token,
    role,
  });
}
