import { useQuery } from '@tanstack/react-query';
import { getRoles, getTeamMembers } from './api';
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
