import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  pageTitle: {
    id: 'instruct.dataDownloads.pageTitle',
    defaultMessage: 'Data Downloads',
    description: 'Title for the data downloads page'
  },
  dataDownloadsTitle: {
    id: 'instruct.dataDownloads.page.title',
    defaultMessage: 'Available Reports',
    description: 'Title for data downloads page',
  },
  dataDownloadsDescription: {
    id: 'instruct.dataDownloads.page.description',
    defaultMessage: 'The reports listed below are available for download, identified by UTC date and time of generation.',
    description: 'Description for data downloads page',
  },
  dataDownloadsReportExpirationPolicyMessage: {
    id: 'instruct.dataDownloads.page.reportExpiration',
    defaultMessage: 'To keep student data secure, you cannot save or email these links for direct access. Copies of links expire within 5 minutes. Report files are deleted 90 days after generation. If you will need access to old reports, download and store the files, in accordance with your institution\'s data security policies.',
    description: 'Expiration policy message for data downloads page',
  },
  dateGeneratedColumnName: {
    id: 'instruct.dataDownloads.table.column.dateGenerated',
    defaultMessage: 'Date Generated',
    description: 'Column name for date generated in data downloads table',
  },
  reportTypeColumnName: {
    id: 'instruct.dataDownloads.table.column.reportType',
    defaultMessage: 'Report Type',
    description: 'Column name for report type in data downloads table',
  },
  reportNameColumnName: {
    id: 'instruct.dataDownloads.table.column.reportName',
    defaultMessage: 'Report Name',
    description: 'Column name for report name in data downloads table',
  },
  downloadLinkLabel: {
    id: 'instruct.dataDownloads.table.downloadLink',
    defaultMessage: 'Download Report',
    description: 'Label for download link in the download column of data downloads table',
  },
  dataDownloadsGenerateReportTitle: {
    id: 'instruct.dataDownloads.page.generate.reports.title',
    defaultMessage: 'Generate Reports',
    description: 'Title for generate reports section',
  },
  dataDownloadsGenerateReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.description',
    defaultMessage: 'Once generated, these CSV file reports will be available in the Available Reports section. Generation takes longer for larger courses.',
    description: 'Description for generate reports section',
  },
  enrollmentReportsTabTitle: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.title',
    defaultMessage: 'Enrollment Reports',
    description: 'Title for enrollment reports tab',
  },
  enrollmentReportsTabEnrolledStudentsReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.enrolledStudents.reportName',
    defaultMessage: 'Enrolled Students Reports',
    description: 'Report name for enrolled students report in enrollment reports tab',
  },
  enrollmentReportsTabEnrolledStudentsReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.enrolledStudents.reportDescription',
    defaultMessage: 'Report of all enrolled learners for this course including email address and username.',
    description: 'Report description for enrolled students report in enrollment reports tab',
  },
  enrollmentReportsTabEnrolledStudentsReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.enrolledStudents.reportButtonText',
    defaultMessage: 'Generate Enrolled Students Report',
    description: 'Button text for enrolled students report generation in enrollment reports tab',
  },
  enrollmentReportsTabPendingEnrollmentsReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.pendingEnrollments.reportName',
    defaultMessage: 'Pending Enrollments Report',
    description: 'Report name for pending enrollments report in enrollment reports tab',
  },
  enrollmentReportsTabPendingEnrollmentsReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.pendingEnrollments.reportDescription',
    defaultMessage: 'Report of learners who can enroll in the course but have not done so yet.',
    description: 'Report description for pending enrollments report in enrollment reports tab',
  },
  enrollmentReportsTabPendingEnrollmentsReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.pendingEnrollments.reportButtonText',
    defaultMessage: 'Generate Pending Enrollments Report',
    description: 'Button text for pending enrollments report generation in enrollment reports tab',
  },
  enrollmentReportsTabPendingActivationsReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.pendingActivations.reportName',
    defaultMessage: 'Pending Activations Report',
    description: 'Report name for pending activations report in enrollment reports tab',
  },
  enrollmentReportsTabPendingActivationsReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.pendingActivations.reportDescription',
    defaultMessage: 'Report of enrolled learners who have not yet activated their account.',
    description: 'Report description for pending activations report in enrollment reports tab',
  },
  enrollmentReportsTabPendingActivationsReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.pendingActivations.reportButtonText',
    defaultMessage: 'Generate Pending Activations Report',
    description: 'Button text for pending activations report generation in enrollment reports tab',
  },
  enrollmentReportsTabAnonymizedStudentsIdsReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.anonymizedStudentsIds.reportName',
    defaultMessage: 'Anonymized Students IDs Report',
    description: 'Report name for anonymized students IDs report in enrollment reports tab',
  },
  enrollmentReportsTabAnonymizedStudentsIdsReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.anonymizedStudentsIds.reportDescription',
    defaultMessage: 'Report of enrolled learners who have not yet activated their account.',
    description: 'Report description for anonymized students IDs report in enrollment reports tab',
  },
  enrollmentReportsTabAnonymizedStudentsIdsReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.enrollment.tab.anonymizedStudentsIds.reportButtonText',
    defaultMessage: 'Generate Anonymized Students IDs Report',
    description: 'Button text for anonymized students IDs report generation in enrollment reports tab',
  },
  gradingReportsTabTitle: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.title',
    defaultMessage: 'Grading Reports',
    description: 'Title for grading reports tab',
  },
  gradingReportsTabGradeReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.grade.reportName',
    defaultMessage: 'Grade Report',
    description: 'Report name for grade report in grading reports tab',
  },
  gradingReportsTabGradeReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.grade.reportDescription',
    defaultMessage: 'Report of all grades for enrolled students.',
    description: 'Report description for grade report in grading reports tab',
  },
  gradingReportsTabGradeReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.grade.reportButtonText',
    defaultMessage: 'Generate Grade Report',
    description: 'Button text for grade report generation in grading reports tab',
  },
  gradingReportsTabProblemGradeReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.problemGrade.reportName',
    defaultMessage: 'Problem Grade Report',
    description: 'Report name for problem grade report in grading reports tab',
  },
  gradingReportsTabProblemGradeReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.problemGrade.reportDescription',
    defaultMessage: 'Report of all problem grades for enrolled students.',
    description: 'Report description for problem grade report in grading reports tab',
  },
  gradingReportsTabProblemGradeReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.grading.tab.problemGrade.reportButtonText',
    defaultMessage: 'Generate Problem Grade Report',
    description: 'Button text for problem grade report generation in grading reports tab',
  },
  problemResponseReportsTabTitle: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.title',
    defaultMessage: 'Problem Response Reports',
    description: 'Title for problem response reports tab',
  },
  problemResponseReportsTabORASummaryReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.oraSummary.reportName',
    defaultMessage: 'ORA Summary Report',
    description: 'Report name for ORA summary report in problem response reports tab',
  },
  problemResponseReportsTabORASummaryReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.oraSummary.reportDescription',
    defaultMessage: 'Report of details and statuses for ORA.',
    description: 'Report description for ORA summary report in problem response reports tab',
  },
  problemResponseReportsTabORASummaryReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.oraSummary.reportButtonText',
    defaultMessage: 'Generate ORA Summary Report',
    description: 'Button text for ORA summary report generation in problem response reports tab',
  },
  problemResponseReportsTabORADataReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.oraData.reportName',
    defaultMessage: 'ORA Data Report',
    description: 'Report name for ORA data report in problem response reports tab',
  },
  problemResponseReportsTabORADataReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.oraData.reportDescription',
    defaultMessage: 'Report of all ORA assignment details.',
    description: 'Report description for ORA data report in problem response reports tab',
  },
  problemResponseReportsTabORADataReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.oraData.reportButtonText',
    defaultMessage: 'Generate ORA Data Report',
    description: 'Button text for ORA data report generation in problem response reports tab',
  },
  problemResponseReportsTabSubmissionFilesArchiveName: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.submissionFilesArchive.reportName',
    defaultMessage: 'Submission Files Archive',
    description: 'Report name for submission files archive in problem response reports tab',
  },
  problemResponseReportsTabSubmissionFilesArchiveDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.submissionFilesArchive.reportDescription',
    defaultMessage: 'ZIP file containing all submission texts and attachments.',
    description: 'Report description for submission files archive in problem response reports tab',
  },
  problemResponseReportsTabSubmissionFilesArchiveButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.submissionFilesArchive.reportButtonText',
    defaultMessage: 'Generate Submission Files Archive',
    description: 'Button text for submission files archive generation in problem response reports tab',
  },
  problemResponseReportsTabProblemResponseReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.problemResponse.reportName',
    defaultMessage: 'Problem Response Report',
    description: 'Report name for problem response report in problem response reports tab',
  },
  problemResponseReportsTabProblemResponseReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.problemResponse.reportDescription',
    defaultMessage: 'Report of all students answears to a problem. NOTE: You also select a section or a chapter to include results of all problems in that section or chapter.',
    description: 'Report description for problem response report in problem response reports tab',
  },
  problemResponseReportsTabProblemResponseReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.problemResponse.reportButtonText',
    defaultMessage: 'Generate Problem Report',
    description: 'Button text for problem response report generation in problem response reports tab',
  },
  certificateReportsTabTitle: {
    id: 'instruct.dataDownloads.page.generate.reports.certificate.tab.title',
    defaultMessage: 'Certificate Reports',
    description: 'Title for certificate reports tab',
  },
  certificateReportsTabIssuedCertificatesReportName: {
    id: 'instruct.dataDownloads.page.generate.reports.certificate.tab.issuedCertificates.reportName',
    defaultMessage: 'Issued Certificates',
    description: 'Report name for issued certificates report in certificate reports tab',
  },
  certificateReportsTabIssuedCertificatesReportDescription: {
    id: 'instruct.dataDownloads.page.generate.reports.certificate.tab.issuedCertificates.reportDescription',
    defaultMessage: 'Report of Certificates Issued.',
    description: 'Report description for issued certificates report in certificate reports tab',
  },
  certificateReportsTabIssuedCertificatesReportButtonText: {
    id: 'instruct.dataDownloads.page.generate.reports.certificate.tab.issuedCertificates.reportButtonText',
    defaultMessage: 'Generate Certificates Report',
    description: 'Button text for issued certificates report generation in certificate reports tab',
  },

  sectionOrProblemLabel: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.problemResponse.sectionOrProblemLabel',
    defaultMessage: 'Specify Section or Problem: ',
    description: 'Label for section or problem input in problem response reports tab',
  },
  sectionOrProblemExampleTooltipText: {
    id: 'instruct.dataDownloads.page.generate.reports.problemResponse.tab.problemResponse.sectionOrProblemExampleTooltipText',
    defaultMessage: 'Example: block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
    description: 'Example text for section or problem input in problem response reports tab',
  }
});

export { messages };
