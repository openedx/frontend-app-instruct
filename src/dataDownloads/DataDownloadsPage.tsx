import { Container } from '@openedx/paragon';
import { messages } from './messages';
import { useIntl } from '@openedx/frontend-base';
import { DataDownloadTable } from './components/DataDownloadTable';
import { useParams } from 'react-router-dom';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { useCallback } from 'react';

// TODO: remove once API is ready
const mockedData = [
  {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type A',
    reportName: 'Axim_ID101_2_student_state_from_block-v1_Axim+ID101+2+type@chapter+block@f9e8e1ec0d284c48a03cdc9d285563aa_2025-09-08-1934 (1)',
    downloadLink: 'https://example.com/report-a',
  },
  {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type B',
    reportName: 'Axim_ID101_2_student_state_from_block-v1_Axim+ID101+2+type@chapter+block@f9e8e1ec0d284c48a03cdc9d285563aa_2025-09-08-1934 (1)',
    downloadLink: 'https://example.com/report-b',
  },
];

const DataDownloadsPage = () => {
  const intl = useIntl();
  const { courseId } = useParams();
  const { data = mockedData, isLoading } = useGeneratedReports(courseId ?? '');
  const { mutate: generateReportLinkMutate } = useGenerateReportLink(courseId ?? '');

  const handleDownload = useCallback((downloadLink: string) => {
    generateReportLinkMutate(downloadLink); // TODO: pass the correct reportType
  }, [generateReportLinkMutate]);

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <h3>{intl.formatMessage(messages.dataDownloadsTitle)}</h3>
      <p>{intl.formatMessage(messages.dataDownloadsDescription)}</p>
      <p>{intl.formatMessage(messages.dataDownloadsReportExpirationPolicyMessage)}</p>
      <DataDownloadTable data={data} isLoading={isLoading} onDownloadClick={handleDownload} />
    </Container>
  );
};

export { DataDownloadsPage };
