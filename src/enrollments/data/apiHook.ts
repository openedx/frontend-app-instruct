import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBetaTesters, enrollLearners, getEnrollments, getEnrollmentStatus, PaginationParams } from './api';
import { enrollmentsQueryKeys } from './queryKeys';

export const useEnrollments = (courseId: string, pagination: PaginationParams) => (
  useQuery({
    queryKey: enrollmentsQueryKeys.byCoursePaginated(courseId, pagination),
    queryFn: () => getEnrollments(courseId, pagination),
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

export const useAddBetaTesters = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: (users: string[]) => addBetaTesters(courseId, users),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentsQueryKeys.byCourse(courseId) });
    },
  }));
};
