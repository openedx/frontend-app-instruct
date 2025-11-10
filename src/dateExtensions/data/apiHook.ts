import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDateExtensions, PaginationQueryKeys, resetDateExtension } from './api';
import { dateExtensionsQueryKeys } from './queryKeys';

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, pagination),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);

export const useResetDateExtensionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string, userId: number }) =>
      resetDateExtension(courseId, userId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.all });
    },
  });
};
