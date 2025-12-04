import { appId } from '../constants';

export const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

export const cohortsQueryKeys = {
  all: [appId, 'cohorts'] as const,
  list: (courseId: string) => [...cohortsQueryKeys.all, courseId, 'list'] as const,
  enabled: (courseId: string) => ['cohortsEnabled', courseId] as const,
};
