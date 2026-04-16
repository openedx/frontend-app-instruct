import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addTeamMember, getRoles, getTeamMembers } from '@src/courseTeam/data/api';
import { courseTeamQueryKeys } from '@src/courseTeam/data/queryKeys';
import { CourseTeamMemberQueryParams } from '@src/courseTeam/types';

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
    mutationFn: ({ identifiers, role }: { identifiers: string[], role: string }) => addTeamMember(courseId, identifiers, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseTeamQueryKeys.byCourse(courseId) });
    }
  })
  );
};
