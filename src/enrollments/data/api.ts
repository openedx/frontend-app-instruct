import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { EnrollmentsParams, EnrollmentStatusResponse, Learner } from '../types';
import { DataList } from '@src/types';

export const getEnrollments = async (
  courseId: string,
  params: EnrollmentsParams
): Promise<DataList<Learner>> => {
  const queryParams = new URLSearchParams({
    page: (params.page + 1).toString(),
    page_size: params.pageSize.toString(),
  });

  if (params.emailOrUsername) {
    queryParams.append('search', params.emailOrUsername);
  }

  if (params.isBetaTester) {
    queryParams.append('is_beta_tester', params.isBetaTester);
  }

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/enrollments?${queryParams.toString()}`
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
