import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionCard from './ActionCard';

describe('ActionCard', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const defaultProps = {
    title: 'Test Card Title',
    description: 'This is a test card description',
    buttonLabel: 'Click Me',
    onButtonClick: jest.fn(),
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render title and description correctly', () => {
    render(<ActionCard {...defaultProps} />);
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test card description')).toBeInTheDocument();
  });

  it('should render button with correct label and call onClick when clicked', async () => {
    const mockOnClick = jest.fn();
    render(
      <ActionCard
        {...defaultProps}
        onButtonClick={mockOnClick}
      />
    );
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    await user.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should disable button when isLoading is true', () => {
    render(
      <ActionCard
        {...defaultProps}
        isLoading={true}
      />
    );
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeDisabled();
  });

  it('should render custom action instead of default button when provided', () => {
    const CustomAction = () => (
      <div>
        <button>Custom Button 1</button>
        <button>Custom Button 2</button>
      </div>
    );
    render(
      <ActionCard
        {...defaultProps}
        customAction={<CustomAction />}
      />
    );
    expect(screen.getByText('Custom Button 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Button 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Click Me' })).not.toBeInTheDocument();
  });
});
