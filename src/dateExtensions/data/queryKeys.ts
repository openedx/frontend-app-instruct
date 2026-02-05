import { appId } from '../../constants';
import { PaginationQueryKeys } from './api';

export const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...dateExtensionsQueryKeys.all, courseId] as const,
  byCoursePaginated: (courseId: string, pagination: PaginationQueryKeys) => [...dateExtensionsQueryKeys.byCourse(courseId), pagination.page] as const,
};
