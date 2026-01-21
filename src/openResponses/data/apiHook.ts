import { useQuery } from '@tanstack/react-query';
import { getOpenResponsesData } from './api';
import { openResponsesQueryKeys } from './queryKeys';

export const useOpenResponsesData = (courseId: string) => (
  useQuery({
    queryKey: openResponsesQueryKeys.summary(courseId),
    queryFn: () => getOpenResponsesData(courseId),
    enabled: !!courseId,
  })
);
