'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/auth'); return; }
    if (role && user.role !== role) router.replace(`/${user.role}/dashboard`);
  }, [user, loading, role, router]);

  if (loading || !user || (role && user.role !== role)) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-ink-500/30 animate-spin-slow" />
          <div className="absolute inset-1 rounded-full border-2 border-t-ink-500 border-transparent animate-spin" />
        </div>
      </div>
    );
  }
  return children;
}
