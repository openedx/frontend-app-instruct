import { courseInfoQueryKeys, pendingTasksQueryKey } from './queryKeys';
import { useQuery } from '@tanstack/react-query';
import { getCourseInfo, fetchPendingTasks } from './api';

export const usePendingTasks = (courseId: string) => {
  return useQuery({
    queryKey: pendingTasksQueryKey.byCourse(courseId),
    queryFn: async () => fetchPendingTasks(courseId),
  });
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);
