import { useQuery } from '@tanstack/react-query';
import { getDetailAssessmentsData, getOpenResponsesData } from './api';
import { openResponsesQueryKeys } from './queryKeys';

export const useOpenResponsesData = (courseId: string) => (
  useQuery({
    queryKey: openResponsesQueryKeys.byCourse(courseId),
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
