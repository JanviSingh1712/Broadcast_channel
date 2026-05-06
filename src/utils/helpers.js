import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isAfter, isBefore } from 'date-fns';

export const cn = (...a) => twMerge(clsx(a));

export const fmt = (d, f = 'MMM d, yyyy') => {
  if (!d) return '—';
  try { return format(typeof d === 'string' ? parseISO(d) : d, f); }
  catch { return '—'; }
};

export const fmtDT = d => fmt(d, 'MMM d, h:mm a');
export const fmtSize = b => {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
};

export const scheduleStatus = (start, end) => {
  if (!start || !end) return 'unknown';
  const n = new Date();
  const s = parseISO(start), e = parseISO(end);
  if (isBefore(n, s)) return 'scheduled';
  if (isAfter(n, e)) return 'expired';
  return 'active';
};

export const STATUS = {
  pending: { label: 'Pending', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25' },
  approved: { label: 'Approved', dot: 'bg-lime-400', text: 'text-lime-400', bg: 'bg-lime-400/10', border: 'border-lime-400/25' },
  rejected: { label: 'Rejected', dot: 'bg-coral-400', text: 'text-coral-400', bg: 'bg-coral-400/10', border: 'border-coral-500/25' },
};

export const SCHED = {
  scheduled: { label: 'Scheduled', text: 'text-ink-400', bg: 'bg-ink-500/10' },
  active: { label: '● Active', text: 'text-lime-400', bg: 'bg-lime-400/10' },
  expired: { label: 'Expired', text: 'text-sub', bg: 'bg-surface' },
  unknown: { label: '—', text: 'text-sub', bg: 'bg-surface' },
};

export const cut = (s, n = 55) => s?.length > n ? s.slice(0, n) + '…' : (s || '');
