import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import UsernameFilter from '@src/components/UsernameFilter';
import messages from '@src/specialExams/messages';
import { useAttempts } from '@src/specialExams/data/apiHook';
import { DataTableFetchDataProps } from '@src/types';

export const ATTEMPTS_PAGE_SIZE = 25;

const AttemptsList = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const [filters, setFilters] = useState({ page: 0, emailOrUsername: '' });
  const { data = { results: [], count: 0, numPages: 0 }, isLoading = false } = useAttempts(courseId, {
    ...filters,
    pageSize: ATTEMPTS_PAGE_SIZE
  });

  const columns = useMemo(() => [
    { accessor: 'username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter, },
    { accessor: 'examName', Header: intl.formatMessage(messages.examName), disableFilters: true, },
    { accessor: 'timeLimit', Header: intl.formatMessage(messages.timeLimit), disableFilters: true, },
    { accessor: 'type', Header: intl.formatMessage(messages.type), disableFilters: true, },
    { accessor: 'startedAt', Header: intl.formatMessage(messages.startedAt), disableFilters: true, },
    { accessor: 'completedAt', Header: intl.formatMessage(messages.completedAt), disableFilters: true, },
    { accessor: 'status', Header: intl.formatMessage(messages.status), disableFilters: true, },
  ], [intl]);

  const handleFetchData = (data: DataTableFetchDataProps) => {
    const emailOrUsernameFilter = data.filters?.find((f) => f.id === 'username');
    if (emailOrUsernameFilter && emailOrUsernameFilter.value !== filters.emailOrUsername) {
      setFilters((prevFilters) => ({ ...prevFilters, emailOrUsername: emailOrUsernameFilter.value, page: 0 }));
      return;
    }
    if (data.pageIndex !== filters.page) {
      setFilters((prevFilters) => ({ ...prevFilters, page: data.pageIndex }));
    }
  };

  return (
    <DataTable
      className="mt-3"
      columns={columns}
      data={data.results}
      state={{
        pageIndex: filters.page,
        pageSize: ATTEMPTS_PAGE_SIZE,
        filters: [
          { id: 'emailOrUsername', value: filters.emailOrUsername }
        ]
      }}
      fetchData={handleFetchData}
      isFilterable
      isLoading={isLoading}
      isPaginated
      isSortable
      itemCount={data.count}
      manualFilters
      manualPagination
      manualSortBy
      pageSize={ATTEMPTS_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={() => null}
    >
      <DataTable.TableControlBar className="bg-light-200 py-3 px-4" />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noAttempts)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default AttemptsList;
