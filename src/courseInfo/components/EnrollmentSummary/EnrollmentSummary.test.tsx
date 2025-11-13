import { screen } from '@testing-library/react';
import { EnrollmentSummary } from './EnrollmentSummary';
import { renderWithIntl } from '../../../testUtils';

describe('EnrollmentSummary', () => {
  const mockEnrollmentCounts = {
    total: 5000,
    staffAndAdmins: 25,
    learners: 4975,
    verified: 3500,
    audit: 1475,
  };

  it('displays the enrollment summary title', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    expect(screen.getByRole('heading', { name: /course enrollment/i })).toBeInTheDocument();
  });

  it('displays total enrollment count with proper formatting', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
  });

  it('displays Staff / Admin count when provided', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    expect(screen.getByText('Staff / Admin')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('displays learners count when provided', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    expect(screen.getByText('Learners')).toBeInTheDocument();
    expect(screen.getByText('4,975')).toBeInTheDocument();
  });

  it('displays verified count with svg icon when provided', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('3,500')).toBeInTheDocument();

    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('displays audit count when provided', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    expect(screen.getByText('Audit')).toBeInTheDocument();
    expect(screen.getByText('1,475')).toBeInTheDocument();
  });

  it('does not display Staff / Admin section when not provided', () => {
    const countsWithoutStaff = {
      total: 3000,
      learners: 3000,
      verified: 2000,
      audit: 1000,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={countsWithoutStaff} />);

    expect(screen.queryByText('Staff / Admin')).not.toBeInTheDocument();
    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Learners')).toBeInTheDocument();
  });

  it('does not display learners section when not provided', () => {
    const countsWithoutLearners = {
      total: 500,
      staffAndAdmins: 50,
      verified: 400,
      audit: 50,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={countsWithoutLearners} />);

    expect(screen.queryByText('Learners')).not.toBeInTheDocument();
    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Staff / Admin')).toBeInTheDocument();
  });

  it('does not display verified section when not provided', () => {
    const countsWithoutVerified = {
      total: 2000,
      staffAndAdmins: 20,
      learners: 1980,
      audit: 1980,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={countsWithoutVerified} />);

    expect(screen.queryByText('Verified')).not.toBeInTheDocument();
    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Learners')).toBeInTheDocument();
  });

  it('does not display audit section when not provided', () => {
    const countsWithoutAudit = {
      total: 1500,
      staffAndAdmins: 15,
      learners: 1485,
      verified: 1485,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={countsWithoutAudit} />);

    expect(screen.queryByText('Audit')).not.toBeInTheDocument();
    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('displays only total when other counts are not provided', () => {
    const minimalCounts = { total: 100 };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={minimalCounts} />);

    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.queryByText('Staff / Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Learners')).not.toBeInTheDocument();
    expect(screen.queryByText('Verified')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit')).not.toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const countsWithZeros = {
      total: 0,
      staffAndAdmins: 0,
      learners: 0,
      verified: 0,
      audit: 0,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={countsWithZeros} />);

    // Should still display sections with zero values when provided
    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(1); // Only total should appear with 0
  });

  it('displays enrollment data in proper visual order', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    const allEnrollments = screen.getByText('All Enrollments');
    const staffAndAdmins = screen.getByText('Staff / Admin');
    const learners = screen.getByText('Learners');
    const verified = screen.getByText('Verified');
    const audit = screen.getByText('Audit');

    // Check DOM order
    expect(allEnrollments.compareDocumentPosition(staffAndAdmins) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(staffAndAdmins.compareDocumentPosition(learners) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(learners.compareDocumentPosition(verified) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(verified.compareDocumentPosition(audit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('displays large numbers with proper comma formatting', () => {
    const largeCounts = {
      total: 1234567,
      staffAndAdmins: 1234,
      learners: 1233333,
      verified: 987654,
      audit: 245913,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={largeCounts} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('1,233,333')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
    expect(screen.getByText('245,913')).toBeInTheDocument();
  });

  it('is accessible to screen readers', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    // Main heading should be accessible
    const heading = screen.getByRole('heading', { name: /course enrollment/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();

    // All enrollment information should be visible and accessible
    expect(screen.getByText('All Enrollments')).toBeVisible();
    expect(screen.getByText('Staff / Admin')).toBeVisible();
    expect(screen.getByText('Learners')).toBeVisible();
    expect(screen.getByText('Verified')).toBeVisible();
    expect(screen.getByText('Audit')).toBeVisible();

    // All counts should be visible
    expect(screen.getByText('5,000')).toBeVisible();
    expect(screen.getByText('25')).toBeVisible();
    expect(screen.getByText('4,975')).toBeVisible();
    expect(screen.getByText('3,500')).toBeVisible();
    expect(screen.getByText('1,475')).toBeVisible();
  });

  it('maintains proper heading hierarchy', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Course Enrollment');
  });

  it('displays enrollment counters in horizontal layout', () => {
    const { container } = renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    // Check for horizontal stack layout
    const stackElement = container.querySelector('.d-flex');
    expect(stackElement).toBeInTheDocument();
  });

  it('shows verified enrollment with distinctive icon presentation', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    // Verified section should have both text and icon
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('3,500')).toBeInTheDocument();

    // Should have an SVG icon for verified
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('handles edge case with only verified enrollments', () => {
    const verifiedOnlyCounts = {
      total: 500,
      verified: 500,
    };

    renderWithIntl(<EnrollmentSummary enrollmentCounts={verifiedOnlyCounts} />);

    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getAllByText('500')).toHaveLength(2);

    // Should not show other sections
    expect(screen.queryByText('Staff / Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Learners')).not.toBeInTheDocument();
    expect(screen.queryByText('Audit')).not.toBeInTheDocument();
  });

  it('provides complete enrollment overview for course administrators', () => {
    renderWithIntl(<EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />);

    // Should show comprehensive enrollment data
    expect(screen.getByText('Course Enrollment')).toBeInTheDocument();

    // All major enrollment categories should be visible
    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Staff / Admin')).toBeInTheDocument();
    expect(screen.getByText('Learners')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Audit')).toBeInTheDocument();

    // All counts should be properly formatted and visible
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('4,975')).toBeInTheDocument();
    expect(screen.getByText('3,500')).toBeInTheDocument();
    expect(screen.getByText('1,475')).toBeInTheDocument();
  });
});
