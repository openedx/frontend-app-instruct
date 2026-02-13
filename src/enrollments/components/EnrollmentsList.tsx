import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActionRow, Button, DataTable, IconButton } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { MoreVert } from '@openedx/paragon/icons';
import messages from '../messages';
import { useEnrollments } from '../data/apiHook';
import { Learner } from '../types';

const ENROLLMENTS_PAGE_SIZE = 25;

const demoEnrollments = [
  {
    id: '1',
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    track: 'Audit',
    betaTester: true,
    actions: <button type="button" className="btn btn-link">Check Enrollment Status</button>,
  },
];

interface EnrollmentsListProps {
  onUnenroll: (learner: Learner) => void,
}

const EnrollmentsList = ({ onUnenroll }: EnrollmentsListProps) => {
  const intl = useIntl();
  const { courseId } = useParams();
  const [page, setPage] = useState(0);
  const { data = { count: 0, results: demoEnrollments }, isLoading } = useEnrollments(courseId ?? '', {
    page,
    pageSize: ENROLLMENTS_PAGE_SIZE
  });

  const pageCount = Math.ceil(data.count / ENROLLMENTS_PAGE_SIZE);

  const handleFetchData = (state: any) => {
    setPage(state.pageIndex);
  };

  const handleMoreButton = () => {
    // Handle more button click
    console.log('More button clicked');
  };

  const tableColumns = [
    { accessor: 'username', Header: intl.formatMessage(messages.username) },
    { accessor: 'fullName', Header: intl.formatMessage(messages.fullName) },
    { accessor: 'email', Header: intl.formatMessage(messages.email) },
    { accessor: 'track', Header: intl.formatMessage(messages.track) },
    { accessor: 'betaTester', Header: intl.formatMessage(messages.betaTester) },
    { accessor: 'actions', Header: intl.formatMessage(messages.actions) },
  ];

  const tableData = data.results.map((learner: Learner) => ({
    id: learner.id,
    username: learner.username,
    fullName: learner.fullName,
    email: learner.email,
    track: learner.track ?? 'N/A',
    betaTester: learner.betaTester ? 'True' : '',
    actions: (
      <ActionRow className="justify-content-start">
        <Button className="pl-0" onClick={() => onUnenroll(learner)} variant="link">
          {intl.formatMessage(messages.unenrollButton)}
        </Button>
        <IconButton
          alt={intl.formatMessage(messages.checkEnrollmentStatus)}
          className="lead"
          iconAs={MoreVert}
          onClick={handleMoreButton}
        />
      </ActionRow>
    ),
  }));

  return (
    <DataTable
      columns={tableColumns}
      data={tableData}
      fetchData={handleFetchData}
      initialState={{
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
