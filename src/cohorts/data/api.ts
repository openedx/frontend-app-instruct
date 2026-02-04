import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { CohortData, BasicCohortData } from '../../cohorts/types';

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

export const createCohort = async (courseId: string, cohortDetails: BasicCohortData) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/courses/${courseId}/cohorts/`;
  const cohortDetailsSnakeCase = snakeCaseObject(cohortDetails);
  const { data } = await getAuthenticatedHttpClient().post(url, cohortDetailsSnakeCase);
  return camelCaseObject(data);
};

export const getContentGroups = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v1/courses/${courseId}/group_configurations`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const patchCohort = async (courseId: string, cohortId: number, cohortDetails: CohortData) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/courses/${courseId}/cohorts/${cohortId}`;
  const cohortDetailsSnakeCase = snakeCaseObject(cohortDetails);
  const { data } = await getAuthenticatedHttpClient().patch(url, cohortDetailsSnakeCase);
  return camelCaseObject(data);
};

export const addLearnersToCohort = async (courseId: string, cohortId: number, users: string[]) => {
  const url = `${getApiBaseUrl()}/api/cohorts/v1/courses/${courseId}/cohorts/${cohortId}/users/`;
  const { data } = await getAuthenticatedHttpClient().post(url, { users });
  return camelCaseObject(data);
};
