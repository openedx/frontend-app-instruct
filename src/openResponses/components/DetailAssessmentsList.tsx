import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import messages from '../messages';
import { useDetailAssessmentsData } from '../data/apiHook';

const DETAILS_PAGE_SIZE = 25;

interface DataTableFetchDataProps {
  pageIndex: number,
}

// Example of api response to test on UI
// const mockResults = [
//   {
//     id: '1',
//     unitName: 'Example Unit',
//     assessment: 'ORA block number 1',
//     totalResponses: 2,
//     training: 0,
//     peer: 1,
//     self: 0,
//     waiting: 0,
//     staff: 0,
//     finalGradeReceived: 1,
//     url: 'http://apps.local.openedx.io:8080/instructor/course-v1:DV-edtech+check+2025-05/open_responses'
//   }
// ];

const DetailAssessmentsList = () => {
  const intl = useIntl();
  const { courseId } = useParams();
  const [page, setPage] = useState(0);
  const { data = { count: 0, results: [] }, isLoading } = useDetailAssessmentsData(courseId ?? '', {
    page,
    pageSize: DETAILS_PAGE_SIZE
  });

  const pageCount = Math.ceil(data.count / DETAILS_PAGE_SIZE);

  const tableColumns = [
    { accessor: 'unitName', Header: intl.formatMessage(messages.unitName) },
    { accessor: 'assessment', Header: intl.formatMessage(messages.assessment) },
    { accessor: 'totalResponses', Header: intl.formatMessage(messages.totalResponses) },
    { accessor: 'training', Header: intl.formatMessage(messages.training) },
    { accessor: 'peer', Header: intl.formatMessage(messages.peer) },
    { accessor: 'self', Header: intl.formatMessage(messages.self) },
    { accessor: 'waiting', Header: intl.formatMessage(messages.waiting) },
    { accessor: 'staff', Header: intl.formatMessage(messages.staff) },
    { accessor: 'finalGradeReceived', Header: intl.formatMessage(messages.finalGradeReceived) },
    { accessor: 'staffGrader', Header: intl.formatMessage(messages.staffGrader) }
  ];

  const handleFetchData = (data: DataTableFetchDataProps) => {
    setPage(data.pageIndex);
  };

  const tableData = data.results.map(item => ({
    ...item,
    staffGrader: <Button variant="link" size="inline" href={item.url}>View and Grade Responses</Button>,
  }));

  return (
    <div className="mt-4.5">
      <h3>{intl.formatMessage(messages.details)}</h3>
      <DataTable
        columns={tableColumns}
        data={tableData}
        fetchData={handleFetchData}
        initialState={{
          pageIndex: page,
          pageSize: DETAILS_PAGE_SIZE
        }}
        isLoading={isLoading}
        isPaginated
        itemCount={data.count}
        manualFilters
        manualPagination
        pageCount={pageCount}
        pageSize={DETAILS_PAGE_SIZE}
      />
    </div>
  );
};

export default DetailAssessmentsList;
