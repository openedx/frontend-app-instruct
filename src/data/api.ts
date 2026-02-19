import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '@src/constants';

export const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL;

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

/**
 * Fetch pending instructor tasks for a course.
 * @param {string} courseId
 * @returns {Promise<Array>}
 */
export const fetchPendingTasks = async (courseId: string) => {
  const response = await getAuthenticatedHttpClient().post<{ results: Record<string, any>[] }>(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/list_instructor_tasks`
  );
  return response.data?.tasks?.map(camelCaseObject);
};
