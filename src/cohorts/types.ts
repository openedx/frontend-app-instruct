import { assignmentTypes } from './constants';

export type AssignmentType = typeof assignmentTypes[keyof typeof assignmentTypes];

export interface CohortData {
  id: string,
  name: string,
  assignmentType: AssignmentType,
  contentGroupOption?: string,
  groupId: number | null,
  userPartitionId: number | null,
}
