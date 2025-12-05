import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';
import { DateExtensionsResponse } from '../dateExtensions/types';

const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL;

export interface PaginationQueryKeys {
  page: number,
  pageSize: number,
}

export interface DateExtensionQueryParams extends PaginationQueryKeys {
  search?: string,
  gradedSubsection?: string,
}

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export const getCourseInfo = async (courseId) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}`);
  return camelCaseObject(data);
};

export const getDateExtensions = async (
  courseId: string,
  params: DateExtensionQueryParams
): Promise<DateExtensionsResponse> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    page_size: params.pageSize.toString(),
  });

  // Add optional search parameter
  if (params.search) {
    queryParams.append('search', params.search);
  }

  // Add optional graded subsection filter
  if (params.gradedSubsection) {
    queryParams.append('graded_subsection', params.gradedSubsection);
  }

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions/?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};

export const resetDateExtension = async (courseId, userId) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/date-extensions/${userId}/reset`);
  return camelCaseObject(data);
};

interface AddDateExtensionParams {
  email_or_username: string,
  block_id: string,
  due_datetime: string,
  reason: string,
}

export const addDateExtension = async (courseId, extensionData: AddDateExtensionParams) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/change_due_date`, extensionData);
  return camelCaseObject(data);
};

export const getGradedSubsections = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/graded_subsections/`
  );
  return camelCaseObject(data);
};
