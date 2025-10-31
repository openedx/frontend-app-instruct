import { useQuery } from '@tanstack/react-query';
import { getCourseInfo } from './api';

const COURSE_INFO_QUERY_KEY = ['courseInfo'];

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: COURSE_INFO_QUERY_KEY,
    queryFn: () => getCourseInfo(courseId),
  })
);
