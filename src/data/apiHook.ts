import { useQuery } from '@tanstack/react-query';
import { getCourseInfo } from './api';

export const useCourseInfo = (courseId: string) => (
  useQuery({
    queryKey: ['courseInfo', courseId],
    queryFn: () => getCourseInfo(courseId),
    enabled: !!courseId,
  })
);
