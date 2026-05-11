export const isForbiddenError = (error: any): boolean => {
  return error?.response?.status === 403 || error?.status === 403;
};

export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.status === 401;
};
