import { useMutation, useQuery } from '@tanstack/react-query';
import { generateReportLink, getGeneratedReports, triggerReportGeneration } from './api';

export const queryKeys = {
  generatedReports: (courseId: string) => ['generated-reports', courseId],
  generateReportLink: (courseId: string) => ['report-link', courseId],
  triggerReportGeneration: (courseId: string) => ['trigger-report-generation', courseId],
};

export const useGeneratedReports = (courseId: string) => (
  useQuery({
    queryKey: queryKeys.generatedReports(courseId),
    queryFn: () => getGeneratedReports(courseId),
  })
);

export const useGenerateReportLink = (courseId: string) => (
  useMutation({
    mutationKey: queryKeys.generateReportLink(courseId),
    mutationFn: (reportType: string) => generateReportLink(courseId, reportType),
  })
);

export const useTriggerReportGeneration = (courseId: string) => (
  useMutation({
    mutationKey: queryKeys.triggerReportGeneration(courseId),
    mutationFn: (reportType: string) => triggerReportGeneration(courseId, reportType),
  })
);
