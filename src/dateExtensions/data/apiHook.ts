import { useQuery } from '@tanstack/react-query';
import { getDateExtensions } from './api';
import { dateExtensionsQueryKeys } from './queryKeys';

export const useDateExtensions = (courseId: string) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCourse(courseId),
    queryFn: () => getDateExtensions(courseId),
  })
);
