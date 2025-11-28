import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDateExtensions, resetDateExtension, addDateExtension, getGradedSubsections, DateExtensionQueryParams } from './api';
import { dateExtensionsQueryKeys, gradedSubsectionsQueryKeys } from './queryKeys';

export const useDateExtensions = (courseId: string, params: DateExtensionQueryParams) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, params),
    queryFn: () => getDateExtensions(courseId, params),
    enabled: !!courseId, // Only run when courseId is available
  })
);

export const useResetDateExtensionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string, userId: number }) =>
      resetDateExtension(courseId, userId),
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.byCourse(courseId) });
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

export const useGradedSubsections = (courseId: string) => (
  useQuery({
    queryKey: gradedSubsectionsQueryKeys.byCourse(courseId),
    queryFn: () => getGradedSubsections(courseId),
  })
);
