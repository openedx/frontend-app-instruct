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
  }
});

export { messages };
