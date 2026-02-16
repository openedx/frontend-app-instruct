import { TabProps } from '@src/instructorNav/InstructorNav';

export interface CourseInfoResponse {
  courseId: string,
  displayName: string,
  courseNumber: string,
  courseRun: string,
  enrollmentCounts: EnrollmentCounts,
  start: string | null,
  end: string | null,
  tabs?: TabProps[],
  totalEnrollment: number,
  studioUrl: string,
  pacing: string,
  org?: string,
  numSections: number,
  hasStarted: boolean,
  hasEnded: boolean,
  enrollmentEnd: string | null,
  enrollmentStart: string | null,
  gradeCutoffs: string | null,
  staffCount: number,
  learnerCount: number,
}

interface EnrollmentCounts extends Record<string, number> {
  total: number,
}
