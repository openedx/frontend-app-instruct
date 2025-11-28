import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseInfo, getDateExtensions, resetDateExtension, DateExtensionQueryParams, addDateExtension, getGradedSubsections } from './api';
import { appId } from '../constants';

const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [...dateExtensionsQueryKeys.all, courseId] as const,
  byCoursePaginated: (courseId: string, params: DateExtensionQueryParams) => [
    ...dateExtensionsQueryKeys.byCourse(courseId),
    params.page,
    params.search ?? '',
    params.gradedSubsection ?? ''
  ] as const,
};

const gradedSubsectionsQueryKeys = {
  all: [appId, 'gradedSubsections'] as const,
  byCourse: (courseId: string) => [...gradedSubsectionsQueryKeys.all, courseId] as const,
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);

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
