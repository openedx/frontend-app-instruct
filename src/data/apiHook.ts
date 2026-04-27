import { useQuery } from '@tanstack/react-query';
import { fetchPendingTasks, getCourseInfo, getLearner, getProblemDetails } from './api';
import { courseInfoQueryKeys, learnerQueryKeys, pendingTasksQueryKey, problemQueryKeys } from './queryKeys';

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

export const useLearner = (courseId: string, emailOrUsername: string) => (
  useQuery({
    queryKey: learnerQueryKeys.byCourseAndLearner(courseId, emailOrUsername),
    queryFn: () => getLearner(courseId, emailOrUsername),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

export const useProblemDetails = (courseId: string, blockId: string, emailOrUsername: string) => (
  useQuery({
    queryKey: problemQueryKeys.byCourseAndLearner(courseId, blockId, emailOrUsername),
    queryFn: () => getProblemDetails(courseId, blockId, emailOrUsername),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));
