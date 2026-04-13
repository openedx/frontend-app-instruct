import { useQuery } from '@tanstack/react-query';
import { getGradingConfiguration } from '@src/grading/data/api';
import { gradingQueryKeys } from '@src/grading/data/queryKeys';

export const useGradingConfiguration = (courseId: string) => (
  useQuery({
    queryKey: gradingQueryKeys.gradingConfiguration(courseId),
    queryFn: () => getGradingConfiguration(courseId),
    enabled: !!courseId,
  })
);
