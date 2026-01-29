import { Container } from '@openedx/paragon';
import { messages } from './messages';
import { useIntl, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { DataDownloadTable } from './components/DataDownloadTable';
import { GenerateReports } from './components/GenerateReports';
import { useParams } from 'react-router-dom';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { useCallback } from 'react';
import { getApiBaseUrl } from '../data/api';
import { getReportTypeDisplayName } from './utils';

const DataDownloadsPage = () => {
  const intl = useIntl();
  const { courseId } = useParams();
  const { data: reportsData, isLoading } = useGeneratedReports(courseId ?? '');
  const { mutate: generateReportLinkMutate, isPending: isGenerating } = useGenerateReportLink(courseId ?? '');

  // Extract downloads array from API response and transform to match expected format
  const data = reportsData?.downloads?.map(report => ({
    dateGenerated: report.dateGenerated,
    reportType: getReportTypeDisplayName(report.reportType, intl),
    reportName: report.reportName,
    downloadLink: report.reportUrl, // Map reportUrl to downloadLink
  })) ?? [];

  const handleDownload = useCallback(async (downloadLink: string, reportName: string) => {
    console.log('Download link:', downloadLink);
    console.log('Report name:', reportName);

    try {
      // The downloadLink is a relative path, so we need to prepend the LMS base URL
      const baseUrl = getApiBaseUrl();
      const fullUrl = downloadLink.startsWith('http') ? downloadLink : `${baseUrl}${downloadLink}`;
      console.log('Full download URL:', fullUrl);

      // Use authenticated HTTP client to fetch the file as a blob
      const response = await getAuthenticatedHttpClient().get(fullUrl, {
        responseType: 'blob',
      });

      // Use the reportName from the API as the filename
      const filename = reportName || 'report.csv';

      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading report:', error);
      // TODO: Show error message to user
    }
  }, []);

  const handleGenerateReport = useCallback((reportType: string) => {
    generateReportLinkMutate({ reportType });
  }, [generateReportLinkMutate]);

  const handleGenerateProblemResponsesReport = useCallback((problemLocation?: string) => {
    generateReportLinkMutate({
      reportType: 'problem_responses',
      problemLocation,
    });
  }, [generateReportLinkMutate]);

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <h3 className="text-primary-700">{intl.formatMessage(messages.dataDownloadsTitle)}</h3>
      <p className="text-primary-700">{intl.formatMessage(messages.dataDownloadsDescription)}</p>
      <p className="text-primary-700">{intl.formatMessage(messages.dataDownloadsReportExpirationPolicyMessage)}</p>
      <DataDownloadTable data={data} isLoading={isLoading} onDownloadClick={handleDownload} />

      <GenerateReports
        onGenerateReport={handleGenerateReport}
        onGenerateProblemResponsesReport={handleGenerateProblemResponsesReport}
        isGenerating={isGenerating}
      />
    </Container>
  );
};

export { DataDownloadsPage };
