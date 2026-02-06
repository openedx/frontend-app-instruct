import { render, screen } from '@testing-library/react';
import SelectGradedSubsection from './SelectGradedSubsection';
import { useGradedSubsections } from '../data/apiHook';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:edX+DemoX+Demo_Course' }),
}));

jest.mock('../data/apiHook', () => ({
  useGradedSubsections: jest.fn(),
}));

describe('SelectGradedSubsection', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label when provided', () => {
    (useGradedSubsections as jest.Mock).mockReturnValue({ data: { items: [] } });
    render(
      <SelectGradedSubsection
        label="Select Subsection"
        placeholder="Choose..."
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Select Subsection')).toBeInTheDocument();
  });

  it('renders placeholder as first option', () => {
    (useGradedSubsections as jest.Mock).mockReturnValue({ data: { items: [] } });
    render(
      <SelectGradedSubsection
        placeholder="Choose..."
        onChange={mockOnChange}
      />
    );
    expect(screen.getByRole('option', { name: 'Choose...' })).toBeInTheDocument();
  });

  it('renders options from data', () => {
    const items = [
      { displayName: 'Quiz 1', subsectionId: 'sub1' },
      { displayName: 'Quiz 2', subsectionId: 'sub2' },
    ];
    (useGradedSubsections as jest.Mock).mockReturnValue({ data: { items } });
    render(
      <SelectGradedSubsection
        placeholder="Choose..."
        onChange={mockOnChange}
      />
    );
    expect(screen.getByRole('option', { name: 'Quiz 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Quiz 2' })).toBeInTheDocument();
  });

  it('calls onChange when option is selected', async () => {
    const items = [
      { displayName: 'Quiz 1', subsectionId: 'sub1' },
    ];
    (useGradedSubsections as jest.Mock).mockReturnValue({ data: { items } });
    render(
      <SelectGradedSubsection
        placeholder="Choose..."
        onChange={mockOnChange}
      />
    );
    const user = userEvent.setup();
    await user.selectOptions(screen.getByRole('combobox'), 'sub1');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders without label', () => {
    (useGradedSubsections as jest.Mock).mockReturnValue({ data: { items: [] } });
    render(
      <SelectGradedSubsection
        placeholder="Choose..."
        onChange={mockOnChange}
      />
    );
    expect(screen.queryByText('Select Subsection')).not.toBeInTheDocument();
  });
});
