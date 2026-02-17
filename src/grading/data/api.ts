import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';

export const getGradingConfiguration = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/grading_configuration`);
  return camelCaseObject(data);
};

export const getLearnerGrading = async (courseId: string, emailOrUsername: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/learners/${emailOrUsername}`);
  return camelCaseObject(data);
};

export const getProblemDetails = async (courseId: string, blockId: string, emailOrUsername?: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/problems/${blockId}`, {
      params: { email_or_username: emailOrUsername },
    });
  return camelCaseObject(data);
};
