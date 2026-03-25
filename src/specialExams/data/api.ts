import { getAuthenticatedHttpClient, camelCaseObject } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { DataList } from '@src/types';
import { Attempt, AttemptsParams } from '../types';

export const getAttempts = async (courseId: string, params: AttemptsParams): Promise<DataList<Attempt>> => {
  const queryParams = new URLSearchParams({
    page: (params.page + 1).toString(),
    page_size: params.pageSize.toString(),
  });

  if (params.emailOrUsername) {
    queryParams.append('search', params.emailOrUsername);
  }

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams/attempts?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};
