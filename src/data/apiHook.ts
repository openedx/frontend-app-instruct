import { useQuery, useMutation } from '@tanstack/react-query';
import { getCourseInfo, getDateExtensions, resetDateExtension, PaginationQueryKeys } from './api';
import { appId } from '../constants';

const COURSE_INFO_QUERY_KEY = ['courseInfo'];

const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...dateExtensionsQueryKeys.all, courseId] as const,
  byCoursePaginated: (courseId: string, pagination: PaginationQueryKeys) => [...dateExtensionsQueryKeys.byCourse(courseId), pagination.page] as const,
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: COURSE_INFO_QUERY_KEY,
    queryFn: () => getCourseInfo(courseId),
  })
);

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, pagination),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);

export const useResetDateExtensionMutation = () => {
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string, userId: number }) =>
      resetDateExtension(courseId, userId),
  });
};
