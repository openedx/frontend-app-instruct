import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';

export const getGradingConfiguration = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient().get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/grading_configuration`
  );
  return camelCaseObject(data);
};
