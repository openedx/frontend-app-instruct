import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '@src/constants';
import { CourseInfoResponse } from '@src/courseInfo/types';

export const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL;

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export const getCourseInfo = async (courseId: string): Promise<CourseInfoResponse> => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}`);
  return camelCaseObject(data);
};
