export interface EnrollmentsResponse {
  count: number,
  results: Learner[],
}

export interface EnrollmentStatusResponse {
  status: string,
}

export interface Learner {
  id: string,
  username: string,
  fullName: string,
  email: string,
  track: string,
  betaTester: boolean,
};
