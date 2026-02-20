import { camelCaseObject, getAuthenticatedHttpClient, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '../../data/api';
import { AddDateExtensionParams, DateExtensionQueryParams, LearnerDateExtension, ResetDueDateParams } from '../types';
import { DataList } from '@src/types';

export const getDateExtensions = async (
  courseId: string,
  params: DateExtensionQueryParams
): Promise<DataList<LearnerDateExtension>> => {
  const queryParams = new URLSearchParams({
    page: (params.page + 1).toString(),
    page_size: params.pageSize.toString(),
  });

  if (params.emailOrUsername) {
    queryParams.append('email_or_username', params.emailOrUsername);
  }

  if (params.blockId) {
    const blockId = encodeURI(params.blockId);
    queryParams.append('block_id', blockId);
  }

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/unit_extensions?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};

export const resetDateExtension = async (courseId: string, params: ResetDueDateParams) => {
  const { data } = await getAuthenticatedHttpClient().post(`${getApiBaseUrl()}/courses/${courseId}/instructor/api/reset_due_date`, params);
  return camelCaseObject(data);
};

export const addDateExtension = async (courseId: string, extensionData: AddDateExtensionParams) => {
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
