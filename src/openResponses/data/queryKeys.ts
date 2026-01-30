import { appId } from '@src/constants';

export const openResponsesQueryKeys = {
  all: [appId, 'openResponses'],
  byCourse: (courseId: string) => [...openResponsesQueryKeys.all, courseId],
  summary: (courseId: string) => [...openResponsesQueryKeys.byCourse(courseId), 'summary'],
};
