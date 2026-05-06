'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/helpers';
import {
  LayoutDashboard, Upload, FileText,
  CheckSquare, List, LogOut, Radio,
} from 'lucide-react';

const LINKS = {
  teacher: [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/upload', label: 'Upload Content', icon: Upload },
    { href: '/teacher/my-content', label: 'My Content', icon: FileText },
  ],
  principal: [
    { href: '/principal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/principal/approvals', label: 'Approvals', icon: CheckSquare },
    { href: '/principal/content', label: 'All Content', icon: List },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const path = usePathname();
  if (!user) return null;
  const links = LINKS[user.role] || [];

  return (
    <aside className="w-60 shrink-0 bg-surface border-r border-border flex flex-col min-h-screen relative overflow-hidden">
      {/* Ambient glow */}
      <div className="orb w-48 h-48 bg-ink-500/10 -top-16 -left-16 animate-glow-pulse" />

      {/* Logo */}
      <div className="px-5 py-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ink-500 flex items-center justify-center shadow-glow-ink">
            <Radio size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-text text-base tracking-tight">BroadcastED</span>
        </div>
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* User */}
      <div className="px-4 py-4 relative z-10">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-display text-canvas shrink-0"
            style={{ backgroundColor: user.color || '#5B5EF5' }}
          >
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text truncate">{user.name}</p>
            <p className="text-[11px] text-sub capitalize font-mono">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 relative z-10">
        <p className="px-2 mb-2 text-[10px] font-mono font-medium text-muted uppercase tracking-widest">
          {user.role === 'teacher' ? 'Teaching' : 'Management'}
        </p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group',
                active
                  ? 'bg-ink-500/15 text-ink-400 border border-ink-500/25 font-semibold'
                  : 'text-sub hover:text-text hover:bg-card font-medium'
              )}
            >
              <Icon
                size={15}
                className={cn(
                  'shrink-0 transition-colors',
                  active ? 'text-ink-400' : 'text-muted group-hover:text-sub'
                )}
              />
              <span className="font-body">{label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ink-400 animate-glow-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 pt-3 border-t border-border relative z-10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sub hover:text-coral-400 hover:bg-coral-400/8 transition-all duration-150 group"
        >
          <LogOut size={15} className="shrink-0 transition-colors group-hover:text-coral-400" />
          <span className="font-body">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
