import { appId } from '../../constants';
import { PaginationParams } from './api';

export const enrollmentsQueryKeys = {
  all: [appId, 'enrollments'] as const,
  byCourse: (courseId: string) => [...enrollmentsQueryKeys.all, courseId] as const,
  byCoursePaginated: (courseId: string, pagination: PaginationParams) => [...enrollmentsQueryKeys.byCourse(courseId), pagination.page] as const,
  byUserId: (courseId: string, userIdentifier: string) => [...enrollmentsQueryKeys.byCourse(courseId), 'enrollment', userIdentifier] as const,
};
