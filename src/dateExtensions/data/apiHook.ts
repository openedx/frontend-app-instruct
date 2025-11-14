import { useQuery } from '@tanstack/react-query';
import { getDateExtensions, PaginationQueryKeys } from './api';
import { dateExtensionsQueryKeys } from './queryKeys';

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, pagination),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);
