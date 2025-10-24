export const formatNumberWithCommas = (numberString: string): string => {
  const cleanNumber = numberString.replace(/[,\s]/g, '');
  if (isNaN(Number(cleanNumber))) {
    return numberString;
  }
  return Number(cleanNumber).toLocaleString('en-US');
};
