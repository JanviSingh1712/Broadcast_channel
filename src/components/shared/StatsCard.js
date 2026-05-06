import { cn } from '@/utils/helpers';

const THEMES = {
  ink: { icon: 'text-ink-400 bg-ink-500/12 border-ink-500/20', num: 'text-text', accent: 'from-ink-500/20' },
  amber: { icon: 'text-amber-400 bg-amber-400/12 border-amber-400/20', num: 'text-amber-300', accent: 'from-amber-400/10' },
  lime: { icon: 'text-lime-400 bg-lime-400/12 border-lime-400/20', num: 'text-lime-300', accent: 'from-lime-400/10' },
  coral: { icon: 'text-coral-400 bg-coral-400/12 border-coral-500/20', num: 'text-coral-300', accent: 'from-coral-400/10' },
};

export default function StatsCard({ label, value, icon: Icon, theme = 'ink', loading }) {
  const t = THEMES[theme] || THEMES.ink;

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5 overflow-hidden relative">
        <div className="shimmer h-3 w-20 rounded mb-4" />
        <div className="shimmer h-8 w-14 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 overflow-hidden relative animate-fade-up group hover:border-muted transition-colors duration-200">
      {/* Gradient accent top */}
      <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent', t.accent)} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-mono text-sub uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-xl border flex items-center justify-center shrink-0', t.icon)}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <p className={cn('text-3xl font-display font-bold tabular-nums', t.num)}>
        {value ?? '—'}
      </p>
    </div>
  );
}
