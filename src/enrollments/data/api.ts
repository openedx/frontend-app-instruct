import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { EnrollmentStatusResponse, Learner } from '../types';
import { DataList } from '@src/types';

export interface PaginationParams {
  page: number,
  pageSize: number,
}

export const getEnrollments = async (
  courseId: string,
  pagination: PaginationParams
): Promise<DataList<Learner>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/enrollments?page=${pagination.page + 1}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};

export const getEnrollmentStatus = async (
  courseId: string,
  userIdentifier: string
): Promise<EnrollmentStatusResponse> => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/get_student_enrollment_status`, {
      unique_student_identifier: userIdentifier,
    }
  );
  return camelCaseObject(data);
};
