import { useQuery } from '@tanstack/react-query';
import { getCourseInfo, getDateExtensions, PaginationQueryKeys } from './api';
import { appId } from '../constants';

const COURSE_INFO_QUERY_KEY = ['courseInfo'];

const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byId: (id: string) => [...dateExtensionsQueryKeys.all, id] as const,
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: COURSE_INFO_QUERY_KEY,
    queryFn: () => getCourseInfo(courseId),
  })
);

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.all,
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);
