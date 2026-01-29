import { useIntl } from '@openedx/frontend-base';
import { DataTable, Skeleton } from '@openedx/paragon';
import { useCallback, useMemo } from 'react';
import { messages } from '../messages';
import { DownloadLinkCell } from './DownloadLinkCell';
import { DownloadReportData } from '../types';
import { ReportNameCell } from './ReportNameCell';

interface DataDownloadTableProps {
  data: DownloadReportData[],
  isLoading: boolean,
  onDownloadClick: (downloadLink: string, reportName: string) => void,
}

// Skeleton data for loading state
const skeletonData = [
  { dateGenerated: 'skeleton-1', reportType: 'skeleton-1', reportName: 'skeleton-1', downloadLink: '' },
  { dateGenerated: 'skeleton-2', reportType: 'skeleton-2', reportName: 'skeleton-2', downloadLink: '' },
  { dateGenerated: 'skeleton-3', reportType: 'skeleton-3', reportName: 'skeleton-3', downloadLink: '' },
  { dateGenerated: 'skeleton-4', reportType: 'skeleton-4', reportName: 'skeleton-4', downloadLink: '' },
  { dateGenerated: 'skeleton-5', reportType: 'skeleton-5', reportName: 'skeleton-5', downloadLink: '' },
];

const DataDownloadTable = ({ data, isLoading, onDownloadClick }: DataDownloadTableProps) => {
  const intl = useIntl();

  const tableColumns = useMemo(() => [
    {
      accessor: 'dateGenerated',
      Header: intl.formatMessage(messages.dateGeneratedColumnName),
      Cell: ({ row }: { row: any }) => isLoading ? <Skeleton width={120} /> : row.original.dateGenerated,
    },
    {
      accessor: 'reportType',
      Header: intl.formatMessage(messages.reportTypeColumnName),
      Cell: ({ row }: { row: any }) => isLoading ? <Skeleton width={row.index === 0 ? 180 : row.index === 1 ? 150 : 200} /> : row.original.reportType,
    },
  ], [intl, isLoading]);

  const DownloadCustomCell = useCallback(({ row }: { row: any }) => {
    if (isLoading) return <Skeleton width={80} />;
    return <DownloadLinkCell row={row} onDownloadClick={onDownloadClick} />;
  }, [onDownloadClick, isLoading]);

  const SkeletonReportNameCell = useCallback(({ row }: { row: any }) => {
    if (isLoading) return <Skeleton width={row.index === 0 ? 300 : row.index === 1 ? 250 : 280} />;
    return <ReportNameCell row={row} />;
  }, [isLoading]);

  return (
    <DataTable
      columns={tableColumns}
      data={isLoading ? skeletonData : data}
      isLoading={isLoading}
      additionalColumns={[
        {
          id: 'reportName',
          Header: intl.formatMessage(messages.reportNameColumnName),
          Cell: SkeletonReportNameCell,
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
