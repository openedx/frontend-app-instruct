import { useMutation, useQuery } from '@tanstack/react-query';
import { getCourseInfo, disableCohorts, enableCohorts, getCohorts } from './api';
import { appId } from '../constants';

const courseInfoQueryKeys = {
  all: [appId, 'courseInfo'] as const,
  byCourse: (courseId: string) => [appId, 'courseInfo', courseId] as const,
};

export const cohortsQueryKeys = {
  all: [appId, 'cohorts'] as const,
  list: (courseId: string) => [...cohortsQueryKeys.all, 'list', courseId] as const,
};

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);

export const useCohorts = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.list(courseId),
    queryFn: () => getCohorts(courseId),
  })
);

export const useEnableCohorts = (courseId: string) => (
  useMutation({
    mutationFn: () => enableCohorts(courseId),
  })
);

export const useDisableCohorts = (courseId: string) => (
  useMutation({
    mutationFn: () => disableCohorts(courseId),
  })
);
