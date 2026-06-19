'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn && pathname !== '/login') {
      router.push('/login');
    } else if (isLoggedIn && pathname === '/login') {
      router.push('/');
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLoginPage = pathname === '/login';

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <div className={`flex-1 relative z-10 ${!isLoginPage ? 'lg:ml-64' : ''}`}>
        {children}
      </div>
    </div>
  );
}
