import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCohorts, getCohortStatus, toggleCohorts } from './api';
import { cohortsQueryKeys } from './queryKeys';

export const useCohortStatus = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.enabled(courseId),
    queryFn: () => getCohortStatus(courseId),
    enabled: !!courseId,
  })
);

export const useCohorts = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.list(courseId),
    queryFn: () => getCohorts(courseId),
    enabled: !!courseId,
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
