import { render, screen } from '@testing-library/react';
import { Verified, Person, Group } from '@openedx/paragon/icons';
import { EnrollmentCounter } from './';

describe('EnrollmentCounter', () => {
  it('displays the enrollment label and count', () => {
    render(
      <EnrollmentCounter
        label="Total Students"
        count="1500"
      />
    );

    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  it('formats numbers with thousands separators', () => {
    render(
      <EnrollmentCounter
        label="All Enrollments"
        count="3640"
      />
    );

    expect(screen.getByText('All Enrollments')).toBeInTheDocument();
    expect(screen.getByText('3,640')).toBeInTheDocument();
  });

  it('displays and checks an SVG icon when provided', () => {
    render(
      <EnrollmentCounter
        label="Verified Students"
        count="410"
        icon={<Verified />}
      />
    );

    expect(screen.getByText('Verified Students')).toBeInTheDocument();
    expect(screen.getByText('410')).toBeInTheDocument();

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('renders without an icon when not provided', () => {
    render(
      <EnrollmentCounter
        label="Audit Students"
        count="3230"
      />
    );

    expect(screen.getByText('Audit Students')).toBeInTheDocument();
    expect(screen.getByText('3,230')).toBeInTheDocument();

    // Should not have any icon elements
    const svgElement = document.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });

  it('displays different types of enrollment data correctly', () => {
    const { rerender } = render(
      <EnrollmentCounter
        label="Staff and Admins"
        count="10"
      />
    );

    expect(screen.getByText('Staff and Admins')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    rerender(
      <EnrollmentCounter
        label="Learners"
        count="3630"
        icon={<Person />}
      />
    );

    expect(screen.getByText('Learners')).toBeInTheDocument();
    expect(screen.getByText('3,630')).toBeInTheDocument();
  });

  it('handles large numbers correctly with comma formatting', () => {
    render(
      <EnrollmentCounter
        label="Total Enrollments"
        count="1234567"
      />
    );

    expect(screen.getByText('Total Enrollments')).toBeInTheDocument();
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('handles small numbers without unnecessary formatting', () => {
    render(
      <EnrollmentCounter
        label="Admin Users"
        count="1"
      />
    );

    expect(screen.getByText('Admin Users')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays numbers in the hundreds correctly', () => {
    render(
      <EnrollmentCounter
        label="Premium Users"
        count="150"
      />
    );

    expect(screen.getByText('Premium Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('maintains proper visual hierarchy with label above count', () => {
    render(
      <EnrollmentCounter
        label="Total Active"
        count="999"
      />
    );

    const label = screen.getByText('Total Active');
    const count = screen.getByText('999');

    // Label should appear before count in the DOM
    expect(label.compareDocumentPosition(count) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('handles zero count correctly', () => {
    render(
      <EnrollmentCounter
        label="Pending Approvals"
        count="0"
      />
    );

    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('works with different paragon icon types', () => {
    const { rerender } = render(
      <EnrollmentCounter
        label="Verified Users"
        count="100"
        icon={<Verified />}
      />
    );

    expect(screen.getByText('Verified Users')).toBeInTheDocument();
    let svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    rerender(
      <EnrollmentCounter
        label="Regular Users"
        count="200"
        icon={<Group />}
      />
    );

    expect(screen.getByText('Regular Users')).toBeInTheDocument();
    svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('is accessible to screen readers', () => {
    render(
      <EnrollmentCounter
        label="Verified Certificates"
        count="125"
        icon={<Verified />}
      />
    );

    // Text should be accessible and visible
    expect(screen.getByText('Verified Certificates')).toBeVisible();
    expect(screen.getByText('125')).toBeVisible();

    // Content should be readable by screen readers
    const labelElement = screen.getByText('Verified Certificates');
    const countElement = screen.getByText('125');

    expect(labelElement).not.toHaveAttribute('aria-hidden');
    expect(countElement).not.toHaveAttribute('aria-hidden');
  });

  it('displays complete enrollment information as a cohesive unit', () => {
    render(
      <EnrollmentCounter
        label="Premium Members"
        count="1250"
        icon={<Verified />}
      />
    );

    // All elements should be present and visible together
    expect(screen.getByText('Premium Members')).toBeVisible();
    expect(screen.getByText('1,250')).toBeVisible();

    // The container should hold all related information
    const container = screen.getByText('Premium Members').closest('div');
    expect(container).toContainElement(screen.getByText('1,250'));
  });

  it('handles various enrollment scenarios users might see', () => {
    const scenarios = [
      { label: 'All Enrollments', count: '3640' },
      { label: 'Staff and Admins', count: '10' },
      { label: 'Learners', count: '3630' },
      { label: 'Verified', count: '410' },
      { label: 'Audit', count: '3230' },
    ];

    scenarios.forEach(({ label, count }) => {
      const { unmount } = render(
        <EnrollmentCounter
          label={label}
          count={count}
          icon={label === 'Verified' ? <Verified /> : undefined}
        />
      );

      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(count === '3640' ? '3,640'
        : count === '3630' ? '3,630'
          : count === '3230' ? '3,230' : count)).toBeInTheDocument();

      if (label === 'Verified') {
        const svgElement = document.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
      }

      unmount();
    });
  });

  it('provides clear visual distinction between label and count', () => {
    render(
      <EnrollmentCounter
        label="Course Participants"
        count="2500"
      />
    );

    const label = screen.getByText('Course Participants');
    const count = screen.getByText('2,500');

    // Both should be visible but with different styling
    expect(label).toBeVisible();
    expect(count).toBeVisible();

    // They should be in separate elements
    expect(label.tagName).toBe('P');
    expect(count.tagName).toBe('P');
  });

  it('handles edge case of very large numbers', () => {
    render(
      <EnrollmentCounter
        label="Global Users"
        count="10000000"
      />
    );

    expect(screen.getByText('Global Users')).toBeInTheDocument();
    expect(screen.getByText('10,000,000')).toBeInTheDocument();
  });

  it('displays icon and text content together when both are provided', () => {
    render(
      <EnrollmentCounter
        label="Certified Learners"
        count="850"
        icon={<Verified />}
      />
    );

    const container = screen.getByText('Certified Learners').closest('div');

    // Should contain both text elements and icon
    expect(container).toContainElement(screen.getByText('Certified Learners'));
    expect(container).toContainElement(screen.getByText('850'));

    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });
});
