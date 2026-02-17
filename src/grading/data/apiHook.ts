import { useQuery } from '@tanstack/react-query';
import { getGradingConfiguration, getLearnerGrading, getProblemDetails } from './api';
import { gradingQueryKeys } from './queryKeys';

export const useGradingConfiguration = (courseId: string) => (
  useQuery({
    queryKey: gradingQueryKeys.gradingConfiguration(courseId),
    queryFn: () => getGradingConfiguration(courseId),
    enabled: !!courseId,
  })
);

export const useLearnerGrading = (courseId: string, emailOrUsername: string) => (
  useQuery({
    queryKey: gradingQueryKeys.learnerGrading(courseId, emailOrUsername),
    queryFn: () => getLearnerGrading(courseId, emailOrUsername),
    enabled: !!courseId && !!emailOrUsername,
  }));

export const useProblemDetails = (courseId: string, blockId: string, emailOrUsername: string) => (
  useQuery({
    queryKey: gradingQueryKeys.problemDetails(courseId, blockId, emailOrUsername),
    queryFn: () => getProblemDetails(courseId, blockId, emailOrUsername),
    enabled: !!courseId && !!blockId,
  }));
