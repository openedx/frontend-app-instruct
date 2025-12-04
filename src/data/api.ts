import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

const getApiBaseUrl = () => getAppConfig(appId).CMS_BASE_URL;

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

export const getCohortStatus = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/settings/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const getCohorts = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/courses/${courseId}/cohorts/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const toggleCohorts = async (courseId: string, isCohorted: boolean) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/settings/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().put(url, { is_cohorted: isCohorted });
  return camelCaseObject(data);
};
