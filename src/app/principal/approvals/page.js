'use client';
import { useState, useCallback } from 'react';
import { usePendingContent } from '@/hooks/useContent';
import approvalService from '@/services/approval.service';
import { StatusBadge } from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { ContentCardSkeleton } from '@/components/shared/Skeleton';
import RejectModal from '@/components/principal/RejectModal';
import Modal from '@/components/shared/Modal';
import PageHeader from '@/components/shared/PageHeader';
import toast from 'react-hot-toast';
import { CheckSquare, CheckCircle, XCircle, Eye, RefreshCw, Loader2, Calendar, User } from 'lucide-react';
import { fmtDT, fmtSize, cut } from '@/utils/helpers';

function ApprovalCard({ item, onApprove, onReject, onPreview, approving }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-muted transition-all duration-200 animate-fade-up">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* Preview image */}
      <div
        className="relative h-44 bg-surface overflow-hidden cursor-pointer"
        onClick={() => onPreview(item)}
      >
        {item.fileUrl && (
          <img src={item.fileUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye size={16} className="text-white" />
          </div>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="p-4 space-y-3 relative">
        <div>
          <h3 className="font-display font-semibold text-sm text-text">{cut(item.title, 48)}</h3>
          <p className="text-xs font-mono text-ink-400 mt-0.5">{item.subject}</p>
        </div>

        <div className="space-y-1.5 text-[11px] font-mono text-sub">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-bold text-canvas shrink-0"
              style={{ backgroundColor: item.teacherColor || '#5B5EF5' }}>
              {item.teacherInitials}
            </div>
            {item.teacherName}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={10} className="text-faint" />
            {fmtDT(item.startTime)} → {fmtDT(item.endTime)}
          </div>
        </div>

        {item.description && (
          <p className="text-xs text-sub leading-relaxed">{cut(item.description, 80)}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <button
            onClick={() => onReject(item)}
            className="btn-danger flex-1 text-xs py-2"
          >
            <XCircle size={12} /> Reject
          </button>
          <button
            onClick={() => onApprove(item.id)}
            disabled={approving === item.id}
            className="btn-success flex-1 text-xs py-2"
          >
            {approving === item.id
              ? <Loader2 size={12} className="animate-spin" />
              : <CheckCircle size={12} />
            }
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalsPage() {
  const { data, loading, error, refetch } = usePendingContent();
  const [approving, setApproving] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleApprove = useCallback(async (id) => {
    setApproving(id);
    try {
      await approvalService.approveContent(id);
      toast.success('Content approved ✦');
      refetch();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setApproving(null);
    }
  }, [refetch]);

  const handleRejectConfirm = useCallback(async (reason) => {
    await approvalService.rejectContent(rejectTarget.id, reason);
    toast.success('Content rejected');
    setRejectTarget(null);
    refetch();
  }, [rejectTarget, refetch]);

  const items = data?.data || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Principal Portal"
        title="Pending Approvals"
        subtitle={`${data?.total ?? 0} items awaiting your review`}
        actions={<button onClick={refetch} className="btn-ghost p-2.5"><RefreshCw size={15} /></button>}
      />

      {error && (
        <div className="mb-6 p-4 bg-coral-400/8 border border-coral-500/20 rounded-xl text-sm text-coral-400 font-mono">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <ContentCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={CheckCircle} title="All caught up!" desc="No content is pending approval right now." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative">
              <ApprovalCard
                item={item}
                onApprove={handleApprove}
                onReject={setRejectTarget}
                onPreview={setPreview}
                approving={approving}
              />
            </div>
          ))}
        </div>
      )}

      <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        contentTitle={rejectTarget?.title}
      />

      {/* Full preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.title || 'Preview'} size="lg">
        {preview && (
          <div className="space-y-4">
            <img src={preview.fileUrl} alt="" className="w-full rounded-xl object-cover max-h-72" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Subject', preview.subject],
                ['Teacher', preview.teacherName],
                ['Start', fmtDT(preview.startTime)],
                ['End', fmtDT(preview.endTime)],
                ['File', preview.fileName],
                ['Size', fmtSize(preview.fileSize)],
                ['Rotation', preview.rotationDuration ? `${preview.rotationDuration}s` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] font-mono text-faint uppercase tracking-wider mb-0.5">{k}</p>
                  <p className="text-text text-xs font-medium">{v}</p>
                </div>
              ))}
            </div>
            {preview.description && (
              <div>
                <p className="text-[10px] font-mono text-faint uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-sub leading-relaxed">{preview.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
