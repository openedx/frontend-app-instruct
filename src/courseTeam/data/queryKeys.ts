import { appId } from '@src/constants';
import { CourseTeamMemberQueryParams } from '@src/courseTeam/types';

export const courseTeamQueryKeys = {
  all: [appId, 'courseTeam'] as const,
  byCourse: (courseId: string) => [...courseTeamQueryKeys.all, courseId] as const,
  byCoursePaginated: (
    courseId: string,
    params: CourseTeamMemberQueryParams
  ) => [
    ...courseTeamQueryKeys.byCourse(courseId),
    params.page,
    params.pageSize,
    params.emailOrUsername || '',
    params.role || ''
  ] as const,
  roles: (courseId: string, editableRoles: boolean) => [...courseTeamQueryKeys.byCourse(courseId), 'roles', editableRoles] as const,
};
