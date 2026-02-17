import { appId } from '@src/constants';

export const gradingQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...gradingQueryKeys.all, courseId] as const,
  gradingConfiguration: (courseId: string) => [...gradingQueryKeys.byCourse(courseId), 'gradingConfiguration'] as const,
  learnerGrading: (courseId: string, emailOrUsername: string) => [...gradingQueryKeys.byCourse(courseId), 'learnerGrading', emailOrUsername] as const,
  problemDetails: (courseId: string, blockId: string, emailOrUsername: string) => [...gradingQueryKeys.byCourse(courseId), 'problemDetails', blockId, emailOrUsername] as const,
};
