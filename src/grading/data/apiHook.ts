import { useQuery } from '@tanstack/react-query';
import { getGradingConfiguration } from './api';
import { gradingQueryKeys } from './queryKeys';

export const useGradingConfiguration = (courseId: string) => (
  useQuery({
    queryKey: gradingQueryKeys.gradingConfiguration(courseId),
    queryFn: () => getGradingConfiguration(courseId),
    enabled: !!courseId,
  })
);
