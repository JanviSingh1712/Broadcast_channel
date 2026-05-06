import { StatusBadge, SchedBadge } from './StatusBadge';
import { fmt, fmtDT, fmtSize, scheduleStatus, cut } from '@/utils/helpers';
import { Calendar, Clock, RotateCcw, AlertCircle, User } from 'lucide-react';

export default function ContentCard({ item, actions }) {
  const sched = scheduleStatus(item.startTime, item.endTime);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-muted transition-all duration-200 animate-fade-up relative">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink-500/40 to-transparent" />

      {/* Image preview */}
      <div className="relative h-40 bg-surface overflow-hidden">
        {item.fileUrl ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm font-mono">
            no preview
          </div>
        )}
        {/* Overlay badges */}
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={item.status} />
        </div>
        <div className="absolute bottom-2.5 left-2.5">
          <SchedBadge status={sched} />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-sm text-text leading-snug">
            {cut(item.title, 52)}
          </h3>
          <p className="text-xs text-ink-400 font-mono mt-0.5 font-medium">{item.subject}</p>
        </div>

        {/* Teacher (principal view) */}
        {item.teacherName && (
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold font-display text-canvas shrink-0"
              style={{ backgroundColor: item.teacherColor || '#5B5EF5' }}
            >
              {item.teacherInitials}
            </div>
            <span className="text-xs text-sub">{item.teacherName}</span>
          </div>
        )}

        {/* Schedule info */}
        <div className="space-y-1 text-[11px] text-sub font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar size={10} className="text-faint" />
            <span>{fmtDT(item.startTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-faint" />
            <span>Until {fmtDT(item.endTime)}</span>
          </div>
          {item.rotationDuration && (
            <div className="flex items-center gap-1.5">
              <RotateCcw size={10} className="text-faint" />
              <span>Rotates every {item.rotationDuration}s</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-faint">
            <span>Size: {fmtSize(item.fileSize)}</span>
          </div>
        </div>

        {/* Rejection reason */}
        {item.status === 'rejected' && item.rejectionReason && (
          <div className="flex gap-2 p-2.5 rounded-xl bg-coral-400/8 border border-coral-500/20">
            <AlertCircle size={12} className="text-coral-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-coral-300 leading-relaxed">{item.rejectionReason}</p>
          </div>
        )}

        {actions && (
          <div className="pt-2 border-t border-border">{actions}</div>
        )}
      </div>
    </div>
  );
}
