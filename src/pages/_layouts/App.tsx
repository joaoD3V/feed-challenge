import { Outlet } from 'react-router-dom';

import { Header } from '@/components/Header';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-foreground text-zinc-100 antialiased">
      <Header />

      <div className="container flex flex-1 flex-col p-8">
        <Outlet />
      </div>
    </div>
  );
}
