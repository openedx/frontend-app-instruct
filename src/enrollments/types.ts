import { PaginationParams } from '@src/types';

export interface EnrollmentStatusResponse {
  enrollmentStatus: string,
}

export interface Learner {
  username: string,
  fullName: string,
  email: string,
  mode: string,
  isBetaTester: boolean,
}

export interface EnrollmentsParams extends PaginationParams {
  emailOrUsername: string,
  isBetaTester: string,
}
