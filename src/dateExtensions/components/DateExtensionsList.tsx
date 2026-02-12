import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable, FormControl, Icon, Skeleton } from '@openedx/paragon';
import messages from '../messages';
import { LearnerDateExtension } from '../types';
import { useDateExtensions } from '../data/apiHook';
import { Search } from '@openedx/paragon/icons';
import SelectGradedSubsection from './SelectGradedSubsection';

const DATE_EXTENSIONS_PAGE_SIZE = 25;

export interface DateExtensionListProps {
  onResetExtensions?: (user: LearnerDateExtension) => void,
  onClickAdd?: () => void,
}

interface DataTableFetchDataProps {
  filters: { id: string, value: string }[],
  pageIndex: number,
}

const DateExtensionsList = ({
  onResetExtensions = () => {},
  onClickAdd = () => {},
}: DateExtensionListProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState<{ page: number, emailOrUsername: string, blockId: string }>({
    page: 0,
    emailOrUsername: '',
    blockId: '',
  });

  const { data = { count: 0, results: [], numPages: 0 }, isLoading } = useDateExtensions(courseId ?? '', {
    blockId: filters.blockId,
    emailOrUsername: filters.emailOrUsername,
    page: filters.page,
    pageSize: DATE_EXTENSIONS_PAGE_SIZE,
  });

  // Added that time for debounce after testing on 3G network
  // It seems to be a good middle ground between responsiveness and reducing the number of API calls made when users are typing in the search input or changing filters.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetFilter = useCallback(
    debounce((setFilter: (value: string) => void, value: string) => setFilter(value), 600),
    []
  );

  const tableColumns = [
    { accessor: 'username',
      Header: intl.formatMessage(messages.username),
      Filter: ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
        const [inputValue, setInputValue] = useState(filterValue || '');

        useEffect(() => {
          setInputValue(filterValue || '');
        }, [filterValue]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setInputValue(value);
          debouncedSetFilter(setFilter, value);
        };

        return (
          <FormControl
            className="mb-0"
            onChange={handleChange}
            placeholder={intl.formatMessage(messages.searchLearnerPlaceholder)}
            trailingElement={<Icon src={Search} />}
            value={inputValue}
          />
        );
      }
    },
    { accessor: 'fullName', Header: intl.formatMessage(messages.fullname), disableFilters: true, },
    { accessor: 'email', Header: intl.formatMessage(messages.email), disableFilters: true, },
    { accessor: 'unitTitle',
      Header: intl.formatMessage(messages.gradedSubsection),
      Filter: ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
        const [inputValue, setInputValue] = useState(filterValue || '');

        useEffect(() => {
          setInputValue(filterValue || '');
        }, [filterValue]);

        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          setInputValue(value);
          debouncedSetFilter(setFilter, value);
        };

        return (
          <SelectGradedSubsection
            placeholder={intl.formatMessage(messages.allGradedSubsections)}
            onChange={handleChange}
            value={inputValue}
          />
        );
      }
    },
    {
      accessor: 'extendedDueDate',
      Header: intl.formatMessage(messages.extendedDueDate),
      Cell: ({ value }: { value: string }) => (
        intl.formatDate(value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
      ),
      disableFilters: true,
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
    const emailOrUsernameFilter = data.filters.find((filter) => filter.id === 'username');
    const newEmailOrUsername = emailOrUsernameFilter ? emailOrUsernameFilter.value : '';
    const blockIdFilter = data.filters.find((filter) => filter.id === 'unitTitle');
    const newBlockId = blockIdFilter ? blockIdFilter.value : '';
    if (newEmailOrUsername !== filters.emailOrUsername || newBlockId !== filters.blockId) {
      setFilters({ page: 0, emailOrUsername: newEmailOrUsername, blockId: newBlockId });
      return;
    }

    if (data.pageIndex !== filters.page) {
      setFilters((prev) => ({ ...prev, page: data.pageIndex }));
    }
  };

  if (isLoading) {
    return (
      <>
        <Skeleton className="mt-4 mb-2 lead" />
        <Skeleton className="mb-3 small" width="25%" />
        <Skeleton className="mt-3 lead" count={4} />
      </>
    );
  }

  return (
    <DataTable
      columns={tableColumns}
      additionalColumns={additionalColumns}
      data={data.results}
      fetchData={handleFetchData}
      initialState={{
        pageIndex: filters.page,
        pageSize: DATE_EXTENSIONS_PAGE_SIZE,
        filters: [
          {
            id: 'username',
            value: filters.emailOrUsername,
          },
          {
            id: 'unitTitle',
            value: filters.blockId,
          }
        ]
      }}
      isFilterable
      numBreakoutFilters={2}
      isLoading={isLoading}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
      pageSize={DATE_EXTENSIONS_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={DataTable.RowStatus}
    >
      <div className="d-flex justify-content-between align-items-start pt-1 mx-3 mb-3">
        <DataTable.TableControlBar />
        <Button className="mt-2.5" onClick={onClickAdd}>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noDateExtensions)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default DateExtensionsList;
