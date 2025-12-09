import { appId } from '../../constants';

export const cohortsQueryKeys = {
  all: [appId, 'cohorts'] as const,
  list: (courseId: string) => [...cohortsQueryKeys.all, courseId, 'list'] as const,
  enabled: (courseId: string) => ['cohortsEnabled', courseId] as const,
};
