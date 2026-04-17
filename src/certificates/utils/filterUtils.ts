import { CertificateData, CertificateFilter, CertificateStatus, SpecialCase } from '../types';

export const matchesFilter = (item: CertificateData, filter: CertificateFilter): boolean => {
  switch (filter) {
    case CertificateFilter.RECEIVED:
      return item.certificateStatus === CertificateStatus.RECEIVED;
    case CertificateFilter.NOT_RECEIVED:
      return item.certificateStatus === CertificateStatus.NOT_RECEIVED;
    case CertificateFilter.AUDIT_PASSING:
      return item.certificateStatus === CertificateStatus.AUDIT_PASSING;
    case CertificateFilter.AUDIT_NOT_PASSING:
      return item.certificateStatus === CertificateStatus.AUDIT_NOT_PASSING;
    case CertificateFilter.ERROR_STATE:
      return item.certificateStatus === CertificateStatus.ERROR_STATE;
    case CertificateFilter.GRANTED_EXCEPTIONS:
      return item.specialCase === SpecialCase.EXCEPTION;
    case CertificateFilter.INVALIDATED:
      return item.specialCase === SpecialCase.INVALIDATION;
    case CertificateFilter.ALL_LEARNERS:
    default:
      return true;
  }
};

export const matchesSearch = (item: CertificateData, search: string): boolean => {
  if (!search) return true;
  const searchLower = search.toLowerCase();
  return (
    item.username.toLowerCase().includes(searchLower)
    || item.email.toLowerCase().includes(searchLower)
  );
};

export const filterCertificates = (
  data: CertificateData[],
  filter: CertificateFilter,
  search: string,
): CertificateData[] =>
  data.filter((item) => matchesFilter(item, filter) && matchesSearch(item, search));
