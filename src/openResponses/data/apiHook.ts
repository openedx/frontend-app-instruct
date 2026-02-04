import { useQuery } from '@tanstack/react-query';
import { getOpenResponsesData } from '../../openResponses/data/api';
import { openResponsesQueryKeys } from '../../openResponses/data/queryKeys';

export const useOpenResponsesData = (courseId: string) => (
  useQuery({
    queryKey: openResponsesQueryKeys.summary(courseId),
    queryFn: () => getOpenResponsesData(courseId),
    enabled: !!courseId,
  })
);
