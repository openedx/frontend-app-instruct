import { appId } from '@src/constants';

export const cohortsQueryKeys = {
  all: [appId, 'cohorts'] as const,
  byCourse: (courseId: string) => [...cohortsQueryKeys.all, 'byCourse', courseId] as const,
  list: (courseId: string) => [...cohortsQueryKeys.byCourse(courseId), courseId, 'list'] as const,
  enabled: (courseId: string) => ['cohortsEnabled', courseId] as const,
  contentGroups: (courseId: string) => [...cohortsQueryKeys.byCourse(courseId), 'contentGroups'] as const,
};
