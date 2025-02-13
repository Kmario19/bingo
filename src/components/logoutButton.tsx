'use client';

import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

const LogoutButton = () => {
  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'GET',
    });
    redirect('/login');
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
