import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CertificateQueryParams,
  GrantExceptionRequest,
  InvalidateCertificateRequest,
  PaginationParams,
  RemoveExceptionRequest,
  RemoveInvalidationRequest,
} from '../types';
import {
  getInstructorTasks,
  getIssuedCertificates,
  grantBulkExceptions,
  invalidateCertificate,
  removeException,
  removeInvalidation,
  toggleCertificateGeneration,
} from './api';
import { certificatesQueryKeys } from './queryKeys';

/**
 * Hook to fetch issued certificates
 */
export const useIssuedCertificates = (courseId: string, params: CertificateQueryParams) =>
  useQuery({
    queryKey: certificatesQueryKeys.issued(courseId, params),
    queryFn: () => getIssuedCertificates(courseId, params),
    enabled: !!courseId,
  });

/**
 * Hook to fetch instructor tasks
 */
export const useInstructorTasks = (courseId: string, params: PaginationParams) =>
  useQuery({
    queryKey: certificatesQueryKeys.tasks(courseId, params),
    queryFn: () => getInstructorTasks(courseId, params),
    enabled: !!courseId,
  });

/**
 * Hook to grant bulk certificate exceptions
 */
export const useGrantBulkExceptions = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: GrantExceptionRequest) => grantBulkExceptions(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
      });
    },
  });
};

/**
 * Hook to invalidate certificate
 */
export const useInvalidateCertificate = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: InvalidateCertificateRequest) => invalidateCertificate(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
      });
    },
  });
};

/**
 * Hook to remove certificate exception
 */
export const useRemoveException = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: RemoveExceptionRequest) => removeException(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
      });
    },
  });
};

/**
 * Hook to remove certificate invalidation
 */
export const useRemoveInvalidation = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: RemoveInvalidationRequest) => removeInvalidation(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
      });
    },
  });
};

/**
 * Hook to toggle certificate generation
 */
export const useToggleCertificateGeneration = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enable: boolean) => toggleCertificateGeneration(courseId, enable),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
      });
    },
  });
};
