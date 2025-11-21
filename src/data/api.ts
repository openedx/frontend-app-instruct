import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';
import { DateExtensionsResponse } from '../dateExtensions/types';

const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL;

export interface PaginationQueryKeys {
  page: number,
  pageSize: number,
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
  pagination: PaginationQueryKeys
): Promise<DateExtensionsResponse> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions/?page=${pagination.page}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};

export const resetDateExtension = async (courseId, userId) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/date-extensions/${userId}/reset`);
  return camelCaseObject(data);
};

interface AddDateExtensionParams {
  student: string,
  url: string,
  due_datetime: string,
  reason: string,
}

export const addDateExtension = async (courseId, extensionData: AddDateExtensionParams) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/courses/${courseId}/instructor/api/change_due_date`, extensionData);
  return camelCaseObject(data);
};
