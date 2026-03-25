import { useQuery } from '@tanstack/react-query';
import { getAttempts } from './api';
import { specialExamsQueryKeys } from './queryKeys';
import { AttemptsParams } from '../types';

export const useAttempts = (courseId: string, params: AttemptsParams) => (
  useQuery({
    queryKey: specialExamsQueryKeys.attempts(courseId, params),
    queryFn: () => getAttempts(courseId, params),
    enabled: !!courseId,
  })
);
