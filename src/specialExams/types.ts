import { PaginationParams } from '@src/types';

export interface Attempt {
  id: number,
  user: {
    username: string,
  },
  examId: number,
  examName: string,
  allowedTimeLimitMins: number,
  type: string,
  startTime: string,
  endTime: string,
  status: string,
}

export interface AttemptsParams extends PaginationParams {
  emailOrUsername: string,
  ordering: string,
}

export interface Allowance {
  value: string,
  key: string,
  proctoredExam: {
    examName: string,
    examType: string,
    id: number,
  },
  user: {
    username: string,
    email: string,
    id: number,
  },
  id: number,
}

export interface AddAllowanceParams {
  userIds: string[],
  examType: string,
  examIds: number[],
  allowanceType: string,
  value: string,
}

export interface AddAllowanceForm {
  users: string,
  examType: string,
  examIds: number[],
  allowanceType: string,
  value: string,
}

export interface SpecialExam {
  examName: string,
  examType: string,
  timeLimitMins: number,
  contentId: string,
  courseId: string,
  dueDate: string | null,
  isProctored: boolean,
  isActive: boolean,
  isPracticeExam: boolean,
  hideAfterDue: boolean,
  id: number,
}

export interface DeleteAllowanceParams {
  examId: number,
  userIds: number[],
  allowanceType: string,
}
