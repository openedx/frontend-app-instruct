import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { DateExtensionsResponse } from '../types';

export interface PaginationQueryKeys {
  page: number,
  pageSize: number,
}

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
