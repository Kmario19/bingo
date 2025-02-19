'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function Header() {
  const handleLogout = async (event) => {
    event.preventDefault();

    await fetch('/api/logout', {
      method: 'GET',
    });

    redirect('/login');
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-3xl font-bold">
            <span className="animate-color-change-b">B</span>
            <span className="animate-color-change-i">I</span>
            <span className="animate-color-change-n">N</span>
            <span className="animate-color-change-g">G</span>
            <span className="animate-color-change-o">O</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">John Doe</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/account">Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout" onClick={handleLogout}>
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
