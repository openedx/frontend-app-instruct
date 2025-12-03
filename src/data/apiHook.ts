import { useMutation } from '@tanstack/react-query';
import { fetchPendingTasks } from './api';
import { appId } from '../constants';

export const queryKeys = {
  pendingTasks: (courseId: string) => [appId, 'pendingTasks', courseId],
};

export const usePendingTasks = (courseId: string) => {
  return useMutation({
    mutationKey: queryKeys.pendingTasks(courseId),
    mutationFn: async () => fetchPendingTasks(courseId),
  });
};
