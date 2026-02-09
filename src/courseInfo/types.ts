import { TabProps } from '@src/instructorTabs/InstructorTabs';

export interface CourseInfoResponse {
  courseId: string,
  displayName: string,
  courseNumber: string,
  courseRun: string,
  enrollmentCounts: EnrollmentCounts,
  enrollment_end: string | null,
  start: string | null,
  end: string | null,
  tabs?: TabProps[],
  total_enrollment: number,
  studio_url: string,
  pacing: string,
  org?: string,
  numSections: number,
  hasStarted: boolean,
  hasEnded: boolean,
  enrollmentEnd: string | null,
  enrollmentStart: string | null,
  gradeCutoffs: string | null,
}

interface EnrollmentCounts {
  total: number,
  audit: number,
}
