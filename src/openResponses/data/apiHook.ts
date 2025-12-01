import { useQuery } from '@tanstack/react-query';
import { getDetailAssessmentsData, getOpenResponsesData } from '@src/openResponses/data/api';
import { openResponsesQueryKeys } from '@src/openResponses/data/queryKeys';

export const useOpenResponsesData = (courseId: string) => (
  useQuery({
    queryKey: openResponsesQueryKeys.summary(courseId),
    queryFn: () => getOpenResponsesData(courseId),
    enabled: !!courseId,
  })
);

export const useDetailAssessmentsData = (courseId: string, params: Record<string, string | number | boolean> = {}) => (
  useQuery({
    queryKey: openResponsesQueryKeys.list(courseId, params),
    queryFn: () => getDetailAssessmentsData(courseId, params),
    enabled: !!courseId,
  })
);
