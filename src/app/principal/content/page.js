'use client';
import { useState, useMemo } from 'react';
import { useAllContent } from '@/hooks/useContent';
import { StatusBadge, SchedBadge } from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { TableRowSkeleton } from '@/components/shared/Skeleton';
import PageHeader from '@/components/shared/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { List, Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { fmt, scheduleStatus, cut } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

const PAGE_SIZE = 15;
const STATUS_OPTS = ['all', 'pending', 'approved', 'rejected'];

export default function AllContentPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search, 350);

  const { data, loading, error, refetch } = useAllContent({ status, search: dSearch });

  const items = data?.data || [];
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Principal Portal"
        title="All Content"
        subtitle={`${data?.total ?? 0} total items`}
        actions={<button onClick={refetch} className="btn-ghost p-2.5"><RefreshCw size={15} /></button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search title, subject, teacher…"
            className="input-base pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="input-base appearance-none pr-8 cursor-pointer w-auto capitalize min-w-36"
          >
            {STATUS_OPTS.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral-400/8 border border-coral-500/20 rounded-xl text-sm text-coral-400 font-mono">{error}</div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Title', 'Subject', 'Teacher', 'Schedule', 'Status', 'Uploaded'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-faint uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : paged.length === 0
                ? (
                  <tr><td colSpan={6}>
                    <EmptyState icon={List} title="No content found" desc={search ? 'Try adjusting your search.' : 'No content uploaded yet.'} />
                  </td></tr>
                )
                : paged.map(item => {
                  const sched = scheduleStatus(item.startTime, item.endTime);
                  return (
                    <tr key={item.id} className="border-b border-border/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={item.fileUrl} alt="" loading="lazy" className="w-8 h-8 rounded-lg object-cover bg-surface shrink-0" />
                          <span className="text-text text-xs font-medium">{cut(item.title, 36)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-sub">{item.subject}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md text-[8px] font-bold font-display text-canvas flex items-center justify-center shrink-0"
                            style={{ backgroundColor: item.teacherColor || '#5B5EF5' }}>
                            {item.teacherInitials}
                          </div>
                          <span className="text-xs text-sub">{item.teacherName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><SchedBadge status={sched} /></td>
                      <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-3 text-[11px] font-mono text-faint whitespace-nowrap">{fmt(item.createdAt)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs font-mono text-faint">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, items.length)} of {items.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sub hover:text-text hover:bg-surface disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors',
                    p === page ? 'bg-ink-500 text-white' : 'text-sub hover:bg-surface hover:text-text'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sub hover:text-text hover:bg-surface disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
