import { appId } from '../../constants';
import { CourseTeamMemberQueryParams } from '../types';

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
  roles: (courseId: string) => [...courseTeamQueryKeys.byCourse(courseId), 'roles'] as const,
};
