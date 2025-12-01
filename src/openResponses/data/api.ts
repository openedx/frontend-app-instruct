import { getAuthenticatedHttpClient, camelCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';

export const getOpenResponsesData = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/ora_summary`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const getDetailAssessmentsData = async (
  courseId: string,
  params: Record<string, string | number | boolean> = {},
) => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/open-responses/assessments`;
  const { data } = await getAuthenticatedHttpClient().get(url, { params });
  return camelCaseObject(data);
};
