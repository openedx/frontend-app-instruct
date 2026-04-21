import { camelCaseObject, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { getApiBaseUrl } from '@src/data/api';
import { RescoreParams, GradingParams, ScoreParams } from '../types';

export const getGradingConfiguration = async (courseId: string) => {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/grading-config`);
  return camelCaseObject(data);
};

export const postResetAttempts = async (
  courseId: string,
  params: GradingParams
): Promise<any> => {
  const queryParams = new URLSearchParams();

  if (params.learner) {
    queryParams.append('learner', params.learner);
  }

  const problem = encodeURI(params.problem);

  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/${problem}/grading/attempts/reset`, queryParams
  );
  return camelCaseObject(data);
};

export const postRescoreSubmission = async (
  courseId: string,
  params: RescoreParams
): Promise<any> => {
  const queryParams = new URLSearchParams({
    only_if_higher: params.onlyIfHigher.toString(),
  });

  if (params.learner) {
    queryParams.append('learner', params.learner);
  }

  const problem = encodeURI(params.problem);

  const { data } = await getAuthenticatedHttpClient().post(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/${problem}/grading/scores/rescore`, queryParams
  );
  return camelCaseObject(data);
};

export const deleteState = async (
  courseId: string,
  params: GradingParams
): Promise<any> => {
  const queryParams = new URLSearchParams();

  if (params.learner) {
    queryParams.append('learner', params.learner);
  }

  const problem = encodeURI(params.problem);

  const { data } = await getAuthenticatedHttpClient().delete(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/${problem}/grading/state`, {
      data: queryParams,
    }
  );
  return camelCaseObject(data);
};

export const changeScore = async (
  courseId: string,
  params: ScoreParams
): Promise<any> => {
  const queryParams = new URLSearchParams({
    new_score: params.newScore.toString(),
  });

  if (params.learner) {
    queryParams.append('learner', params.learner);
  }

  const problem = encodeURI(params.problem);

  const { data } = await getAuthenticatedHttpClient().put(
    `${getApiBaseUrl()}/api/instructor/v2/courses/${courseId}/${problem}/grading/scores`, queryParams
  );
  return camelCaseObject(data);
};
