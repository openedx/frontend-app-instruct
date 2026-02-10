import { PaginationQueryKeys } from '@src/types';
import { appId } from '../../constants';

export const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...dateExtensionsQueryKeys.all, courseId] as const,
  byCoursePaginated: (courseId: string, pagination: PaginationQueryKeys) => [...dateExtensionsQueryKeys.byCourse(courseId), pagination.page] as const,
};

export const gradedSubsectionsQueryKeys = {
  all: [appId, 'gradedSubsections'] as const,
  byCourse: (courseId: string) => [...gradedSubsectionsQueryKeys.all, courseId] as const,
};
