import { Container, Button, Tabs, Tab, Form, Card } from '@openedx/paragon';
import { messages } from './messages';
import { useIntl, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { DataDownloadTable } from './components/DataDownloadTable';
import { useParams } from 'react-router-dom';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { useCallback, useState } from 'react';
import { getApiBaseUrl } from '../data/api';
import { getReportTypeDisplayName } from './utils';

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
  const { data: reportsData, isLoading } = useGeneratedReports(courseId ?? '');
  const { mutate: generateReportLinkMutate, isPending: isGenerating } = useGenerateReportLink(courseId ?? '');
  const [problemLocation, setProblemLocation] = useState('');

  interface ReportSectionProps {
    titleMessage: { id: string, defaultMessage: string, description?: string },
    descriptionMessage: { id: string, defaultMessage: string, description?: string },
    buttonMessage: { id: string, defaultMessage: string, description?: string },
    onGenerate: () => void,
    isFirst?: boolean,
    isLast?: boolean,
  }

  const ReportSection = ({
    titleMessage,
    descriptionMessage,
    buttonMessage,
    onGenerate,
    isFirst = false,
    isLast = false
  }: ReportSectionProps) => (
    <div className={`d-lg-flex justify-content-between align-items-center ${isFirst ? 'pt-2.5' : 'pt-4.5'} pb-3.5 ${!isLast ? 'border-bottom' : ''}`}>
      <div className="mr-lg-3">
        <h4 className="text-primary-700">{intl.formatMessage(titleMessage)}</h4>
        <p className="text-primary-700 m-0">{intl.formatMessage(descriptionMessage)}</p>
      </div>
      <Button
        variant="primary"
        onClick={onGenerate}
        disabled={isGenerating}
        className="text-nowrap"
      >
        {intl.formatMessage(buttonMessage)}
      </Button>
    </div>
  );

  // Extract downloads array from API response and transform to match expected format
  const data = reportsData?.downloads?.map(report => ({
    dateGenerated: report.dateGenerated,
    reportType: getReportTypeDisplayName(report.reportType, intl),
    reportName: report.reportName,
    downloadLink: report.reportUrl, // Map reportUrl to downloadLink
  })) ?? mockedData;

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

  const handleGenerateProblemResponsesReport = useCallback(() => {
    generateReportLinkMutate({
      reportType: 'problem_responses',
      problemLocation: problemLocation || undefined,
    });
  }, [generateReportLinkMutate, problemLocation]);

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <h3 className="text-primary-700">{intl.formatMessage(messages.dataDownloadsTitle)}</h3>
      <p className="text-primary-700">{intl.formatMessage(messages.dataDownloadsDescription)}</p>
      <p className="text-primary-700">{intl.formatMessage(messages.dataDownloadsReportExpirationPolicyMessage)}</p>
      <DataDownloadTable data={data} isLoading={isLoading} onDownloadClick={handleDownload} />

      <h3 className="mt-5 text-primary-700">{intl.formatMessage(messages.generateReportsTitle)}</h3>
      <p className="text-primary-700">{intl.formatMessage(messages.generateReportsDescription)}</p>
      <Card variant="muted">
        <Tabs defaultActiveKey="enrollment" className="mb-3">
          <Tab eventKey="enrollment" title={intl.formatMessage(messages.enrollmentReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <ReportSection
                titleMessage={messages.enrolledStudentsReportTitle}
                descriptionMessage={messages.enrolledStudentsReportDescription}
                buttonMessage={messages.generateEnrolledStudentsReport}
                onGenerate={() => handleGenerateReport('enrolled_students')}
                isFirst
              />

              <ReportSection
                titleMessage={messages.pendingEnrollmentsReportTitle}
                descriptionMessage={messages.pendingEnrollmentsReportDescription}
                buttonMessage={messages.generatePendingEnrollmentsReport}
                onGenerate={() => handleGenerateReport('pending_enrollments')}
              />

              <ReportSection
                titleMessage={messages.pendingActivationsReportTitle}
                descriptionMessage={messages.pendingActivationsReportDescription}
                buttonMessage={messages.generatePendingActivationsReport}
                onGenerate={() => handleGenerateReport('pending_activations')}
              />

              <ReportSection
                titleMessage={messages.anonymizedStudentIdsReportTitle}
                descriptionMessage={messages.anonymizedStudentIdsReportDescription}
                buttonMessage={messages.generateAnonymizedStudentIdsReport}
                onGenerate={() => handleGenerateReport('anonymized_student_ids')}
                isLast
              />
            </div>
          </Tab>

          <Tab eventKey="grading" title={intl.formatMessage(messages.gradingReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <ReportSection
                titleMessage={messages.gradeReportTitle}
                descriptionMessage={messages.gradeReportDescription}
                buttonMessage={messages.generateGradeReport}
                onGenerate={() => handleGenerateReport('grade')}
                isFirst
              />

              <ReportSection
                titleMessage={messages.problemGradeReportTitle}
                descriptionMessage={messages.problemGradeReportDescription}
                buttonMessage={messages.generateProblemGradeReport}
                onGenerate={() => handleGenerateReport('problem_grade')}
                isLast
              />
            </div>
          </Tab>

          <Tab eventKey="problemResponse" title={intl.formatMessage(messages.problemResponseReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <ReportSection
                titleMessage={messages.ora2SummaryReportTitle}
                descriptionMessage={messages.ora2SummaryReportDescription}
                buttonMessage={messages.generateOra2SummaryReport}
                onGenerate={() => handleGenerateReport('ora2_summary')}
                isFirst
              />

              <ReportSection
                titleMessage={messages.ora2DataReportTitle}
                descriptionMessage={messages.ora2DataReportDescription}
                buttonMessage={messages.generateOra2DataReport}
                onGenerate={() => handleGenerateReport('ora2_data')}
              />

              <ReportSection
                titleMessage={messages.submissionFilesArchiveTitle}
                descriptionMessage={messages.submissionFilesArchiveDescription}
                buttonMessage={messages.generateSubmissionFilesArchive}
                onGenerate={() => handleGenerateReport('ora2_submission_files')}
              />

              <div>
                <h5 className="text-primary-700">{intl.formatMessage(messages.problemResponsesReportTitle)}</h5>
                <p className="text-primary-700">{intl.formatMessage(messages.problemResponsesReportDescription)}</p>
                <p className="small">{intl.formatMessage(messages.problemResponsesReportNote)}</p>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {intl.formatMessage(messages.specifyProblemLocation)}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={intl.formatMessage(messages.problemLocationPlaceholder)}
                    value={problemLocation}
                    onChange={(e) => setProblemLocation(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleGenerateProblemResponsesReport}
                  disabled={isGenerating}
                >
                  {intl.formatMessage(messages.generateProblemResponsesReport)}
                </Button>
              </div>
            </div>
          </Tab>

          <Tab eventKey="certificates" title={intl.formatMessage(messages.certificateReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <div>
                <h5 className="text-primary-700">{intl.formatMessage(messages.issuedCertificatesTitle)}</h5>
                <p className="text-primary-700">{intl.formatMessage(messages.issuedCertificatesDescription)}</p>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
};

export { DataDownloadsPage };
