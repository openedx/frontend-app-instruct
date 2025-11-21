import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDateExtensions, PaginationQueryKeys, resetDateExtension, addDateExtension } from './api';
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
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.byCourse(courseId), exact: false });
    },
  });
};

export const useAddDateExtensionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, extensionData }: { courseId: string, extensionData: any }) =>
      addDateExtension(courseId, extensionData),
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.byCourse(courseId) });
    },
  });
};
