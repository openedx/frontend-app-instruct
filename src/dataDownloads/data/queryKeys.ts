import { appId } from '@src/constants';

export const dataDownloadsQueryKeys = {
  all: [appId, 'dataDownloads'] as const,
  generatedReports: (courseId: string) => [...dataDownloadsQueryKeys.all, 'generatedReports', courseId] as const,
  generateReportLink: (courseId: string) => [...dataDownloadsQueryKeys.all, 'reportLink', courseId] as const,
};
