import { useQuery } from '@tanstack/react-query';
import { getDateExtensions, PaginationQueryKeys } from './api';
import { dateExtensionsQueryKeys } from './queryKeys';

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCourse(courseId),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);
