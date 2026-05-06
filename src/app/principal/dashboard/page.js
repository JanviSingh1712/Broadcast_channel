"use client";
import { useContentStats, usePendingContent } from "@/hooks/useContent";
import StatsCard from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { TableRowSkeleton } from "@/components/shared/Skeleton";
import PageHeader from "@/components/shared/PageHeader";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { fmt, cut } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";

export default function PrincipalDashboard() {
  const { logout } = useAuth();
  const { data: stats, loading: sl } = useContentStats();
  const { data: pd, loading: pl, refetch } = usePendingContent();
  const pending = pd?.data?.slice(0, 8) || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Principal Portal"
        title="Dashboard"
        subtitle="Content review and management overview"
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
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Content"
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

      {/* Pending table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-display font-semibold text-sm text-text">
              Pending Approvals
            </h2>
            <p className="text-xs font-mono text-sub mt-0.5">
              {pd?.total ?? 0} items awaiting review
            </p>
          </div>
          <Link
            href="/principal/approvals"
            className="flex items-center gap-1 text-xs font-mono text-ink-400 hover:text-ink-300 transition-colors"
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Subject", "Teacher", "Uploaded", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-mono text-faint uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {pl ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              ) : pending.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={CheckCircle}
                      title="All clear!"
                      desc="No content pending approval."
                    />
                  </td>
                </tr>
              ) : (
                pending.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/60 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.fileUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-surface shrink-0"
                          loading="lazy"
                        />
                        <span className="text-text font-medium text-xs">
                          {cut(item.title, 36)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sub text-xs font-mono">
                      {item.subject}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold font-display text-canvas shrink-0"
                          style={{
                            backgroundColor: item.teacherColor || "#5B5EF5",
                          }}
                        >
                          {item.teacherInitials}
                        </div>
                        <span className="text-sub text-xs">
                          {item.teacherName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-faint text-xs font-mono whitespace-nowrap">
                      {fmt(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
