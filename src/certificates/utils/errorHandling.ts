export interface ApiError {
  response?: {
    data?: {
      error?: string,
    },
  },
  message?: string,
}

export const getErrorMessage = (error: ApiError, fallbackMessage: string): string =>
  error?.response?.data?.error || error?.message || fallbackMessage;

export const parseLearnersCount = (learners: string): number =>
  learners.split(/[\n,]/).filter((l) => l.trim()).length;
