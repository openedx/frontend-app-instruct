import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { DateExtensionsResponse, ResetDueDateParams } from '../types';

export interface PaginationQueryKeys {
  page: number,
  pageSize: number,
}

export const getDateExtensions = async (
  courseId: string,
  pagination: PaginationQueryKeys
): Promise<DateExtensionsResponse> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions?page=${pagination.page + 1}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};

export const resetDateExtension = async (courseId: string, params: ResetDueDateParams) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/courses/${courseId}/instructor/api/reset_due_date`, params);
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
