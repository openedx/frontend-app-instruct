import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addTeamMember, getRoles, getTeamMembers } from './api';
import { CourseTeamMemberQueryParams } from '../types';
import { courseTeamQueryKeys } from './queryKeys';

export const useTeamMembers = (courseId: string, params: CourseTeamMemberQueryParams) => (
  useQuery({
    queryKey: courseTeamQueryKeys.byCoursePaginated(courseId, params),
    queryFn: () => getTeamMembers(courseId, params),
    enabled: !!courseId,
  })
);

export const useRoles = (courseId: string) => (
  useQuery({
    queryKey: courseTeamQueryKeys.roles(courseId),
    queryFn: () => getRoles(courseId),
    enabled: !!courseId,
  })
);

export const useAddTeamMember = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: ({ users, role }: { users: string[], role: string }) => addTeamMember(courseId, users, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseTeamQueryKeys.byCourse(courseId) });
    }
  })
  );
};
