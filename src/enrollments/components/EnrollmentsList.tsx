import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActionRow, Button, DataTable, IconButton } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { MoreVert } from '@openedx/paragon/icons';
import messages from '../messages';
import { useEnrollments } from '../data/apiHook';
import { Learner } from '../types';
import { DataTableFetchDataProps, TableCellValue } from '@src/types';

const ENROLLMENTS_PAGE_SIZE = 25;

interface EnrollmentsListProps {
  onUnenroll: (learner: Learner) => void,
}

const EnrollmentsList = ({ onUnenroll }: EnrollmentsListProps) => {
  const intl = useIntl();
  const { courseId } = useParams();
  const [page, setPage] = useState(0);
  const { data = { count: 0, results: [], numPages: 0 }, isLoading } = useEnrollments(courseId ?? '', {
    page,
    pageSize: ENROLLMENTS_PAGE_SIZE
  });

  const pageCount = Math.ceil(data.count / ENROLLMENTS_PAGE_SIZE);

  const handleFetchData = (data: DataTableFetchDataProps) => {
    setPage(data.pageIndex);
  };

  const handleMoreButton = () => {
    // Handle more button click
    console.log('More button clicked');
  };

  const tableColumns = [
    { accessor: 'username', Header: intl.formatMessage(messages.username) },
    { accessor: 'fullName', Header: intl.formatMessage(messages.fullName) },
    { accessor: 'email', Header: intl.formatMessage(messages.email) },
    {
      accessor: 'mode',
      Header: intl.formatMessage(messages.track),
      Cell: ({ value }: { value: string }) => (
        <span className="text-capitalize">{value || 'N/A'}</span>
      )
    },
    { accessor: 'isBetaTester', Header: intl.formatMessage(messages.betaTester), Cell: ({ value }: { value: string }) => (value ? intl.formatMessage(messages.trueLabel) : '') },
  ];

  const actionCustomCell = useCallback(({ row: { original } }: TableCellValue<Learner>) => {
    return (
      <ActionRow className="justify-content-start">
        <Button className="pl-0" onClick={() => onUnenroll(original)} variant="link">
          {intl.formatMessage(messages.unenrollButton)}
        </Button>
        <IconButton
          alt={intl.formatMessage(messages.checkEnrollmentStatus)}
          className="lead"
          iconAs={MoreVert}
          onClick={handleMoreButton}
        />
      </ActionRow>
    );
  }, [onUnenroll, intl]);

  return (
    <DataTable
      className="mt-3"
      columns={tableColumns}
      additionalColumns={[
        {
          id: 'actions',
          Header: intl.formatMessage(messages.actions),
          Cell: actionCustomCell,
        }
      ]}
      data={data.results}
      fetchData={handleFetchData}
      state={{
        pageIndex: page,
        pageSize: ENROLLMENTS_PAGE_SIZE,
      }}
      isLoading={isLoading}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
      pageSize={ENROLLMENTS_PAGE_SIZE}
      pageCount={pageCount}
    />
  );
};

export default EnrollmentsList;
