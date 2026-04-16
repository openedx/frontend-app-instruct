import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { DataList } from '@src/types';
import { AddTeamMembersResponse, CourseTeamMember, CourseTeamMemberQueryParams, Role } from '@src/courseTeam/types';

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
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};

export const getRoles = async (courseId: string): Promise<Omit<DataList<Role>, 'numPages' | 'count'>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team/roles`
  );
  return camelCaseObject(data);
};

export const addTeamMember = async (courseId: string, identifiers: string[], role: string): Promise<AddTeamMembersResponse> => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team`,
    { identifiers, role }
  );
  return camelCaseObject(data);
};
