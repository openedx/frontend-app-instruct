import { useQuery } from '@tanstack/react-query';
import { getCourseInfo, getDateExtensions, PaginationQueryKeys } from './api';
import { appId } from '../constants';

const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [appId, 'dateExtensions', courseId] as const,
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCourse(courseId),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);
