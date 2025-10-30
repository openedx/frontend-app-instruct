import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL;

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export const getCourseInfo = async (courseId) => {
  console.log(`Fetching course info for courseId: ${courseId}`);
  const { data } = await getAuthenticatedHttpClient()
  // TODO: Update to use new API endpoint when available
    .get(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}`);
  return camelCaseObject(data);
};
