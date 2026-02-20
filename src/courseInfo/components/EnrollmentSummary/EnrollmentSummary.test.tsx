import { screen } from '@testing-library/react';
import { EnrollmentSummary } from './EnrollmentSummary';
import { renderWithIntl } from '../../../testUtils';
import { useCourseInfo } from '@src/data/apiHook';
import messages from './messages';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    courseId: 'course-v1:edX+DemoX+Demo_Course',
  }),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
}));

const mockCounter = {
  enrollmentCounts: {
    total: 5000,
    verified: 3500,
    audit: 1500,
  },
  staffCount: 25,
  learnerCount: 4975,
};

describe('EnrollmentSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays the enrollment summary title', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByRole('heading', { name: /course enrollment/i })).toBeInTheDocument();
  });

  it('displays total enrollment count with proper formatting', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);
    screen.debug();

    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCounter.enrollmentCounts.total.toLocaleString())).toBeInTheDocument();
  });

  it('displays Staff / Admin count when provided', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(messages.staffAndAdminsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCounter.staffCount.toLocaleString())).toBeInTheDocument();
  });

  it('displays learners count when provided', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(messages.learnersLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCounter.learnerCount.toLocaleString())).toBeInTheDocument();
  });

  it('displays verified count with svg icon when provided', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(messages.verified.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCounter.enrollmentCounts.verified.toLocaleString())).toBeInTheDocument();

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('displays audit count when provided', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(messages.audit.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCounter.enrollmentCounts.audit.toLocaleString())).toBeInTheDocument();
  });

  it('does not display verified section when not provided', () => {
    const countsWithoutVerified = {
      total: 2000,
      audit: 2000,
    };

    (useCourseInfo as jest.Mock).mockReturnValue({
      data: { enrollmentCounts: countsWithoutVerified, staffCount: 20, learnerCount: 1980 },
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    expect(screen.queryByText(messages.verified.defaultMessage)).not.toBeInTheDocument();
    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.learnersLabel.defaultMessage)).toBeInTheDocument();
  });

  it('does not display audit section when not provided', () => {
    const countsWithoutAudit = {
      total: 1500,
      verified: 1500,
    };

    (useCourseInfo as jest.Mock).mockReturnValue({
      data: { enrollmentCounts: countsWithoutAudit, staffCount: 15, learnerCount: 1485 },
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    expect(screen.queryByText(messages.audit.defaultMessage)).not.toBeInTheDocument();
    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.verified.defaultMessage)).toBeInTheDocument();
  });

  it('displays only total when other counts are not provided', () => {
    const minimalCounts = { total: 100 };
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: { enrollmentCounts: minimalCounts, staffCount: 0, learnerCount: 0 },
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(minimalCounts.total.toLocaleString())).toBeInTheDocument();
    expect(screen.queryByText(messages.verified.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.audit.defaultMessage)).not.toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const countsWithZeros = {
      total: 0,
      verified: 0,
      audit: 0,
    };

    (useCourseInfo as jest.Mock).mockReturnValue({
      data: { enrollmentCounts: countsWithZeros, staffCount: 0, learnerCount: 0 },
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    // Should still display sections with zero values when provided
    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(5);
  });

  it('displays enrollment data in proper visual order', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    const allEnrollments = screen.getByText(messages.allEnrollmentsLabel.defaultMessage);
    const staffAndAdmins = screen.getByText(messages.staffAndAdminsLabel.defaultMessage);
    const learners = screen.getByText(messages.learnersLabel.defaultMessage);
    const verified = screen.getByText(messages.verified.defaultMessage);
    const audit = screen.getByText(messages.audit.defaultMessage);

    // Check DOM order
    expect(allEnrollments.compareDocumentPosition(staffAndAdmins) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(staffAndAdmins.compareDocumentPosition(learners) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(learners.compareDocumentPosition(verified) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(verified.compareDocumentPosition(audit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('displays large numbers with proper comma formatting', () => {
    const largeCounts = {
      enrollmentCounts: {
        total: 1234567,
        verified: 987654,
        audit: 245913,
      },
      staffCount: 1234,
      learnerCount: 1233333,
    };
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: largeCounts,
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(largeCounts.enrollmentCounts.total.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(largeCounts.enrollmentCounts.verified.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(largeCounts.enrollmentCounts.audit.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(largeCounts.staffCount.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(largeCounts.learnerCount.toLocaleString())).toBeInTheDocument();
  });

  it('is accessible to screen readers', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    // Main heading should be accessible
    const heading = screen.getByRole('heading', { name: /course enrollment/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();

    // All enrollment information should be visible and accessible
    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeVisible();
    expect(screen.getByText(messages.staffAndAdminsLabel.defaultMessage)).toBeVisible();
    expect(screen.getByText(messages.learnersLabel.defaultMessage)).toBeVisible();
    expect(screen.getByText(messages.verified.defaultMessage)).toBeVisible();
    expect(screen.getByText(messages.audit.defaultMessage)).toBeVisible();

    // All counts should be visible
    expect(screen.getByText(mockCounter.enrollmentCounts.total.toLocaleString())).toBeVisible();
    expect(screen.getByText(mockCounter.enrollmentCounts.verified.toLocaleString())).toBeVisible();
    expect(screen.getByText(mockCounter.enrollmentCounts.audit.toLocaleString())).toBeVisible();
    expect(screen.getByText(mockCounter.staffCount.toLocaleString())).toBeVisible();
    expect(screen.getByText(mockCounter.learnerCount.toLocaleString())).toBeVisible();
  });

  it('maintains proper heading hierarchy', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Course Enrollment');
  });

  it('displays enrollment counters in horizontal layout', () => {
    const { container } = renderWithIntl(<EnrollmentSummary />);

    // Check for horizontal stack layout
    const stackElement = container.querySelector('.d-flex');
    expect(stackElement).toBeInTheDocument();
  });

  it('shows verified enrollment with distinctive icon presentation', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    // Verified section should have both text and icon
    expect(screen.getByText(messages.verified.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCounter.enrollmentCounts.verified.toLocaleString())).toBeInTheDocument();

    // Should have an SVG icon for verified
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('handles edge case with only verified enrollments', () => {
    const verifiedOnlyCounts = {
      enrollmentCounts: {
        total: 500,
        verified: 500,
      },
      staffCount: 0,
      learnerCount: 0,
    };

    (useCourseInfo as jest.Mock).mockReturnValue({
      data: verifiedOnlyCounts,
      isLoading: false,
    });

    renderWithIntl(<EnrollmentSummary />);

    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.verified.defaultMessage)).toBeInTheDocument();
    expect(screen.getAllByText(verifiedOnlyCounts.enrollmentCounts.verified.toLocaleString())).toHaveLength(2);

    // Should not show other sections
    expect(screen.queryByText(messages.audit.defaultMessage)).not.toBeInTheDocument();
  });

  it('provides complete enrollment overview for course administrators', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: mockCounter,
      isLoading: false,
    });
    renderWithIntl(<EnrollmentSummary />);

    // Should show comprehensive enrollment data
    expect(screen.getByText(messages.enrollmentSummaryTitle.defaultMessage)).toBeInTheDocument();

    // All major enrollment categories should be visible
    expect(screen.getByText(messages.allEnrollmentsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.staffAndAdminsLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.learnersLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.verified.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.audit.defaultMessage)).toBeInTheDocument();

    // All counts should be properly formatted and visible
    expect(screen.getByText(mockCounter.enrollmentCounts.total.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(mockCounter.staffCount.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(mockCounter.learnerCount.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(mockCounter.enrollmentCounts.verified.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(mockCounter.enrollmentCounts.audit.toLocaleString())).toBeInTheDocument();
  });
});
