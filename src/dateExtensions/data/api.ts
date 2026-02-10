import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { AddDateExtensionParams, LearnerDateExtension, ResetDueDateParams } from '../types';
import { DataList, PaginationQueryKeys } from '@src/types';

export const getDateExtensions = async (
  courseId: string,
  pagination: PaginationQueryKeys
): Promise<DataList<LearnerDateExtension>> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions?page=${pagination.page + 1}&page_size=${pagination.pageSize}`
  );
  return camelCaseObject(data);
};

export const resetDateExtension = async (courseId: string, params: ResetDueDateParams) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/courses/${courseId}/instructor/api/reset_due_date`, params);
  return camelCaseObject(data);
};

export const addDateExtension = async (courseId, extensionData: AddDateExtensionParams) => {
  const snakeCaseData = snakeCaseObject(extensionData);
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/change_due_date`, snakeCaseData);
  return camelCaseObject(data);
};

export const getGradedSubsections = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/graded_subsections`
  );
  return camelCaseObject(data);
};
