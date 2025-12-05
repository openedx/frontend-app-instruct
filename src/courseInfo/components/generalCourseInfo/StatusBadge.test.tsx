import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders status text', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('applies success variant for active status', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('active');
    expect(badge).toHaveClass('badge-success');
  });

  it('applies light variant for archived status', () => {
    render(<StatusBadge status="archived" />);
    const badge = screen.getByText('archived');
    expect(badge).toHaveClass('badge-light');
  });

  it('applies warning variant for upcoming status', () => {
    render(<StatusBadge status="upcoming" />);
    const badge = screen.getByText('upcoming');
    expect(badge).toHaveClass('badge-warning');
  });

  it('applies light variant for unknown status', () => {
    render(<StatusBadge status="unknown" />);
    const badge = screen.getByText('unknown');
    expect(badge).toHaveClass('badge-light');
  });

  it('handles case insensitive status matching', () => {
    render(<StatusBadge status="ACTIVE" />);
    const badge = screen.getByText('ACTIVE');
    expect(badge).toHaveClass('badge-success');
  });

  it('applies correct CSS classes', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('active');
    expect(badge).toHaveClass('py-1.5', 'px-3', 'x-small', 'font-weight-normal');
  });
});
