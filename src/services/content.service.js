/**
 * content.service.js
 * All content CRUD API calls.
 * Swap mock blocks with apiClient calls when backend is ready.
 */
import { getMockContent, addMockContent, updateMockContent } from '@/lib/mockData';
import { simulateDelay } from '@/lib/apiClient';
import { isAfter, isBefore, parseISO } from 'date-fns';

const contentService = {
  /**
   * Get all content (principal view) with optional filters.
   * Real → GET /api/content?status=&search=
   */
  getAllContent: async ({ status, search } = {}) => {
    await simulateDelay();
    let items = getMockContent();
    if (status && status !== 'all') items = items.filter(c => c.status === status);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
      );
    }
    return { data: items, total: items.length };
  },

  /**
   * Get content uploaded by a specific teacher.
   * Real → GET /api/content/teacher/:teacherId
   */
  getTeacherContent: async (teacherId) => {
    await simulateDelay();
    const items = getMockContent().filter(c => c.teacherId === teacherId);
    return { data: items, total: items.length };
  },

  /**
   * Get single content item.
   * Real → GET /api/content/:id
   */
  getContentById: async (id) => {
    await simulateDelay();
    const item = getMockContent().find(c => c.id === id);
    if (!item) throw new Error('Content not found');
    return { data: item };
  },

  /**
   * Get currently active content for a teacher's public live page.
   * Active = status approved + now is between startTime and endTime.
   * Real → GET /api/content/live/:teacherId
   */
  getLiveContent: async (teacherId) => {
    await simulateDelay();
    const now = new Date();
    const items = getMockContent().filter(c => {
      if (c.teacherId !== teacherId || c.status !== 'approved') return false;
      return isAfter(now, parseISO(c.startTime)) && isBefore(now, parseISO(c.endTime));
    });
    return { data: items };
  },

  /**
   * Upload new content.
   * Real → POST /api/content  (multipart/form-data for file)
   */
  uploadContent: async (payload) => {
    await simulateDelay();
    const item = {
      id: `content-${Date.now()}`,
      ...payload,
      status: 'pending',
      rejectionReason: null,
      fileUrl: payload.previewUrl || `https://picsum.photos/seed/${Date.now() % 100}/800/600`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addMockContent(item);
    return { data: item };
  },

  /**
   * Get all pending content.
   * Real → GET /api/content?status=pending
   */
  getPendingContent: async () => {
    await simulateDelay();
    const items = getMockContent().filter(c => c.status === 'pending');
    return { data: items, total: items.length };
  },

  /**
   * Aggregate stats — optionally scoped to a teacher.
   * Real → GET /api/content/stats?teacherId=
   */
  getContentStats: async (teacherId = null) => {
    await simulateDelay();
    let items = getMockContent();
    if (teacherId) items = items.filter(c => c.teacherId === teacherId);
    return {
      data: {
        total: items.length,
        pending: items.filter(c => c.status === 'pending').length,
        approved: items.filter(c => c.status === 'approved').length,
        rejected: items.filter(c => c.status === 'rejected').length,
      },
    };
  },
};

export default contentService;
