import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL;

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export const getCourseInfo = async (courseId) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}`);
  return camelCaseObject(data);
};

export const getCohorts = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/cohorts/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
};

export const enableCohorts = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/cohorts/enable/`;
  const { data } = await getAuthenticatedHttpClient().post(url);
  return camelCaseObject(data);
};

export const disableCohorts = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/cohorts/disable/`;
  const { data } = await getAuthenticatedHttpClient().post(url);
  return camelCaseObject(data);
};
