import { useMemo } from 'react';
import { DataTable } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import type { InstructorTask } from '../types';
import messages from '../messages';

interface GenerationHistoryTableProps {
  data: InstructorTask[],
  isLoading: boolean,
  itemCount: number,
  pageCount: number,
  currentPage: number,
  onPageChange: (pageIndex: number) => void,
}

const GenerationHistoryTable = ({
  data,
  isLoading,
  itemCount,
  pageCount,
  currentPage,
  onPageChange,
}: GenerationHistoryTableProps) => {
  const intl = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage(messages.columnTaskName),
        accessor: 'taskName',
      },
      {
        Header: intl.formatMessage(messages.columnDate),
        accessor: 'created',
        Cell: ({ value }: { value: string }) => {
          if (!value) return null;
          return intl.formatDate(new Date(value), {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        Header: intl.formatMessage(messages.columnDetails),
        accessor: 'taskOutput',
        Cell: ({ row }: { row: { original: InstructorTask } }) => {
          const { taskState, taskOutput } = row.original;
          return (
            <div>
              <div>
                <strong>Status:</strong> {taskState}
              </div>
              {taskOutput && (
                <div className="mt-1 text-gray-700">
                  <small>{taskOutput}</small>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [intl],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isPaginated
      itemCount={itemCount}
      pageCount={pageCount}
      manualPagination
      fetchData={({ pageIndex }: { pageIndex: number }) => onPageChange(pageIndex)}
      initialState={{ pageIndex: currentPage, pageSize: 25 }}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noTasksMessage)} />
      {itemCount > 0 && (
        <DataTable.TableFooter>
          <DataTable.RowStatus />
          <DataTable.TablePagination />
        </DataTable.TableFooter>
      )}
    </DataTable>
  );
};

export default GenerationHistoryTable;
