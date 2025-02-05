export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return Response.json({
      role: 'admin',
    });
  }

  return Response.json({
    role: 'player',
  });
}
