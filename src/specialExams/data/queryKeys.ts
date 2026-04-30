import { appId } from '@src/constants';
import { AttemptsParams } from '../types';

export const specialExamsQueryKeys = {
  all: [appId, 'specialExams'] as const,
  byCourse: (courseId: string) => [...specialExamsQueryKeys.all, courseId] as const,
  attempts: (courseId: string, params: AttemptsParams) => [...specialExamsQueryKeys.byCourse(courseId), 'attempts', params.page, params.emailOrUsername, params.ordering] as const,
  allowances: (courseId: string, params?: AttemptsParams) => [...specialExamsQueryKeys.byCourse(courseId), 'allowances', params?.page || 1, params?.emailOrUsername || '', params?.ordering || ''] as const,
  specialExams: (courseId: string, examType: string) => [...specialExamsQueryKeys.byCourse(courseId), 'specialExams', examType] as const,
};
