import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable, FormControl, Icon } from '@openedx/paragon';
import messages from '../messages';
import { LearnerDateExtension } from '../types';
import { useDateExtensions } from '../data/apiHook';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Search } from '@openedx/paragon/icons';
import SelectGradedSubsection from './SelectGradedSubsection';

const DATE_EXTENSIONS_PAGE_SIZE = 25;

export interface DateExtensionListProps {
  onResetExtensions?: (user: LearnerDateExtension) => void,
  onClickAdd?: () => void,
}

interface DataTableFetchDataProps {
  pageIndex: number,
}

const DateExtensionsList = ({
  onResetExtensions = () => {},
  onClickAdd = () => {},
}: DateExtensionListProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [page, setPage] = useState(0);
  const [searchedLearner, setSearchedLearner] = useState<string>('');
  const [gradedSubsectionFilter, setGradedSubsectionFilter] = useState<string>('');

  const { data = { count: 0, results: [], numPages: 0 }, isLoading } = useDateExtensions(courseId ?? '', {
    page,
    pageSize: DATE_EXTENSIONS_PAGE_SIZE,
    emailOrUsername: searchedLearner,
    blockId: gradedSubsectionFilter,
  });

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
      pageCount={data.numPages}
    >
      <div className="pt-3 mx-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex">
            <FormControl
              className="mb-0"
              onChange={(e) => setSearchedLearner(e.target.value)}
              placeholder={intl.formatMessage(messages.searchLearnerPlaceholder)}
              trailingElement={<Icon src={Search} />}
              value={searchedLearner}
            />
            <SelectGradedSubsection
              placeholder={intl.formatMessage(messages.allGradedSubsections)}
              onChange={(e) => setGradedSubsectionFilter(e.target.value)}
              value={gradedSubsectionFilter}
            />
          </div>
          <Button onClick={onClickAdd}>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
        </div>
        <DataTable.TableControlBar />
      </div>
      <DataTable.Table />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default DateExtensionsList;
