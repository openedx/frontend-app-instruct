import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';

export const getDateExtensions = async (courseId) => {
  const { data } = await getAuthenticatedHttpClient().get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions`);
  return camelCaseObject(data);
};
