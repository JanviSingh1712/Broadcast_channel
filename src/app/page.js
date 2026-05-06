'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Root() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/auth');
    else router.replace(`/${user.role}/dashboard`);
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-ink-500/30 animate-spin-slow" />
        <div className="absolute inset-1 rounded-full border-2 border-t-ink-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
    </div>
  );
}
