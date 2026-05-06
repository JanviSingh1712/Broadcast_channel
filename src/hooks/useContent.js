import { useState, useEffect, useCallback } from 'react';
import contentService from '@/services/content.service';

function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: e.message || 'Error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { ...state, refetch: run };
}

export const useContentStats = (teacherId = null) =>
  useAsync(() => contentService.getContentStats(teacherId), [teacherId]);

export const useTeacherContent = (teacherId) =>
  useAsync(() => contentService.getTeacherContent(teacherId), [teacherId]);

export const usePendingContent = () =>
  useAsync(() => contentService.getPendingContent(), []);

export function useAllContent(filters) {
  return useAsync(
    () => contentService.getAllContent(filters),
    [filters.status, filters.search]
  );
}

export function useLiveContent(teacherId) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(async () => {
    if (!teacherId) return;
    try {
      const data = await contentService.getLiveContent(teacherId);
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e.message }));
    }
  }, [teacherId]);

  useEffect(() => {
    run();
    const id = setInterval(run, 30000); // poll every 30s
    return () => clearInterval(id);
  }, [run]);

  return { ...state, refetch: run };
}
