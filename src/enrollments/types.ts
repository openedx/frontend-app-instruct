export interface EnrollmentStatusResponse {
  enrollmentStatus: string,
}

export interface Learner {
  username: string,
  fullName: string,
  email: string,
  mode: string,
  isBetaTester: boolean,
};

export interface EnrollmentsResponse {
  count: number,
  enrollments: Learner[],
}
