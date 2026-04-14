import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnrollments, getEnrollmentStatus, updateEnrollments } from './api';
import { enrollmentsQueryKeys } from './queryKeys';
import { EnrollmentsParams, UpdateEnrollmentsParams } from '../types';

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
