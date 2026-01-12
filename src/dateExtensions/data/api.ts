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
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions?page=${pagination.page + 1}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};
