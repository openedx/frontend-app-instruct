import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { DataTable, Spinner } from '@openedx/paragon';
import { useCertificateGenerationHistory } from '../data/apiHook';
import messages from '../messages';

const CertificateGenerationHistory = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [pageIndex] = useState(0);
  const pageSize = 20;

  const { data, isLoading, error } = useCertificateGenerationHistory(
    courseId,
    { page: pageIndex, pageSize }
  );

  const columns = [
    {
      Header: intl.formatMessage(messages.taskName),
      accessor: 'taskName',
    },
    {
      Header: intl.formatMessage(messages.date),
      accessor: 'date',
    },
    {
      Header: intl.formatMessage(messages.details),
      accessor: 'details',
    },
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error loading generation history</div>;
  }

  return (
    <div>
      <DataTable
        data={data?.results || []}
        columns={columns}
        itemCount={data?.count || 0}
        pageCount={Math.ceil((data?.count || 0) / pageSize)}
      >
        <DataTable.Table />
        <DataTable.TableControlBar />
        <DataTable.EmptyTable content="No generation history found" />
      </DataTable>
    </div>
  );
};

export default CertificateGenerationHistory;
