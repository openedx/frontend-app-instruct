import { appId } from '@src/constants';
import { AttemptsParams } from '../types';

export const specialExamsQueryKeys = {
  all: [appId, 'specialExams'] as const,
  attempts: (courseId: string, params: AttemptsParams) => [...specialExamsQueryKeys.all, 'attempts', courseId, params.page, params.emailOrUsername] as const,
};
