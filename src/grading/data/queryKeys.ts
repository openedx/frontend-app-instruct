import { appId } from '@src/constants';

export const gradingQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...gradingQueryKeys.all, courseId] as const,
  gradingConfiguration: (courseId: string) => [...gradingQueryKeys.byCourse(courseId), 'gradingConfiguration'] as const,
};
