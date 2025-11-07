import { useMutation, useQuery } from '@tanstack/react-query';
import { getDateExtensions, PaginationQueryKeys, resetDateExtension } from './api';
import { dateExtensionsQueryKeys } from './queryKeys';

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, pagination),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);

export const useResetDateExtensionMutation = () => {
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string, userId: number }) =>
      resetDateExtension(courseId, userId),
  });
};
