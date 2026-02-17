import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerateReports } from './GenerateReports';
import { renderWithIntl } from '@src/testUtils';

const mockOnGenerateReport = jest.fn();
const mockOnGenerateProblemResponsesReport = jest.fn();

const renderComponent = (isGenerating = false, problemResponsesError?: string) => renderWithIntl(
  <GenerateReports
    onGenerateReport={mockOnGenerateReport}
    onGenerateProblemResponsesReport={mockOnGenerateProblemResponsesReport}
    isGenerating={isGenerating}
    problemResponsesError={problemResponsesError}
  />
);

describe('GenerateReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with all tabs', () => {
    renderComponent();

    expect(screen.getByText('Generate Reports')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Enrollment Reports' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Grading Reports' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Open Response Reports' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Certificate Reports' })).toBeInTheDocument();
  });

  describe('Enrollment Reports Tab', () => {
    it('should render all enrollment report sections', () => {
      renderComponent();

      expect(screen.getByText('Enrolled Students Report')).toBeInTheDocument();
      expect(screen.getByText('Pending Enrollments Report')).toBeInTheDocument();
      expect(screen.getByText('Pending Activations Report')).toBeInTheDocument();
      expect(screen.getByText('Anonymized Student IDs Report')).toBeInTheDocument();
    });

    it('should call onGenerateReport with enrolled_students when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('enrolled_students');
    });

    it('should call onGenerateReport with pending_enrollments when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: 'Generate Pending Enrollments Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('pending_enrollments');
    });

    it('should call onGenerateReport with pending_activations when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: 'Generate Pending Activations Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('pending_activations');
    });

    it('should call onGenerateReport with anonymized_student_ids when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: 'Generate Anonymized Student IDs Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('anonymized_student_ids');
    });
  });

  describe('Grading Reports Tab', () => {
    it('should render all grading report sections', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Grading Reports' });
      await user.click(tab);

      expect(screen.getByText('Grade Report')).toBeInTheDocument();
      expect(screen.getByText('Problem Grade Report')).toBeInTheDocument();
    });

    it('should call onGenerateReport with grade when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Grading Reports' });
      await user.click(tab);

      const button = screen.getByRole('button', { name: 'Generate Grade Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('grade');
    });

    it('should call onGenerateReport with problem_grade when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Grading Reports' });
      await user.click(tab);

      const button = screen.getByRole('button', { name: 'Generate Problem Grade Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('problem_grade');
    });
  });

  describe('Problem Response Reports Tab', () => {
    it('should render all problem response report sections', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      expect(screen.getByText('ORA Summary Report')).toBeInTheDocument();
      expect(screen.getByText('ORA Data Report')).toBeInTheDocument();
      expect(screen.getByText('Submission Files Archive')).toBeInTheDocument();
      expect(screen.getByText('Problem Responses Report')).toBeInTheDocument();
    });

    it('should call onGenerateReport with ora2_summary when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      const button = screen.getByRole('button', { name: 'Generate ORA Summary Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('ora2_summary');
    });

    it('should call onGenerateReport with ora2_data when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      const button = screen.getByRole('button', { name: 'Generate ORA Data Report' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('ora2_data');
    });

    it('should call onGenerateReport with ora2_submission_files when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      const button = screen.getByRole('button', { name: 'Generate Submission Files Archive' });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('ora2_submission_files');
    });

    it('should call onGenerateProblemResponsesReport with undefined when no problem location is provided', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      const button = screen.getByRole('button', { name: 'Generate Problem Report' });
      await user.click(button);

      expect(mockOnGenerateProblemResponsesReport).toHaveBeenCalledWith(undefined);
    });

    it('should call onGenerateProblemResponsesReport with problem location when provided', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      const input = screen.getByPlaceholderText('Problem location');
      await user.type(input, 'block-v1:test');

      const button = screen.getByRole('button', { name: 'Generate Problem Report' });
      await user.click(button);

      expect(mockOnGenerateProblemResponsesReport).toHaveBeenCalledWith('block-v1:test');
    });
  });

  describe('Certificate Reports Tab', () => {
    it('should render certificate report section', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: 'Certificate Reports' });
      await user.click(tab);

      expect(screen.getByText('Issued Certificates')).toBeInTheDocument();
    });
  });

  describe('isGenerating state', () => {
    it('should disable all buttons when isGenerating is true', () => {
      renderComponent(true);

      const buttons = screen.getAllByRole('button').filter(button => button.getAttribute('type') !== 'button' || button.textContent?.includes('Generate'));
      buttons.forEach(button => {
        if (button.textContent?.includes('Generate')) {
          expect(button).toBeDisabled();
        }
      });
    });

    it('should enable all buttons when isGenerating is false', () => {
      renderComponent(false);

      const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('problemResponsesError', () => {
    it('should display validation error message in the problem responses section', async () => {
      const user = userEvent.setup();
      renderComponent(false, 'Invalid problem location');

      const tab = screen.getByRole('tab', { name: 'Open Response Reports' });
      await user.click(tab);

      expect(screen.getByText('Invalid problem location')).toBeInTheDocument();
    });
  });
});
