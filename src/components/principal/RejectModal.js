'use client';
import { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function RejectModal({ open, onClose, onConfirm, contentTitle }) {
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!reason.trim()) { setErr('Rejection reason is required'); return; }
    setBusy(true);
    try {
      await onConfirm(reason.trim());
      setReason('');
      setErr('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const close = () => { setReason(''); setErr(''); onClose(); };

  return (
    <Modal open={open} onClose={close} title="Reject Content" size="md">
      <div className="space-y-4">
        {contentTitle && (
          <div className="p-3 rounded-xl bg-surface border border-border">
            <p className="text-[10px] font-mono text-faint uppercase tracking-wider mb-0.5">Content</p>
            <p className="text-sm font-semibold text-text">{contentTitle}</p>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-sub uppercase tracking-wider mb-1.5">
            Rejection Reason <span className="text-coral-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={e => { setReason(e.target.value); setErr(''); }}
            rows={4}
            placeholder="Explain why this content is being rejected. This will be visible to the teacher."
            className="input-base resize-none focus:border-coral-500/60 focus:ring-coral-500/20"
          />
          {err && (
            <p className="mt-1.5 text-xs text-coral-400 font-mono flex items-center gap-1">
              <AlertCircle size={10} />{err}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={close} className="btn-ghost flex-1">Cancel</button>
          <button onClick={confirm} disabled={busy} className="btn-danger flex-1">
            {busy ? <><Loader2 size={13} className="animate-spin" /> Rejecting…</> : 'Reject Content'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
