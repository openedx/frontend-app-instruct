import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import messages from '../messages';

const mockDateExtensions = [
  { id: 1, username: 'edByun', fullname: 'Ed Byun', email: 'ed.byun@example.com', graded_subsection: 'Three body diagrams', extended_due_date: '2026-07-15', reset: <a href="/">Reset Extensions</a> },
];

const DATE_EXTENSIONS_PAGE_SIZE = 25;

const DateExtensionsList = () => {
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
  return (
    <DataTable columns={tableColumns} data={mockDateExtensions} isPaginated itemCount={totalItemCount} pageSize={DATE_EXTENSIONS_PAGE_SIZE} />
  );
};

export default DateExtensionsList;
