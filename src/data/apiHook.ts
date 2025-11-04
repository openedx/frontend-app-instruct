import { useQuery } from '@tanstack/react-query';
import { getCourseInfo, getDateExtensions } from './api';

const COURSE_INFO_QUERY_KEY = ['courseInfo'];
const DATE_EXTENSIONS_QUERY_KEY = ['dateExtensions'];

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: COURSE_INFO_QUERY_KEY,
    queryFn: () => getCourseInfo(courseId),
  })
);

export const useDateExtensions = (courseId: string) => (
  useQuery({
    queryKey: DATE_EXTENSIONS_QUERY_KEY,
    queryFn: () => getDateExtensions(courseId),
  })
);
