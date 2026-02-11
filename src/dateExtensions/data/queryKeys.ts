import { appId } from '../../constants';
import { DateExtensionQueryParams } from '../types';

export const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...dateExtensionsQueryKeys.all, courseId] as const,
  byCoursePaginated: (
    courseId: string,
    params: DateExtensionQueryParams
  ) => [
    ...dateExtensionsQueryKeys.byCourse(courseId),
    params.page,
    params.pageSize,
    params.emailOrUsername || '',
    params.blockId || ''
  ] as const,
};

export const gradedSubsectionsQueryKeys = {
  all: [appId, 'gradedSubsections'] as const,
  byCourse: (courseId: string) => [...gradedSubsectionsQueryKeys.all, courseId] as const,
};
