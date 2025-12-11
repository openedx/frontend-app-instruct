import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';

export const getCohortStatus = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/settings/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const getCohorts = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/courses/${courseId}/cohorts/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const toggleCohorts = async (courseId: string, isCohorted: boolean) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/settings/${courseId}`;
  const { data } = await getAuthenticatedHttpClient().put(url, { is_cohorted: isCohorted });
  return camelCaseObject(data);
};

export const createCohort = async (courseId: string, cohortDetails: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/cohorts/`;
  const { data } = await getAuthenticatedHttpClient().post(url, {
    name: cohortDetails,
  });
  return camelCaseObject(data);
};

export const getContentGroups = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/content_groups/`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};
