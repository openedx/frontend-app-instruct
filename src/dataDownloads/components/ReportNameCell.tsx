import { DataDownloadsCellProps } from '@src/dataDownloads/types';

const ReportNameCell = ({ row }: DataDownloadsCellProps) => {
  return (
    <div
      className="text-truncate"
      title={row.original.reportName}
    >
      {row.original.reportName}
    </div>
  );
};

export { ReportNameCell };
