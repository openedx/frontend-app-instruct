import { appId } from '../constants';

export const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

export const pendingTasksQueryKey = {
  all: [appId, 'pendingTasks'] as const,
  byCourse: (courseId: string) => [appId, 'pendingTasks', courseId] as const,
};
