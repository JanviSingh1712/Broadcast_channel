"use client";
import { useAuth } from "@/context/AuthContext";
import { useContentStats, useTeacherContent } from "@/hooks/useContent";
import StatsCard from "@/components/shared/StatsCard";
import ContentCard from "@/components/shared/ContentCard";
import EmptyState from "@/components/shared/EmptyState";
import { ContentCardSkeleton } from "@/components/shared/Skeleton";
import PageHeader from "@/components/shared/PageHeader";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  LogOut,
} from "lucide-react";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { data: stats, loading: sl } = useContentStats(user?.id);
  const { data: cd, loading: cl, refetch } = useTeacherContent(user?.id);
  const recent = cd?.data?.slice(0, 6) || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Teacher Portal"
        title={`Hello, ${user?.name?.split(" ")[0]} 👋`}
        subtitle="Here's your content broadcasting overview"
        actions={
          <>
            <button onClick={refetch} className="btn-ghost p-2.5">
              <RefreshCw size={15} />
            </button>
            <button
              onClick={logout}
              className="btn-ghost p-2.5 text-coral-400 hover:text-coral-300"
            >
              <LogOut size={15} />
            </button>
            <Link href="/teacher/upload" className="btn-primary">
              <Upload size={14} /> Upload Content
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Uploaded"
          value={stats?.data?.total}
          icon={FileText}
          theme="ink"
          loading={sl}
        />
        <StatsCard
          label="Pending Review"
          value={stats?.data?.pending}
          icon={Clock}
          theme="amber"
          loading={sl}
        />
        <StatsCard
          label="Approved"
          value={stats?.data?.approved}
          icon={CheckCircle}
          theme="lime"
          loading={sl}
        />
        <StatsCard
          label="Rejected"
          value={stats?.data?.rejected}
          icon={XCircle}
          theme="coral"
          loading={sl}
        />
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-sm text-text">
            Recent Content
          </h2>
          <Link
            href="/teacher/my-content"
            className="text-xs font-mono text-ink-400 hover:text-ink-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {cl ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No content yet"
            desc="Start by uploading your first educational content."
            action={
              <Link href="/teacher/upload" className="btn-primary">
                <Upload size={14} /> Upload Content
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((item, i) => (
              <div key={item.id} className={`stagger-${Math.min(i + 1, 5)}`}>
                <ContentCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
