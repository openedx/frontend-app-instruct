import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import messages from '../messages';
import { User } from '../DateExtensionsPage';

const DATE_EXTENSIONS_PAGE_SIZE = 25;

export interface DateExtensionListProps {
  data: User[],
  isLoading?: boolean,
}

const DateExtensionsList = ({
  data = [],
  isLoading = false,
}: DateExtensionListProps) => {
  const intl = useIntl();

  const tableColumns = [
    { accessor: 'username', Header: intl.formatMessage(messages.username) },
    { accessor: 'fullname', Header: intl.formatMessage(messages.fullname) },
    { accessor: 'email', Header: intl.formatMessage(messages.email) },
    { accessor: 'graded_subsection', Header: intl.formatMessage(messages.graded_subsection) },
    { accessor: 'extended_due_date', Header: intl.formatMessage(messages.extended_due_date) },
    { accessor: 'reset', Header: intl.formatMessage(messages.reset) },
  ];

  const totalItemCount = 25;

  return <DataTable columns={tableColumns} data={data} isPaginated itemCount={totalItemCount} pageSize={DATE_EXTENSIONS_PAGE_SIZE} isLoading={isLoading} />;
};

export default DateExtensionsList;
