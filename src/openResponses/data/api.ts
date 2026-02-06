import { getAuthenticatedHttpClient, camelCaseObject, snakeCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { ORARecord } from '../types';
import { ListData } from '@src/types';

export const getOpenResponsesData = async (courseId: string) => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/ora_summary`;
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
};

export const getDetailAssessmentsData = async (
  courseId: string,
  params: Record<string, string | number | boolean> = {},
): Promise<ListData<ORARecord>> => {
  const url = `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/ora`;
  const snakeCaseParams = snakeCaseObject(params);
  const { data } = await getAuthenticatedHttpClient().get(url, { params: { ...snakeCaseParams, page: (params.page as number) + 1 } });
  return camelCaseObject(data);
};
