import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import messages from '../messages';
import { LearnerDateExtension } from '../types';
import { useDateExtensions } from '../../data/apiHook';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

// For testing purposes, will be deleted once backend is ready
// const mockDateExtensions = [
//   { id: 1, username: 'edByun', fullname: 'Ed Byun', email: 'ed.byun@example.com', graded_subsection: 'Three body diagrams', extended_due_date: '2026-07-15' },
//   { id: 2, username: 'dianaSalas', fullname: 'Diana Villalvazo', email: 'diana.villalvazo@example.com', graded_subsection: 'Three body diagrams', extended_due_date: '2026-07-15' },
// ];

export const DATE_EXTENSIONS_PAGE_SIZE = 25;

export interface DateExtensionListProps {
  onResetExtensions?: (user: LearnerDateExtension) => void,
}

interface DataTableFetchDataProps {
  pageIndex: number,
}

const DateExtensionsList = ({
  onResetExtensions = () => {},
}: DateExtensionListProps) => {
  const intl = useIntl();
  const { courseId } = useParams();
  const [page, setPage] = useState(0);
  const { data = { count: 0, results: [] }, isLoading } = useDateExtensions(courseId ?? '', {
    page,
    pageSize: DATE_EXTENSIONS_PAGE_SIZE
  });

  const pageCount = Math.ceil(data.count / DATE_EXTENSIONS_PAGE_SIZE);

  const tableColumns = [
    { accessor: 'username', Header: intl.formatMessage(messages.username) },
    { accessor: 'fullname', Header: intl.formatMessage(messages.fullname) },
    { accessor: 'email', Header: intl.formatMessage(messages.email) },
    { accessor: 'graded_subsection', Header: intl.formatMessage(messages.graded_subsection) },
    { accessor: 'extended_due_date', Header: intl.formatMessage(messages.extended_due_date) },
    { accessor: 'reset', Header: intl.formatMessage(messages.reset) },
  ];

  const tableData = data.results.map(item => ({
    ...item,
    reset: <Button variant="link" size="inline" onClick={() => onResetExtensions(item)}>Reset Extensions</Button>,
  }));

  const handleFetchData = (data: DataTableFetchDataProps) => {
    setPage(data.pageIndex);
  };

  return (
    <DataTable
      columns={tableColumns}
      data={tableData}
      fetchData={handleFetchData}
      initialState={{
        pageIndex: page,
        pageSize: DATE_EXTENSIONS_PAGE_SIZE,
      }}
      isLoading={isLoading}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
      pageSize={DATE_EXTENSIONS_PAGE_SIZE}
      pageCount={pageCount}
    />
  );
};

export default DateExtensionsList;
