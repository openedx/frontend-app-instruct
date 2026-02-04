import { getAuthenticatedHttpClient, camelCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';

export const getOpenResponsesData = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/ora_summary`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};
