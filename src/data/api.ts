import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL as string;

export const getOpenResponsesData = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/open-responses`;
  const { data } = await getAuthenticatedHttpClient(appId).get(url);
  return camelCaseObject(data);
};

export const getDetailAssessmentsData = async (
  courseId: string,
  params: Record<string, string | number | boolean> = {},
) => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/open-responses/assessments`;
  const { data } = await getAuthenticatedHttpClient(appId).get(url, { params });
  return camelCaseObject(data);
};
