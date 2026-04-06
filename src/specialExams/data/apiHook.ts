import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addAllowance, deleteAllowance, getAllowances, getAttempts, getSpecialExams } from './api';
import { specialExamsQueryKeys } from './queryKeys';
import { AddAllowanceParams, AttemptsParams, DeleteAllowanceParams } from '../types';

export const useAttempts = (courseId: string, params: AttemptsParams) => (
  useQuery({
    queryKey: specialExamsQueryKeys.attempts(courseId, params),
    queryFn: () => getAttempts(courseId, params),
    enabled: !!courseId,
  })
);

export const useAllowances = (courseId: string, params: AttemptsParams) => (
  useQuery({
    queryKey: specialExamsQueryKeys.allowances(courseId, params),
    queryFn: () => getAllowances(courseId, params),
    enabled: !!courseId,
  })
);

export const useAddAllowance = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAllowance: AddAllowanceParams) =>
      addAllowance(courseId, newAllowance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialExamsQueryKeys.allowances(courseId), exact: false });
    },
  });
};

export const useDeleteAllowance = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: DeleteAllowanceParams) => deleteAllowance(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialExamsQueryKeys.allowances(courseId), exact: false });
    },
  });
};

export const useSpecialExams = (courseId: string, examType: string) => (
  useQuery({
    queryKey: specialExamsQueryKeys.specialExams(courseId),
    queryFn: () => getSpecialExams(courseId, examType),
    enabled: !!courseId && !!examType,
  })
);
