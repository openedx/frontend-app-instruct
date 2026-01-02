export interface EnrollmentsResponse {
  count: number,
  results: {
    id: string,
    username: string,
    name: string,
    email: string,
    track: string,
    betaTester: boolean,
  }[],
}

export interface EnrollmentStatusResponse {
  status: string,
}
