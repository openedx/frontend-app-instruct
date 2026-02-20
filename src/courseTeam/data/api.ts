import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { DataList } from '@src/types';
import { CourseTeamMember, CourseTeamMemberQueryParams } from '../types';

export const getTeamMembers = async (
  courseId: string,
  params: CourseTeamMemberQueryParams
): Promise<DataList<CourseTeamMember>> => {
  const queryParams = new URLSearchParams({
    page: (params.page + 1).toString(),
    page_size: params.pageSize.toString(),
  });

  if (params.emailOrUsername) {
    queryParams.append('email_or_username', params.emailOrUsername);
  }

  if (params.role) {
    queryParams.append('role', params.role);
  }

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team_members?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};

export const getRoles = async (courseId: string): Promise<string[]> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team_roles`
  );
  return data.roles;
};
