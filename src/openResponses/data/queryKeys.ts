import { appId } from '@src/constants';

export const openResponsesQueryKeys = {
  all: [appId, 'openResponses'],
  byCourse: (courseId: string) => [...openResponsesQueryKeys.all, courseId],
  list: (courseId: string, params: Record<string, string | number | boolean> = {}) => [...openResponsesQueryKeys.byCourse(courseId), 'list', ...Object.entries(params).flat()],
  summary: (courseId: string) => [...openResponsesQueryKeys.byCourse(courseId), 'summary'],
};
