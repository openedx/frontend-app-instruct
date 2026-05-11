import { render } from '@testing-library/react';
import ForbiddenErrorObserver from './ForbiddenErrorObserver';
import { useCourseInfo } from '@src/data/apiHook';
import { useForbiddenError } from '@src/providers/ForbiddenErrorProvider';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:edX+DemoX+Demo_Course' }),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
  isForbiddenError: jest.requireActual('@src/data/apiHook').isForbiddenError,
  isUnauthorizedError: jest.requireActual('@src/data/apiHook').isUnauthorizedError,
}));

jest.mock('@src/providers/ForbiddenErrorProvider', () => ({
  useForbiddenError: jest.fn(),
}));

const mockSetErrorType = jest.fn();
const mockSetLoading = jest.fn();

describe('ForbiddenErrorObserver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useForbiddenError as jest.Mock).mockReturnValue({
      setErrorType: mockSetErrorType,
      setLoading: mockSetLoading,
    });
  });

  it('renders nothing', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: false, error: null });

    const { container } = render(<ForbiddenErrorObserver />);
    expect(container).toBeEmptyDOMElement();
  });

  it('sets loading state when query is loading', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: true, error: null });

    render(<ForbiddenErrorObserver />);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetErrorType).toHaveBeenCalledWith(null);
  });

  it('sets errorType to forbidden on 403 error', () => {
    const error = { response: { status: 403 } };
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: false, error });

    render(<ForbiddenErrorObserver />);

    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockSetErrorType).toHaveBeenCalledWith('forbidden');
  });

  it('sets errorType to unauthorized on 401 error', () => {
    const error = { response: { status: 401 } };
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: false, error });

    render(<ForbiddenErrorObserver />);

    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockSetErrorType).toHaveBeenCalledWith('unauthorized');
  });

  it('clears errorType when there is no error', () => {
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: false, error: null });

    render(<ForbiddenErrorObserver />);

    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockSetErrorType).toHaveBeenCalledWith(null);
  });

  it('sets errorType to generic for non-401/403 errors', () => {
    const error = { response: { status: 500 } };
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: false, error });

    render(<ForbiddenErrorObserver />);

    expect(mockSetErrorType).toHaveBeenCalledWith('generic');
  });

  it('handles error with status directly on error object', () => {
    const error = { status: 403 };
    (useCourseInfo as jest.Mock).mockReturnValue({ isLoading: false, error });

    render(<ForbiddenErrorObserver />);

    expect(mockSetErrorType).toHaveBeenCalledWith('forbidden');
  });
});
