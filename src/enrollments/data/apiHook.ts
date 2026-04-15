import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnrollments, getEnrollmentStatus, updateBetaTesters, updateEnrollments } from '@src/enrollments/data/api';
import { enrollmentsQueryKeys } from '@src/enrollments/data/queryKeys';
import { EnrollmentsParams, UpdateBetaTestersParams, UpdateEnrollmentsParams } from '@src/enrollments/types';

export const useEnrollments = (courseId: string, params: EnrollmentsParams) => (
  useQuery({
    queryKey: enrollmentsQueryKeys.byCoursePaginated(courseId, params),
    queryFn: () => getEnrollments(courseId, params),
    enabled: !!courseId,
  })
);

export const useEnrollmentByUserId = (courseId: string, userIdentifier: string) => (
  useQuery({
    queryKey: enrollmentsQueryKeys.byUserId(courseId, userIdentifier),
    queryFn: () => getEnrollmentStatus(courseId, userIdentifier),
    enabled: false,
  })
);

export const useUpdateEnrollments = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: (params: UpdateEnrollmentsParams) => updateEnrollments(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.byCourse(courseId) });
    },
  }));
};

export const useUpdateBetaTesters = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: (params: UpdateBetaTestersParams) => updateBetaTesters(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.byCourse(courseId) });
    },
  }));
};
