import { Learner, PaginationParams } from '@src/types';

export interface EnrollmentStatusResponse {
  enrollmentStatus: string,
}

export interface EnrolledLearner extends Learner {
  mode: string,
  isBetaTester: boolean,
}

export interface EnrollmentsParams extends PaginationParams {
  emailOrUsername: string,
  isBetaTester: string,
}
