import { useIntl } from '@openedx/frontend-base';
import { ListAlt } from '@openedx/paragon/icons';
import { Icon } from '@openedx/paragon';
import { messages } from '../messages';

interface EmptyTableProps {
  icon?: React.ComponentType,
  header?: string,
  body?: string,
  cta?: React.ReactNode,
}

const EmptyTable = ({ icon, header, body, cta }: EmptyTableProps) => {
  const intl = useIntl();

  const displayIcon = icon || ListAlt;
  const displayHeader = header || intl.formatMessage(messages.noRecordsFoundHeader);
  const displayBody = body || intl.formatMessage(messages.noRecordsFoundBody);

  return (
    <div className="d-flex flex-column align-items-center text-center my-4">
      <div className="bg-light-300 rounded-circle p-2 mb-2">
        <Icon src={displayIcon} size="lg" className="text-gray-400" />
      </div>
      <h4>{displayHeader}</h4>
      <p>{displayBody}</p>
      {cta && cta}
    </div>
  );
};

export { EmptyTable };
