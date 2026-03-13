import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginationQueryKeys } from '@src/types';
import { getIssuedCertificates, getCertificateGenerationHistory, regenerateCertificates, getCertificateConfig } from './api';
import { certificatesQueryKeys } from './queryKeys';
import { CertificateFilter, RegenerateCertificatesParams } from '../types';

export const useIssuedCertificates = (
  courseId: string,
  pagination: PaginationQueryKeys,
  search?: string,
  filter?: CertificateFilter
) => {
  return useQuery({
    queryKey: certificatesQueryKeys.list(courseId, pagination, search, filter),
    queryFn: () => getIssuedCertificates(courseId, pagination, search, filter),
  });
};

export const useCertificateGenerationHistory = (
  courseId: string,
  pagination: PaginationQueryKeys
) => {
  return useQuery({
    queryKey: certificatesQueryKeys.history(courseId, pagination),
    queryFn: () => getCertificateGenerationHistory(courseId, pagination),
  });
};

export const useRegenerateCertificatesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, params }: { courseId: string, params: RegenerateCertificatesParams }) =>
      regenerateCertificates(courseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificatesQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: certificatesQueryKeys.all });
    },
  });
};

export const useCertificateConfig = (courseId: string) => {
  return useQuery({
    queryKey: certificatesQueryKeys.config(courseId),
    queryFn: () => getCertificateConfig(courseId),
  });
};
