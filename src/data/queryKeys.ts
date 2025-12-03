import { appId } from '../constants';

export const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

export const cohortsQueryKeys = {
  all: [appId, 'cohorts'] as const,
  list: (courseId: string) => [...cohortsQueryKeys.all, courseId, 'list'] as const,
  enabled: (courseId: string) => ['cohortsEnabled', courseId] as const,
  byCourse: (courseId: string) => [...cohortsQueryKeys.all, 'byCourse', courseId] as const,
  byId: (courseId: string, cohortId: string) => [...cohortsQueryKeys.byCourse(courseId), cohortId] as const,
  contentGroups: (courseId: string) => [...cohortsQueryKeys.byCourse(courseId), 'contentGroups'] as const,
};
