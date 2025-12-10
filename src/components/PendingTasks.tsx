import { useIntl } from '@openedx/frontend-base';
import { Collapsible, DataTable, Icon, Skeleton } from '@openedx/paragon';
import { useEffect, useMemo } from 'react';
import { messages } from './messages';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import { usePendingTasks } from '../data/apiHook';
import { useParams } from 'react-router';
import { ObjectCell } from './ObjectCell';
import { PendingTask, TableCellValue } from '../types';

const PendingTasks = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { mutate: fetchTasks, data: tasks, isPending } = usePendingTasks(courseId);

  const tableColumns = useMemo(() => [
    { accessor: 'taskType', Header: intl.formatMessage(messages.taskTypeColumnName) },
    { accessor: 'taskInput', Header: intl.formatMessage(messages.taskInputColumnName), Cell: ({ row }: TableCellValue<PendingTask>) => <ObjectCell value={row.original.taskInput} /> },
    { accessor: 'taskId', Header: intl.formatMessage(messages.taskIdColumnName) },
    { accessor: 'requester', Header: intl.formatMessage(messages.requesterColumnName) },
    { accessor: 'taskState', Header: intl.formatMessage(messages.taskStateColumnName) },
    { accessor: 'created', Header: intl.formatMessage(messages.createdColumnName) },
    { accessor: 'taskOutput', Header: intl.formatMessage(messages.taskOutputColumnName), Cell: ({ row }: TableCellValue<PendingTask>) => <ObjectCell value={row.original.taskOutput} /> },
    { accessor: 'durationSec', Header: intl.formatMessage(messages.durationColumnName) },
    { accessor: 'status', Header: intl.formatMessage(messages.statusColumnName) },
    { accessor: 'taskMessage', Header: intl.formatMessage(messages.taskMessageColumnName) },
  ], [intl]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const renderContent = () => {
    if (isPending) {
      return <Skeleton count={3} />;
    }

    if (tasks?.length === 0) {
      return <div className="my-3">{intl.formatMessage(messages.noTasksMessage)}</div>;
    }

    return (
      <DataTable
        columns={tableColumns}
        data={tasks}
        isLoading={isPending}
        RowStatusComponent={() => null}
      />
    );
  };

  return (
    <Collapsible.Advanced
      className="mt-4 pt-4 border-top"
      styling="basic"
    >
      <Collapsible.Trigger
        className="collapsible-trigger d-flex border-0 align-items-center text-decoration-none"
      >
        <div className="d-flex">
          <h3>{intl.formatMessage(messages.pendingTasksTitle)}</h3>
        </div>

        <Collapsible.Visible whenClosed>
          <div className="pl-2 d-flex">
            <Icon src={ExpandMore} />
          </div>
        </Collapsible.Visible>
        <Collapsible.Visible whenOpen>
          <div className="pl-2 d-flex">
            <Icon src={ExpandLess} />
          </div>
        </Collapsible.Visible>
      </Collapsible.Trigger>
      <Collapsible.Body>
        {renderContent() }
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
};

export { PendingTasks };
