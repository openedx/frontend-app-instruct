import { useQuery } from '@tanstack/react-query';
import { fetchPendingTasks, getCourseInfo } from './api';
import { courseInfoQueryKeys, pendingTasksQueryKey } from './queryKeys';

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
);

export const usePendingTasks = (courseId: string, options?: { enablePolling?: boolean }) => {
  return useQuery({
    queryKey: pendingTasksQueryKey.byCourse(courseId),
    queryFn: async () => fetchPendingTasks(courseId),
    enabled: !!courseId,
    refetchInterval: options?.enablePolling ? 3000 : false,
  });
};
