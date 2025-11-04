import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import messages from '../messages';

const DATE_EXTENSIONS_PAGE_SIZE = 25;

interface DateExtensionListProps {
  data: {
    id: number,
    username: string,
    fullname: string,
    email: string,
    graded_subsection: string,
    extended_due_date: string,
  }[],
  isLoading: boolean,
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

  const tableData = data.map(item => ({
    ...item,
    reset: <a href="/">Reset Extensions</a>,
  }));

  return (
    <DataTable columns={tableColumns} data={tableData} isPaginated itemCount={totalItemCount} pageSize={DATE_EXTENSIONS_PAGE_SIZE} isLoading={isLoading} />
  );
};

export default DateExtensionsList;
