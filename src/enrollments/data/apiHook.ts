import { useQuery } from '@tanstack/react-query';
import { getEnrollments, getEnrollmentStatus } from './api';
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
