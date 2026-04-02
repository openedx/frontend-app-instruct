import { matchesFilter, matchesSearch, filterCertificates } from './filterUtils';
import { CertificateData, CertificateFilter, CertificateStatus, SpecialCase } from '../types';

describe('filterUtils', () => {
  const mockCertificate: CertificateData = {
    username: 'testuser',
    email: 'testuser@example.com',
    enrollmentTrack: 'verified',
    certificateStatus: CertificateStatus.RECEIVED,
    specialCase: SpecialCase.NONE,
  };

  const mockExceptionCertificate: CertificateData = {
    username: 'exceptionuser',
    email: 'exception@example.com',
    enrollmentTrack: 'verified',
    certificateStatus: CertificateStatus.RECEIVED,
    specialCase: SpecialCase.EXCEPTION,
  };

  const mockInvalidatedCertificate: CertificateData = {
    username: 'invaliduser',
    email: 'invalid@example.com',
    enrollmentTrack: 'audit',
    certificateStatus: CertificateStatus.NOT_RECEIVED,
    specialCase: SpecialCase.INVALIDATION,
  };

  const mockNotReceivedCertificate: CertificateData = {
    username: 'notpassing',
    email: 'notpassing@example.com',
    enrollmentTrack: 'verified',
    certificateStatus: CertificateStatus.NOT_RECEIVED,
    specialCase: SpecialCase.NONE,
  };

  describe('matchesFilter', () => {
    it('returns true for ALL_LEARNERS filter', () => {
      expect(matchesFilter(mockCertificate, CertificateFilter.ALL_LEARNERS)).toBe(true);
      expect(matchesFilter(mockExceptionCertificate, CertificateFilter.ALL_LEARNERS)).toBe(true);
    });

    it('filters certificates with RECEIVED status', () => {
      expect(matchesFilter(mockCertificate, CertificateFilter.RECEIVED)).toBe(true);
      expect(matchesFilter(mockNotReceivedCertificate, CertificateFilter.RECEIVED)).toBe(false);
    });

    it('filters certificates with NOT_RECEIVED status', () => {
      expect(matchesFilter(mockNotReceivedCertificate, CertificateFilter.NOT_RECEIVED)).toBe(true);
      expect(matchesFilter(mockCertificate, CertificateFilter.NOT_RECEIVED)).toBe(false);
    });

    it('filters certificates with GRANTED_EXCEPTIONS special case', () => {
      expect(matchesFilter(mockExceptionCertificate, CertificateFilter.GRANTED_EXCEPTIONS)).toBe(true);
      expect(matchesFilter(mockCertificate, CertificateFilter.GRANTED_EXCEPTIONS)).toBe(false);
    });

    it('filters certificates with INVALIDATED special case', () => {
      expect(matchesFilter(mockInvalidatedCertificate, CertificateFilter.INVALIDATED)).toBe(true);
      expect(matchesFilter(mockCertificate, CertificateFilter.INVALIDATED)).toBe(false);
    });

    it('filters by AUDIT_PASSING status', () => {
      const auditPassingCert: CertificateData = {
        ...mockCertificate,
        certificateStatus: CertificateStatus.AUDIT_PASSING,
      };
      expect(matchesFilter(auditPassingCert, CertificateFilter.AUDIT_PASSING)).toBe(true);
      expect(matchesFilter(mockCertificate, CertificateFilter.AUDIT_PASSING)).toBe(false);
    });

    it('filters by AUDIT_NOT_PASSING status', () => {
      const auditNotPassingCert: CertificateData = {
        ...mockCertificate,
        certificateStatus: CertificateStatus.AUDIT_NOT_PASSING,
      };
      expect(matchesFilter(auditNotPassingCert, CertificateFilter.AUDIT_NOT_PASSING)).toBe(true);
      expect(matchesFilter(mockCertificate, CertificateFilter.AUDIT_NOT_PASSING)).toBe(false);
    });

    it('filters by ERROR_STATE status', () => {
      const errorCert: CertificateData = {
        ...mockCertificate,
        certificateStatus: CertificateStatus.ERROR_STATE,
      };
      expect(matchesFilter(errorCert, CertificateFilter.ERROR_STATE)).toBe(true);
      expect(matchesFilter(mockCertificate, CertificateFilter.ERROR_STATE)).toBe(false);
    });
  });

  describe('matchesSearch', () => {
    it('returns true when search is empty', () => {
      expect(matchesSearch(mockCertificate, '')).toBe(true);
    });

    it('matches username case-insensitively', () => {
      expect(matchesSearch(mockCertificate, 'TESTUSER')).toBe(true);
      expect(matchesSearch(mockCertificate, 'test')).toBe(true);
      expect(matchesSearch(mockCertificate, 'wronguser')).toBe(false);
    });

    it('matches email case-insensitively', () => {
      expect(matchesSearch(mockCertificate, 'TESTUSER@EXAMPLE.COM')).toBe(true);
      expect(matchesSearch(mockCertificate, 'example')).toBe(true);
      expect(matchesSearch(mockCertificate, 'wrongemail')).toBe(false);
    });

    it('matches partial username', () => {
      expect(matchesSearch(mockCertificate, 'test')).toBe(true);
      expect(matchesSearch(mockCertificate, 'user')).toBe(true);
    });

    it('matches partial email', () => {
      expect(matchesSearch(mockCertificate, '@example')).toBe(true);
      expect(matchesSearch(mockCertificate, '.com')).toBe(true);
    });
  });

  describe('filterCertificates', () => {
    const mockData: CertificateData[] = [
      mockCertificate,
      mockExceptionCertificate,
      mockInvalidatedCertificate,
      mockNotReceivedCertificate,
    ];

    it('filters by both filter and search criteria', () => {
      const result = filterCertificates(mockData, CertificateFilter.RECEIVED, 'testuser');
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('testuser');
    });

    it('returns all when filter is ALL_LEARNERS and search is empty', () => {
      const result = filterCertificates(mockData, CertificateFilter.ALL_LEARNERS, '');
      expect(result).toHaveLength(4);
    });

    it('filters only by filter when search is empty', () => {
      const result = filterCertificates(mockData, CertificateFilter.GRANTED_EXCEPTIONS, '');
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('exceptionuser');
    });

    it('filters only by search when filter is ALL_LEARNERS', () => {
      const result = filterCertificates(mockData, CertificateFilter.ALL_LEARNERS, 'exception');
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('exceptionuser');
    });

    it('returns empty array when no matches', () => {
      const result = filterCertificates(mockData, CertificateFilter.RECEIVED, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('filters by NOT_RECEIVED status', () => {
      const result = filterCertificates(mockData, CertificateFilter.NOT_RECEIVED, '');
      expect(result).toHaveLength(2);
    });

    it('combines multiple filter criteria correctly', () => {
      const result = filterCertificates(mockData, CertificateFilter.INVALIDATED, 'invalid');
      expect(result).toHaveLength(1);
      expect(result[0].specialCase).toBe(SpecialCase.INVALIDATION);
    });
  });
});
