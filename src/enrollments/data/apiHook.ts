import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollLearners, getEnrollments, getEnrollmentStatus, unenrollLearners } from './api';
import { enrollmentsQueryKeys } from './queryKeys';
import { EnrollmentsParams } from '../types';

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

export const useEnrollLearners = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: (users: string[]) => enrollLearners(courseId, users),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.byCourse(courseId) });
    },
  }));
};

export const useUnenrollLearners = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: (users: string[]) => unenrollLearners(courseId, users),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.byCourse(courseId) });
    },
  }));
};
