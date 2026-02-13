export interface TableCellValue<T> {
  row: {
    original: T,
  },
}

export interface DownloadReportData {
  dateGenerated: string,
  reportType: string,
  reportName: string,
  downloadLink: string,
}

export type DataDownloadsCellProps = TableCellValue<DownloadReportData>;
