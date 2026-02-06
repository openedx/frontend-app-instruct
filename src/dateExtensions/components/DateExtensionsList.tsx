import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import messages from '../messages';
import { LearnerDateExtension } from '../types';
import { useDateExtensions } from '../data/apiHook';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const DATE_EXTENSIONS_PAGE_SIZE = 25;

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
    { accessor: 'fullName', Header: intl.formatMessage(messages.fullname) },
    { accessor: 'email', Header: intl.formatMessage(messages.email) },
    { accessor: 'unitTitle', Header: intl.formatMessage(messages.gradedSubsection) },
    {
      accessor: 'extendedDueDate',
      Header: intl.formatMessage(messages.extendedDueDate),
      Cell: ({ value }: { value: string }) => (
        intl.formatDate(value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
      )
    },
  ];

  const additionalColumns = [{
    id: 'reset',
    Header: intl.formatMessage(messages.reset),
    Cell: ({ row }: { row: { original: LearnerDateExtension } }) => (
      <Button
        variant="link"
        size="inline"
        onClick={() => onResetExtensions(row.original)}
      >
        {intl.formatMessage(messages.resetExtensions)}
      </Button>
    )
  }];

  const handleFetchData = (data: DataTableFetchDataProps) => {
    setPage(data.pageIndex);
  };

  return (
    <DataTable
      columns={tableColumns}
      additionalColumns={additionalColumns}
      data={data.results}
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
