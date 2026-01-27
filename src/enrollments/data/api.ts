import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { EnrollmentsResponse, EnrollmentStatusResponse } from '../types';

export interface PaginationParams {
  page: number,
  pageSize: number,
}

export const getEnrollments = async (
  courseId: string,
  pagination: PaginationParams
): Promise<EnrollmentsResponse> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/enrollments/?page=${pagination.page}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};

export const getEnrollmentStatus = async (
  courseId: string,
  userIdentifier: string
): Promise<EnrollmentStatusResponse> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/enrollments/?email_or_username=${userIdentifier}`
  );
  return camelCaseObject(data);
};
