import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import {
  IssuedCertificate,
  CertificateGenerationHistory,
  RegenerateCertificatesParams,
  CertificateFilter
} from '../types';
import { DataList, PaginationQueryKeys } from '@src/types';

export const getIssuedCertificates = async (
  courseId: string,
  pagination: PaginationQueryKeys,
  search?: string,
  filter?: CertificateFilter
): Promise<DataList<IssuedCertificate>> => {
  const params = new URLSearchParams({
    page: String(pagination.page + 1),
    page_size: String(pagination.pageSize),
  });

  if (search) {
    params.append('search', search);
  }

  if (filter && filter !== 'all') {
    params.append('filter', filter);
  }

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/issued?${params.toString()}`
  );
  return camelCaseObject(data);
};

export const getCertificateGenerationHistory = async (
  courseId: string,
  pagination: PaginationQueryKeys
): Promise<DataList<CertificateGenerationHistory>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/generation_history?page=${pagination.page + 1}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};

export const regenerateCertificates = async (
  courseId: string,
  params: RegenerateCertificatesParams
) => {
  const snakeCaseData = snakeCaseObject(params);
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/regenerate`,
    snakeCaseData
  );
  return camelCaseObject(data);
};

export const getCertificateConfig = async (courseId: string): Promise<{ enabled: boolean }> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/certificates/config`
  );
  return camelCaseObject(data);
};
