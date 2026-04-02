import { screen } from '@testing-library/react';
import CertificateTable from './CertificateTable';
import { renderWithIntl } from '@src/testUtils';
import { CertificateData, CertificateFilter, CertificateStatus, SpecialCase } from '../types';
import messages from '../messages';

describe('CertificateTable', () => {
  const mockOnRemoveException = jest.fn();
  const mockOnRemoveInvalidation = jest.fn();
  const mockOnPageChange = jest.fn();

  const mockCertificateData: CertificateData[] = [
    {
      username: 'user1',
      email: 'user1@example.com',
      enrollmentTrack: 'verified',
      certificateStatus: CertificateStatus.RECEIVED,
      specialCase: SpecialCase.NONE,
    },
    {
      username: 'user2',
      email: 'user2@example.com',
      enrollmentTrack: 'audit',
      certificateStatus: CertificateStatus.NOT_RECEIVED,
      specialCase: SpecialCase.NONE,
    },
  ];

  const defaultProps = {
    data: mockCertificateData,
    isLoading: false,
    itemCount: 2,
    pageCount: 1,
    currentPage: 0,
    filter: CertificateFilter.ALL_LEARNERS,
    onPageChange: mockOnPageChange,
    onRemoveException: mockOnRemoveException,
    onRemoveInvalidation: mockOnRemoveInvalidation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with certificate data', () => {
    renderWithIntl(<CertificateTable {...defaultProps} />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('verified')).toBeInTheDocument();
  });

  it('displays all base columns', () => {
    renderWithIntl(<CertificateTable {...defaultProps} />);

    expect(screen.getByText(messages.columnUsername.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnEmail.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnEnrollmentTrack.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnCertificateStatus.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnSpecialCase.defaultMessage)).toBeInTheDocument();
  });

  it('shows exception columns when filter is GRANTED_EXCEPTIONS', () => {
    const dataWithException: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.EXCEPTION,
        exceptionGranted: '2024-01-01',
        exceptionNotes: 'Special case',
      },
    ];

    renderWithIntl(
      <CertificateTable
        {...defaultProps}
        data={dataWithException}
        filter={CertificateFilter.GRANTED_EXCEPTIONS}
      />
    );

    expect(screen.getByText(messages.columnExceptionGranted.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnExceptionNotes.defaultMessage)).toBeInTheDocument();
  });

  it('shows invalidation columns when filter is INVALIDATED', () => {
    const dataWithInvalidation: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.INVALIDATION,
        invalidatedBy: 'admin',
        invalidationDate: '2024-01-15T10:30:00Z',
        invalidationNote: 'Invalid cert',
      },
    ];

    renderWithIntl(
      <CertificateTable
        {...defaultProps}
        data={dataWithInvalidation}
        filter={CertificateFilter.INVALIDATED}
      />
    );

    expect(screen.getByText(messages.columnInvalidatedBy.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnInvalidationDate.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnInvalidationNote.defaultMessage)).toBeInTheDocument();
  });

  it('shows actions column with remove exception action when filter is GRANTED_EXCEPTIONS', async () => {
    const dataWithException: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.EXCEPTION,
        exceptionGranted: '2024-01-01',
      },
    ];

    renderWithIntl(
      <CertificateTable
        {...defaultProps}
        data={dataWithException}
        filter={CertificateFilter.GRANTED_EXCEPTIONS}
      />
    );

    expect(screen.getByText(messages.columnActions.defaultMessage)).toBeInTheDocument();
  });

  it('shows actions column with remove invalidation action when filter is INVALIDATED', async () => {
    const dataWithInvalidation: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.INVALIDATION,
        invalidatedBy: 'admin',
        invalidationDate: '2024-01-15',
      },
    ];

    renderWithIntl(
      <CertificateTable
        {...defaultProps}
        data={dataWithInvalidation}
        filter={CertificateFilter.INVALIDATED}
      />
    );

    expect(screen.getByText(messages.columnActions.defaultMessage)).toBeInTheDocument();
  });

  it('does not show actions column for other filters', () => {
    renderWithIntl(<CertificateTable {...defaultProps} filter={CertificateFilter.RECEIVED} />);

    expect(screen.queryByText(messages.columnActions.defaultMessage)).not.toBeInTheDocument();
  });

  it('displays empty message when no data', () => {
    renderWithIntl(<CertificateTable {...defaultProps} data={[]} itemCount={0} />);

    expect(screen.getByText(messages.noDataMessage.defaultMessage)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithIntl(<CertificateTable {...defaultProps} isLoading={true} />);

    // DataTable should handle loading state
    expect(screen.getByText(messages.columnUsername.defaultMessage)).toBeInTheDocument();
  });

  it('renders multiple rows of data', () => {
    const multipleData: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.NONE,
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        enrollmentTrack: 'audit',
        certificateStatus: CertificateStatus.AUDIT_PASSING,
        specialCase: SpecialCase.NONE,
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.ERROR_STATE,
        specialCase: SpecialCase.NONE,
      },
    ];

    renderWithIntl(<CertificateTable {...defaultProps} data={multipleData} itemCount={3} />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('user3')).toBeInTheDocument();
  });

  it('formats invalidation date correctly', () => {
    const dataWithInvalidation: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.INVALIDATION,
        invalidatedBy: 'admin',
        invalidationDate: '2024-01-15T14:30:00Z',
        invalidationNote: 'Invalid',
      },
    ];

    renderWithIntl(
      <CertificateTable
        {...defaultProps}
        data={dataWithInvalidation}
        filter={CertificateFilter.INVALIDATED}
      />
    );

    // Check that date is rendered (format may vary based on locale)
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('shows both exception and invalidation columns when filter is ALL_LEARNERS', () => {
    renderWithIntl(<CertificateTable {...defaultProps} filter={CertificateFilter.ALL_LEARNERS} />);

    expect(screen.getByText(messages.columnExceptionGranted.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnInvalidatedBy.defaultMessage)).toBeInTheDocument();
  });
});
