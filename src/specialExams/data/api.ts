import { getAuthenticatedHttpClient, camelCaseObject, snakeCaseObject } from '@openedx/frontend-base';
import { snakeCase } from 'lodash';
import { getApiBaseUrl } from '@src/data/api';
import { DataList } from '@src/types';
import { AddAllowanceParams, Allowance, Attempt, AttemptsParams, DeleteAllowanceParams, ResetAttemptParams, ResumeAttemptParams, SpecialExam } from '@src/specialExams/types';

const getQueryParams = (params: AttemptsParams) => {
  const queryParams = new URLSearchParams({
    page: (params.page + 1).toString(),
    page_size: params.pageSize.toString(),
  });

  if (params.emailOrUsername) {
    queryParams.append('search', params.emailOrUsername);
  }

  if (params.ordering) {
    const hasNegativePrefix = params.ordering.startsWith('-');

    const orderingParam = params.ordering.split('.').map((part) => snakeCase(part)).join('.');

    queryParams.append('ordering', `${hasNegativePrefix ? '-' : ''}${orderingParam}`);
  }

  return queryParams;
};

export const getAttempts = async (courseId: string, params: AttemptsParams): Promise<DataList<Attempt>> => {
  const queryParams = getQueryParams(params);

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams/attempts?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};

export const getAllowances = async (courseId: string, params: AttemptsParams): Promise<DataList<Allowance>> => {
  const queryParams = getQueryParams(params);

  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams/allowances?${queryParams.toString()}`
  );
  return camelCaseObject(data);
};

export const addAllowance = async (courseId: string, newAllowance: AddAllowanceParams): Promise<Allowance[]> => {
  const newAllowanceSnakeCase = snakeCaseObject(newAllowance);
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams/allowances`,
    newAllowanceSnakeCase
  );
  return camelCaseObject(data);
};

export const deleteAllowance = async (courseId: string, params: DeleteAllowanceParams): Promise<void> => {
  const snakeCaseParams = snakeCaseObject(params);
  await getAuthenticatedHttpClient().delete(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams/${params.examId}/allowance`, {
      data: snakeCaseParams
    }
  );
};

export const getSpecialExams = async (courseId: string, examType: string): Promise<SpecialExam[]> => {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams`, {
      params: { exam_type: examType }
    }
  );
  return camelCaseObject(data);
};

export const resetAttempt = async (courseId: string, params: ResetAttemptParams) => {
  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/special_exams/${params.examId}/reset/${params.username}`
  );
  return camelCaseObject(data);
};

export const resumeAttempt = async (params: ResumeAttemptParams) => {
  const { userId, attemptId } = params;
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('action', 'mark_ready_to_resume');
  const { data } = await getAuthenticatedHttpClient().put(
    `${getApiBaseUrl()}/api/edx_proctoring/v1/proctored_exam/attempt/${attemptId}`,
    formData
  );
  return camelCaseObject(data);
};
