import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  pendingTasksTitle: {
    id: 'instruct.pendingTasks.section.title',
    defaultMessage: 'Pending Tasks',
    description: 'Title for the pending tasks section',
  },
  noTasksMessage: {
    id: 'instruct.pendingTasks.section.noTasks',
    defaultMessage: 'No tasks currently running.',
    description: 'Message displayed when there are no pending tasks',
  },
  taskTypeColumnName: {
    id: 'instruct.pendingTasks.table.column.taskType',
    defaultMessage: 'Task Type',
    description: 'Column name for task type in pending tasks table',
  },
  taskInputColumnName: {
    id: 'instruct.pendingTasks.table.column.taskInput',
    defaultMessage: 'Task Input',
    description: 'Column name for task input in pending tasks table',
  },
  taskIdColumnName: {
    id: 'instruct.pendingTasks.table.column.taskId',
    defaultMessage: 'Task ID',
    description: 'Column name for task ID in pending tasks table',
  },
  requesterColumnName: {
    id: 'instruct.pendingTasks.table.column.requester',
    defaultMessage: 'Requester',
    description: 'Column name for requester in pending tasks table',
  },
  taskStateColumnName: {
    id: 'instruct.pendingTasks.table.column.taskState',
    defaultMessage: 'Task State',
    description: 'Column name for task state in pending tasks table',
  },
  createdColumnName: {
    id: 'instruct.pendingTasks.table.column.created',
    defaultMessage: 'Created',
    description: 'Column name for created date in pending tasks table',
  },
  taskOutputColumnName: {
    id: 'instruct.pendingTasks.table.column.taskOutput',
    defaultMessage: 'Task Output',
    description: 'Column name for task output in pending tasks table',
  },
  durationColumnName: {
    id: 'instruct.pendingTasks.table.column.duration',
    defaultMessage: 'Duration (sec)',
    description: 'Column name for duration in pending tasks table',
  },
  statusColumnName: {
    id: 'instruct.pendingTasks.table.column.status',
    defaultMessage: 'Status',
    description: 'Column name for status in pending tasks table',
  },
  taskMessageColumnName: {
    id: 'instruct.pendingTasks.table.column.taskMessage',
    defaultMessage: 'Task Message',
    description: 'Column name for task message in pending tasks table',
  },
});

export { messages };
