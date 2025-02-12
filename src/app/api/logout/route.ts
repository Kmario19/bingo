import { redirect } from 'next/navigation';
import cookies from '@/lib/cookies';

export async function GET() {
  await cookies.remove('token');
  return redirect('/login');
}
