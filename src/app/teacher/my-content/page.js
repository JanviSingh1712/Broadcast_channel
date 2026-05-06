'use client';
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTeacherContent } from '@/hooks/useContent';
import ContentCard from '@/components/shared/ContentCard';
import EmptyState from '@/components/shared/EmptyState';
import { ContentCardSkeleton } from '@/components/shared/Skeleton';
import PageHeader from '@/components/shared/PageHeader';
import Link from 'next/link';
import { FileText, Upload, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/helpers';

const TABS = ['all', 'pending', 'approved', 'rejected'];

export default function MyContentPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useTeacherContent(user?.id);
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (!data?.data) return [];
    return tab === 'all' ? data.data : data.data.filter(c => c.status === tab);
  }, [data, tab]);

  const count = (s) => data?.data?.filter(c => s === 'all' ? true : c.status === s).length ?? 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Teacher Portal"
        title="My Content"
        subtitle={`${data?.total ?? 0} items uploaded`}
        actions={
          <>
            <button onClick={refetch} className="btn-ghost p-2.5"><RefreshCw size={15} /></button>
            <Link href="/teacher/upload" className="btn-primary"><Upload size={14} /> Upload</Link>
          </>
        }
      />

      {/* Status filter tabs */}
      <div className="flex gap-1 p-1 bg-card border border-border rounded-xl w-fit mb-6">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium capitalize transition-all duration-150',
              tab === t
                ? 'bg-ink-500 text-white shadow-ink'
                : 'text-sub hover:text-text'
            )}
          >
            {t}
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded-full',
              tab === t ? 'bg-white/20 text-white' : 'bg-surface text-faint'
            )}>
              {count(t)}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral-400/8 border border-coral-500/20 rounded-xl text-sm text-coral-400 font-mono">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <ContentCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={tab === 'all' ? 'No content yet' : `No ${tab} content`}
          desc={tab === 'all' ? 'Upload your first content to get started.' : `You have no ${tab} content.`}
          action={tab === 'all' && (
            <Link href="/teacher/upload" className="btn-primary"><Upload size={14} /> Upload Content</Link>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div key={item.id} className={`stagger-${Math.min(i % 5 + 1, 5)} animate-fade-up`} style={{ opacity: 0 }}>
              <ContentCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
