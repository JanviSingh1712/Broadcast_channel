import { cn, STATUS, SCHED } from '@/utils/helpers';

export function StatusBadge({ status }) {
  const c = STATUS[status] || STATUS.pending;
  return (
    <span className={cn('tag border', c.text, c.bg, c.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {c.label}
    </span>
  );
}

export function SchedBadge({ status }) {
  const c = SCHED[status] || SCHED.unknown;
  return (
    <span className={cn('tag', c.text, c.bg)}>
      {c.label}
    </span>
  );
}
