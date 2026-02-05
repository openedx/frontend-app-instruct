import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDateExtensions, PaginationQueryKeys, resetDateExtension } from './api';
import { dateExtensionsQueryKeys } from './queryKeys';
import { ResetDueDateParams } from '../types';

export const useDateExtensions = (courseId: string, pagination: PaginationQueryKeys) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, pagination),
    queryFn: () => getDateExtensions(courseId, pagination),
  })
);

export const useResetDateExtensionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, params }: { courseId: string, params: ResetDueDateParams }) =>
      resetDateExtension(courseId, params),
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.byCourse(courseId), exact: false });
    },
  });
};
