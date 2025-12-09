import { useQuery } from '@tanstack/react-query';
import { getCourseInfo } from './api';
import { courseInfoQueryKeys } from './queryKeys';

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: courseInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCourseInfo(courseId),
  })
);
