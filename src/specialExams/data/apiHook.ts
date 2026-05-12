import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addAllowance, deleteAllowance, getAllowances, getAttempts, getSpecialExams, resetAttempt } from '@src/specialExams/data/api';
import { specialExamsQueryKeys } from '@src/specialExams/data/queryKeys';
import { AddAllowanceParams, AttemptsParams, DeleteAllowanceParams, ResetAttemptParams } from '@src/specialExams/types';

export const useAttempts = (courseId: string, params: AttemptsParams, enabled = true) => (
  useQuery({
    queryKey: specialExamsQueryKeys.attempts(courseId, params),
    queryFn: () => getAttempts(courseId, params),
    enabled: !!courseId && enabled,
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
    queryKey: specialExamsQueryKeys.specialExams(courseId, examType),
    queryFn: () => getSpecialExams(courseId, examType),
    enabled: !!courseId && !!examType,
  })
);

export const useResetAttempt = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ResetAttemptParams) => resetAttempt(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialExamsQueryKeys.attempts(courseId), exact: false });
    },
  });
};
