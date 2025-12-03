import { courseInfoQueryKeys, pendingTasksQueryKey } from './queryKeys';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCourseInfo, fetchPendingTasks } from './api';

export const usePendingTasks = (courseId: string) => {
  return useMutation({
    mutationKey: pendingTasksQueryKey.byCourse(courseId),
    mutationFn: async () => fetchPendingTasks(courseId),
  });
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);
