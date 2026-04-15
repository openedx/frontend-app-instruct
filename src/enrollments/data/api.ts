import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { EnrollmentsParams, EnrollmentStatusResponse, EnrolledLearner, UpdateEnrollmentsParams, UpdateBetaTestersParams, UpdateEnrollmentsResponse, UpdateBetaTestersResponse } from '@src/enrollments/types';
import { DataList } from '@src/types';

export const getEnrollments = async (
  courseId: string,
  params: EnrollmentsParams
): Promise<DataList<EnrolledLearner>> => {
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

export const updateEnrollments = async (
  courseId: string,
  params: UpdateEnrollmentsParams
): Promise<UpdateEnrollmentsResponse> => {
  const snakeCaseParams = snakeCaseObject(params);
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/enrollments/modify`,
    snakeCaseParams
  );
  return camelCaseObject(data);
};

export const updateBetaTesters = async (
  courseId: string,
  params: UpdateBetaTestersParams
): Promise<UpdateBetaTestersResponse> => {
  const snakeCaseParams = snakeCaseObject(params);
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/beta_testers/modify`,
    snakeCaseParams
  );
  return camelCaseObject(data);
};
