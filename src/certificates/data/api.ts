import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import type {
  CertificateQueryParams,
  CertificateResponse,
  GrantExceptionRequest,
  InstructorTasksResponse,
  InvalidateCertificateRequest,
  PaginationParams,
  RemoveExceptionRequest,
  RemoveInvalidationRequest,
} from '../types';

export const getIssuedCertificates = async (
  courseId: string,
  params: CertificateQueryParams,
): Promise<CertificateResponse> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/get_issued_certificates/`,
    {
      params: {
        page: params.page + 1,
        page_size: params.pageSize,
        filter: params.filter,
        search: params.search,
      },
    },
  );
  return camelCaseObject(data);
};

export const getInstructorTasks = async (
  courseId: string,
  params: PaginationParams,
): Promise<InstructorTasksResponse> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/instructor_tasks`,
    {
      params: {
        page: params.page + 1,
        page_size: params.pageSize,
      },
    },
  );
  return camelCaseObject(data);
};

export const grantBulkExceptions = async (
  courseId: string,
  request: GrantExceptionRequest,
): Promise<void> => {
  await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/generate_bulk_certificate_exceptions`,
    {
      learners: request.learners,
      notes: request.notes,
    },
  );
};

export const invalidateCertificate = async (
  courseId: string,
  request: InvalidateCertificateRequest,
): Promise<void> => {
  await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/certificate_invalidation_view/`,
    {
      learners: request.learners,
      notes: request.notes,
    },
  );
};

export const removeException = async (
  courseId: string,
  request: RemoveExceptionRequest,
): Promise<void> => {
  await getAuthenticatedHttpClient().delete(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/certificate_exception_view/`,
    {
      data: {
        username: request.username,
      },
    },
  );
};

export const removeInvalidation = async (
  courseId: string,
  request: RemoveInvalidationRequest,
): Promise<void> => {
  await getAuthenticatedHttpClient().delete(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/certificate_invalidation_view/`,
    {
      data: {
        username: request.username,
      },
    },
  );
};

export const toggleCertificateGeneration = async (
  courseId: string,
  enable: boolean,
): Promise<void> => {
  await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/enable_certificate_generation`,
    {
      enabled: enable,
    },
  );
};
