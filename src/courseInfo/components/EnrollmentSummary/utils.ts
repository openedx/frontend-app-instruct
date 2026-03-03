export const formatNumberWithCommas = (digit: string | number): string => {
  const numberString = typeof digit === 'number' ? digit.toString() : digit;
  const cleanNumber = numberString.replace(/[,\s]/g, '');
  if (isNaN(Number(cleanNumber))) {
    return numberString;
  }
  return Number(cleanNumber).toLocaleString();
};
