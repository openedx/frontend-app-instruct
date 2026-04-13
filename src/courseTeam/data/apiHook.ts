import { useQuery } from '@tanstack/react-query';
import { getRoles, getTeamMembers } from '@src/courseTeam/data/api';
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
