'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      await fetch('/api/logout', {
        method: 'GET',
      });
      redirect('/login');
    };
    logout();
  });

  return <div>Logging out...</div>;
}
