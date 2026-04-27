import { appId } from '@src/constants';
import type { PaginationParams } from '@src/types';
import type { CertificateQueryParams } from '@src/certificates/types';

export const certificatesQueryKeys = {
  all: [appId, 'certificates'] as const,
  byCourse: (courseId: string) => [...certificatesQueryKeys.all, courseId] as const,
  issued: (courseId: string, params: CertificateQueryParams) =>
    [...certificatesQueryKeys.byCourse(courseId), 'issued', params] as const,
  tasks: (courseId: string, params: PaginationParams) =>
    [...certificatesQueryKeys.byCourse(courseId), 'tasks', params] as const,
  generationHistory: (courseId: string, params: PaginationParams) =>
    [...certificatesQueryKeys.byCourse(courseId), 'generationHistory', params] as const,
};
