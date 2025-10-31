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
  // TODO: Validate if url is correct once the new API endpoint is available
    .get(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}`);
  return camelCaseObject(data);
};
