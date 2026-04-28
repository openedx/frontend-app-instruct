import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { DataList } from '@src/types';
import {
  TeamMembersResponse,
  CourseTeamMember,
  CourseTeamMemberQueryParams,
  Role,
  AddTeamMemberParams,
} from '@src/courseTeam/types';

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

export const getRoles = async (courseId: string, editableRoles = false): Promise<Omit<DataList<Role>, 'numPages' | 'count'>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team/roles${editableRoles ? '?editable=true' : ''}`
  );
  return camelCaseObject(data);
};

export const addTeamMember = async (courseId: string, params: AddTeamMemberParams): Promise<TeamMembersResponse> => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team`,
    params
  );
  return camelCaseObject(data);
};

export const removeTeamMember = async (courseId: string, identifier: string, roles: string[]): Promise<TeamMembersResponse> => {
  const { data } = await getAuthenticatedHttpClient().delete(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/team/${identifier}`,
    { data: { roles } }
  );
  return camelCaseObject(data);
};
