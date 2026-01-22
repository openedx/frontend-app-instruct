import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import { useCallback, useMemo } from 'react';
import { messages } from '../messages';
import { DownloadLinkCell } from './DownloadLinkCell';
import { DownloadReportData } from '../types';
import { ReportNameCell } from './ReportNameCell';

interface DataDownloadTableProps {
  data: DownloadReportData[],
  isLoading: boolean,
  onDownloadClick: (downloadLink: string) => void,
}

const DataDownloadTable = ({ data, isLoading, onDownloadClick }: DataDownloadTableProps) => {
  const intl = useIntl();

  const tableColumns = useMemo(() => [
    { accessor: 'dateGenerated', Header: intl.formatMessage(messages.dateGeneratedColumnName) },
    { accessor: 'reportType', Header: intl.formatMessage(messages.reportTypeColumnName) },
  ], [intl]);

  const DownloadCustomCell = useCallback(({ row }) => {
    return <DownloadLinkCell row={row} onDownloadClick={onDownloadClick} />;
  }, [onDownloadClick]);

  return (
    <DataTable
      columns={tableColumns}
      data={data}
      isLoading={isLoading}
      additionalColumns={[
        {
          id: 'reportName',
          Header: intl.formatMessage(messages.reportNameColumnName),
          Cell: ReportNameCell,
        },
        {
          id: 'downloadLink',
          Header: '',
          Cell: DownloadCustomCell,
        }
      ]}
      RowStatusComponent={() => null}
    >
    </DataTable>
  );
};

export { DataDownloadTable };
