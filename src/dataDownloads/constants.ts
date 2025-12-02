import { SectionSelectorAction } from './components/SectionSelectorAction';
import { messages } from './messages';

export const REPORTS_TABS = [
  {
    key: 'enrollment',
    title: messages.enrollmentReportsTabTitle,
    reports: [
      {
        reportKey: 'enrolledStudents',
        reportType: '',
        reportName: messages.enrollmentReportsTabEnrolledStudentsReportName,
        reportDescription: messages.enrollmentReportsTabEnrolledStudentsReportDescription,
        buttonText: messages.enrollmentReportsTabEnrolledStudentsReportButtonText,
      },
      {
        reportKey: 'pendingEnrollments',
        reportType: '',
        reportName: messages.enrollmentReportsTabPendingEnrollmentsReportName,
        reportDescription: messages.enrollmentReportsTabPendingEnrollmentsReportDescription,
        buttonText: messages.enrollmentReportsTabPendingEnrollmentsReportButtonText,
      },
      {
        reportKey: 'pendingActivations',
        reportType: '',
        reportName: messages.enrollmentReportsTabPendingActivationsReportName,
        reportDescription: messages.enrollmentReportsTabPendingActivationsReportDescription,
        buttonText: messages.enrollmentReportsTabPendingActivationsReportButtonText,
      },
      {
        reportKey: 'anonymizedStudentsIds',
        reportType: '',
        reportName: messages.enrollmentReportsTabAnonymizedStudentsIdsReportName,
        reportDescription: messages.enrollmentReportsTabAnonymizedStudentsIdsReportDescription,
        buttonText: messages.enrollmentReportsTabAnonymizedStudentsIdsReportButtonText,
      }
    ],
  },
  {
    key: 'grading',
    title: messages.gradingReportsTabTitle,
    reports: [
      {
        reportKey: 'grade',
        reportType: '',
        reportName: messages.gradingReportsTabGradeReportName,
        reportDescription: messages.gradingReportsTabGradeReportDescription,
        buttonText: messages.gradingReportsTabGradeReportButtonText,
      },
      {
        reportKey: 'problemGrade',
        reportType: '',
        reportName: messages.gradingReportsTabProblemGradeReportName,
        reportDescription: messages.gradingReportsTabProblemGradeReportDescription,
        buttonText: messages.gradingReportsTabProblemGradeReportButtonText,
      },
    ]
  },
  {
    key: 'problemResponse',
    title: messages.problemResponseReportsTabTitle,
    reports: [
      {
        reportKey: 'oraSummary',
        reportType: '',
        reportName: messages.problemResponseReportsTabORASummaryReportName,
        reportDescription: messages.problemResponseReportsTabORASummaryReportDescription,
        buttonText: messages.problemResponseReportsTabORASummaryReportButtonText,
      },
      {
        reportKey: 'oraData',
        reportType: '',
        reportName: messages.problemResponseReportsTabORADataReportName,
        reportDescription: messages.problemResponseReportsTabORADataReportDescription,
        buttonText: messages.problemResponseReportsTabORADataReportButtonText,
      },
      {
        reportKey: 'submissionFilesArchive',
        reportType: '',
        reportName: messages.problemResponseReportsTabSubmissionFilesArchiveName,
        reportDescription: messages.problemResponseReportsTabSubmissionFilesArchiveDescription,
        buttonText: messages.problemResponseReportsTabSubmissionFilesArchiveButtonText,
      },
      {
        reportKey: 'problemResponse',
        reportType: '',
        reportName: messages.problemResponseReportsTabProblemResponseReportName,
        reportDescription: messages.problemResponseReportsTabProblemResponseReportDescription,
        buttonText: messages.problemResponseReportsTabProblemResponseReportButtonText,
        customAction: SectionSelectorAction,
      },
    ]
  },
  {
    key: 'certificate',
    title: messages.certificateReportsTabTitle,
    reports: [
      {
        reportKey: 'issuedCertificates',
        reportType: '',
        reportName: messages.certificateReportsTabIssuedCertificatesReportName,
        reportDescription: messages.certificateReportsTabIssuedCertificatesReportDescription,
        buttonText: messages.certificateReportsTabIssuedCertificatesReportButtonText,
      },
    ]
  }
];
