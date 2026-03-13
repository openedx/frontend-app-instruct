import { PaginationQueryKeys } from '@src/types';
import { CertificateFilter } from '../types';

export const certificatesQueryKeys = {
  all: ['certificates'] as const,
  lists: () => [...certificatesQueryKeys.all, 'list'] as const,
  list: (courseId: string, pagination: PaginationQueryKeys, search?: string, filter?: CertificateFilter) =>
    [...certificatesQueryKeys.lists(), courseId, pagination, search, filter] as const,
  history: (courseId: string, pagination: PaginationQueryKeys) =>
    [...certificatesQueryKeys.all, 'history', courseId, pagination] as const,
  config: (courseId: string) =>
    [...certificatesQueryKeys.all, 'config', courseId] as const,
};
