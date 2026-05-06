'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import contentService from '@/services/content.service';
import { SUBJECTS } from '@/lib/mockData';
import toast from 'react-hot-toast';
import { ImageIcon, X, Loader2, Upload, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import PageHeader from '@/components/shared/PageHeader';
import Link from 'next/link';

// Allowed: JPG, PNG, GIF — Max 10 MB
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/gif'];

const schema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z.coerce.number().min(5, 'Min 5 sec').max(300, 'Max 300 sec').optional().or(z.literal('')),
  })
  .refine(d => !d.startTime || !d.endTime || new Date(d.endTime) > new Date(d.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

function FieldWrap({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-mono text-sub uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-coral-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-coral-400 font-mono flex items-center gap-1">
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  );
}

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [fileErr, setFileErr] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const processFile = (file) => {
    setFileErr('');
    if (!ALLOWED.includes(file.type)) {
      setFileErr('Only JPG, PNG, GIF allowed');
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileErr('File must be under 10 MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileMeta({ name: file.name, size: file.size, type: file.type });
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileMeta(null);
    setFileErr('');
  };

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }, []);

  const onSubmit = async (data) => {
    if (!fileMeta) { setFileErr('Please upload a file'); return; }
    setBusy(true);
    try {
      await contentService.uploadContent({
        ...data,
        teacherId: user.id,
        teacherName: user.name,
        teacherInitials: user.initials,
        teacherColor: user.color,
        fileName: fileMeta.name,
        fileSize: fileMeta.size,
        fileType: fileMeta.type,
        previewUrl: preview,
      });
      toast.success('Content uploaded — pending approval');
      reset();
      clearFile();
      router.push('/teacher/my-content');
    } catch (e) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const inputCls = 'input-base';
  const selectCls = cn(inputCls, 'appearance-none pr-9 cursor-pointer');

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <PageHeader
        eyebrow="Teacher Portal"
        title="Upload Content"
        subtitle="Fill in all details and attach your file for principal review"
        actions={
          <Link href="/teacher/dashboard" className="btn-ghost">← Back</Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* File upload card */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display font-semibold text-sm text-text mb-1">Content File</h3>
          <p className="text-xs text-sub font-mono mb-4">JPG · PNG · GIF — max 10 MB</p>

          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img src={preview} alt="preview" className="w-full h-56 object-cover" />
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-canvas/70 backdrop-blur flex items-center justify-center text-text hover:bg-canvas transition-colors"
              >
                <X size={12} />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-canvas/80 p-3">
                <p className="text-xs font-mono text-text/80 truncate">{fileMeta?.name}</p>
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-lime-400/20 border border-lime-400/30">
                <CheckCircle size={10} className="text-lime-400" />
                <span className="text-[10px] font-mono text-lime-400">Ready</span>
              </div>
            </div>
          ) : (
            <label
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
                dragging
                  ? 'border-ink-500 bg-ink-500/8'
                  : 'border-border hover:border-muted hover:bg-surface/60'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mb-3">
                <ImageIcon size={18} className="text-muted" />
              </div>
              <p className="text-sm text-sub">
                Drag & drop or{' '}
                <span className="text-ink-400 underline underline-offset-2">browse file</span>
              </p>
              <p className="text-xs font-mono text-faint mt-1">JPG · PNG · GIF · max 10 MB</p>
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            </label>
          )}
          {fileErr && <p className="mt-2 text-xs text-coral-400 font-mono flex items-center gap-1"><AlertCircle size={10} />{fileErr}</p>}
        </div>

        {/* Content details */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-text">Content Details</h3>

          <FieldWrap label="Title" required error={errors.title?.message}>
            <input {...register('title')} placeholder="e.g. Introduction to Algebra" className={inputCls} />
          </FieldWrap>

          <FieldWrap label="Subject" required error={errors.subject?.message}>
            <div className="relative">
              <select {...register('subject')} className={selectCls}>
                <option value="">Select a subject…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
            </div>
          </FieldWrap>

          <FieldWrap label="Description (optional)">
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief description of the content…"
              className={cn(inputCls, 'resize-none')}
            />
          </FieldWrap>
        </div>

        {/* Scheduling */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-text">Scheduling</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrap label="Start Time" required error={errors.startTime?.message}>
              <input {...register('startTime')} type="datetime-local" className={cn(inputCls, 'cursor-pointer')} />
            </FieldWrap>
            <FieldWrap label="End Time" required error={errors.endTime?.message}>
              <input {...register('endTime')} type="datetime-local" className={cn(inputCls, 'cursor-pointer')} />
            </FieldWrap>
          </div>

          <FieldWrap label="Rotation Duration (seconds)" error={errors.rotationDuration?.message}>
            <input
              {...register('rotationDuration')}
              type="number"
              placeholder="e.g. 30 (5–300 seconds)"
              min={5} max={300}
              className={inputCls}
            />
          </FieldWrap>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-ghost px-5">Cancel</button>
          <button type="submit" disabled={busy} className="btn-primary flex-1">
            {busy ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload for Review</>}
          </button>
        </div>
      </form>
    </div>
  );
}
