export interface CourseTeamMember {
  username: string,
  email: string,
  role: string,
};

export interface CourseTeamMemberQueryParams {
  page: number,
  pageSize: number,
  emailOrUsername?: string,
  role?: string,
};

export interface Role {
  id: string,
  name: string,
};
