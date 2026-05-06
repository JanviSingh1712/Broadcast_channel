/**
 * approval.service.js
 * All content approval / rejection API calls.
 * Swap mock blocks with apiClient calls when backend is ready.
 */
import { updateMockContent } from '@/lib/mockData';
import { simulateDelay } from '@/lib/apiClient';

const approvalService = {
  /**
   * Approve a content item.
   * Real → PATCH /api/content/:id/approve
   */
  approveContent: async (contentId) => {
    await simulateDelay();
    const updated = updateMockContent(contentId, {
      status: 'approved',
      rejectionReason: null,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new Error('Content not found');
    return { data: updated };
  },

  /**
   * Reject a content item with a mandatory reason.
   * Real → PATCH /api/content/:id/reject  { reason }
   */
  rejectContent: async (contentId, reason) => {
    await simulateDelay();
    if (!reason?.trim()) throw new Error('Rejection reason is required');
    const updated = updateMockContent(contentId, {
      status: 'rejected',
      rejectionReason: reason.trim(),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new Error('Content not found');
    return { data: updated };
  },
};

export default approvalService;
