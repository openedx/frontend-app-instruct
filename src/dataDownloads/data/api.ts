import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';

export const getGeneratedReports = async (courseId) => {
  const { data } = await getAuthenticatedHttpClient()
  // TODO: Validate if url is correct once the new API endpoint is available
    .get(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}`);
  return camelCaseObject(data);
};

export const generateReportLink = async (courseId, reportType) => {
  const { data } = await getAuthenticatedHttpClient()
  // TODO: Validate if url is correct once the new API endpoint is available
    .post(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/reports/${reportType}/generate/`);
  return camelCaseObject(data);
};

export const triggerReportGeneration = async (courseId, reportType) => {
  const { data } = await getAuthenticatedHttpClient()
  // TODO: Validate if url is correct once the new API endpoint is available
    .post(`${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/reports/${reportType}/generate/`);
  return camelCaseObject(data);
};
