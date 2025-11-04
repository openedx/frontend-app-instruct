import { appId } from '../../constants';

export const dateExtensionsQueryKeys = {
  all: [appId, 'dateExtensions'] as const,
  byCourse: (courseId: string) => [appId, 'dateExtensions', courseId] as const,
};
