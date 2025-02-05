'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const COLUMN_COLORS = ['red', 'teal', 'green', 'orange', 'purple'];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = e.target as HTMLFormElement;

    setIsLoading(true);
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    setIsLoading(false);

    if (response.ok) {
      const { role } = await response.json();
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/play');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">
          Bingo Game
        </h1>
        <p className="text-gray-600">Sign in to start playing!</p>
      </div>
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center relative">
            <div className="flex justify-center space-x-1 mb-4">
              {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                <span
                  key={letter}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold
                  text-${COLUMN_COLORS[index]}-500 bg-${COLUMN_COLORS[index]}-50`}
                >
                  {letter}
                </span>
              ))}
            </div>
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                required
                className="rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="rounded-xl border-2 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl h-12 text-lg font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Don&apos;t have an account?{' '}
              <a
                href="#"
                className="text-purple-500 hover:text-purple-600 font-semibold"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
