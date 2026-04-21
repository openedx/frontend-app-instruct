import { useMutation, useQuery } from '@tanstack/react-query';
import { changeScore, deleteState, getGradingConfiguration, postRescoreSubmission, postResetAttempts } from '@src/grading/data/api';
import { gradingQueryKeys } from '@src/grading/data/queryKeys';
import { GradingParams, RescoreParams, ScoreParams } from '@src/grading/types';

export const useGradingConfiguration = (courseId: string) => (
  useQuery({
    queryKey: gradingQueryKeys.gradingConfiguration(courseId),
    queryFn: () => getGradingConfiguration(courseId),
    enabled: !!courseId,
  })
);

export const useResetAttempts = (courseId: string) => {
  return useMutation({
    mutationFn: (params: GradingParams) =>
      postResetAttempts(courseId, params),
  });
};

export const useRescoreSubmission = (courseId: string) => {
  return useMutation({
    mutationFn: (params: RescoreParams) =>
      postRescoreSubmission(courseId, params),
  });
};

export const useDeleteHistory = (courseId: string) => {
  return useMutation({
    mutationFn: (params: GradingParams) =>
      deleteState(courseId, params),
  });
};

export const useChangeScore = (courseId: string) => {
  return useMutation({
    mutationFn: (params: ScoreParams) =>
      changeScore(courseId, params),
  });
};
