'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, loading } = useAuth();
  const router = useRouter();
  const isLoginPage = pathname === '/login';

  React.useEffect(() => {
    if (!loading && !session && !isLoginPage) {
      router.push('/login');
    }
  }, [session, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-foreground rounded-full animate-bounce flex items-center justify-center shadow-2xl shadow-foreground/10">
            <span className="text-background font-black text-sm">S.</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground animate-pulse italic font-title">Stela Intelligence</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
