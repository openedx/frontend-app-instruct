// TODO: remove next eslint disable when the variables get used

import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

export const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL as string;

export const fetchPendingTasks = async (courseId: string) => {
  const httpClient = getAuthenticatedHttpClient(appId);
  const response = await httpClient.post<{ results: Record<string, any>[] }>(
    `${getApiBaseUrl()}/courses/${courseId}/instructor/api/list_instructor_tasks`
  );
  return response.data?.tasks?.map(camelCaseObject);
};
