import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import { messages } from '../messages';
import { DataDownloadsCellProps } from '../types';

interface DownloadLinkCellProps extends DataDownloadsCellProps {
  onDownloadClick: (downloadLink: string) => void,
}

const DownloadLinkCell = ({ row, onDownloadClick }: DownloadLinkCellProps) => {
  const intl = useIntl();
  const downloadLink = row.original?.downloadLink ?? '';

  return (
    <Button variant="link" size="sm" onClick={() => onDownloadClick(downloadLink)}>
      {intl.formatMessage(messages.downloadLinkLabel)}
    </Button>
  );
};

export { DownloadLinkCell };
