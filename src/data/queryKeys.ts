import { appId } from '@src/constants';

export const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

export const pendingTasksQueryKey = {
  all: [appId, 'pendingTasks'] as const,
  byCourse: (courseId: string) => [appId, 'pendingTasks', courseId] as const,
};

export const learnerQueryKeys = {
  all: [appId, 'learner'] as const,
  byCourseAndLearner: (courseId: string, emailOrUsername: string) => [appId, 'learner', courseId, emailOrUsername] as const,
};

export const problemQueryKeys = {
  all: [appId, 'problemDetails'] as const,
  byCourseAndLearner: (courseId: string, blockId: string, emailOrUsername: string) => [appId, 'problemDetails', courseId, blockId, emailOrUsername] as const,
};
