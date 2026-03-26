import { appId } from '../../constants';
import { EnrollmentsParams } from '../types';

export const enrollmentsQueryKeys = {
  all: [appId, 'enrollments'] as const,
  byCourse: (courseId: string) => [...enrollmentsQueryKeys.all, courseId] as const,
  byCoursePaginated: (courseId: string, params: EnrollmentsParams) => [...enrollmentsQueryKeys.byCourse(courseId), params.page, params.pageSize, params.emailOrUsername, params.isBetaTester] as const,
  byUserId: (courseId: string, userIdentifier: string) => [...enrollmentsQueryKeys.byCourse(courseId), 'enrollment', userIdentifier] as const,
};
