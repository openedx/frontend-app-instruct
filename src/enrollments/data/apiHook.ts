import { useQuery } from '@tanstack/react-query';
import { getEnrollments, getEnrollmentStatus, PaginationParams } from './api';
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
