import { appId } from '@src/constants';

export const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};
