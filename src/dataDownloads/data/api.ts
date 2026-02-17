import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';

export const getGeneratedReports = async (courseId) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/reports`);
  return camelCaseObject(data);
};

export const generateReportLink = async (courseId, reportType, problemLocation?: string) => {
  const payload = problemLocation ? { problem_location: problemLocation } : {};
  const { data } = await getAuthenticatedHttpClient()
    .post(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/reports/${reportType}/generate`, payload);
  return camelCaseObject(data);
};
