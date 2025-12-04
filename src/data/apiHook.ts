import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCourseInfo, getCohorts, getCohortStatus, toggleCohorts } from './api';
import { courseInfoQueryKeys, cohortsQueryKeys } from './queryKeys';

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);

export const useCohortStatus = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.enabled(courseId),
    queryFn: () => getCohortStatus(courseId),
  })
);

export const useCohorts = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.list(courseId),
    queryFn: () => getCohorts(courseId),
  })
);

export const useToggleCohorts = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: ({ isCohorted }: { isCohorted: boolean }) => toggleCohorts(courseId, isCohorted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortsQueryKeys.enabled(courseId) });
    },
  }));
};
