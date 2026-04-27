import { PaginationParams } from '@src/types';

export interface Attempt {
  username: string,
  examName: string,
  timeLimit: number,
  type: string,
  startedAt: string,
  completedAt: string,
  status: string,
}

export interface AttemptsParams extends PaginationParams {
  emailOrUsername: string,
}
