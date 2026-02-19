import { render, screen, waitFor } from '@testing-library/react';
import InstructorNav from './InstructorNav';
import { useParams } from 'react-router-dom';
import { useCourseInfo } from '@src/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import { useWidgetProps } from '../slots/SlotUtils';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));
jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
}));
jest.mock('@src/providers/AlertProvider', () => ({
  useAlert: jest.fn(),
}));
jest.mock('../slots/SlotUtils', () => ({
  useWidgetProps: jest.fn(),
}));

const mockClearAlerts = jest.fn();

describe('InstructorNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAlert as jest.Mock).mockReturnValue({ clearAlerts: mockClearAlerts });
  });

  it('renders loading skeleton when loading', () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course' });
    (useCourseInfo as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    (useWidgetProps as jest.Mock).mockReturnValue([]);

    render(<InstructorNav />);
    const skeleton = document.querySelector('span[aria-busy="true"]');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton?.firstChild).toHaveClass('react-loading-skeleton lead');
  });

  it('renders nothing if there are no tabs', () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course' });
    (useCourseInfo as jest.Mock).mockReturnValue({ data: { tabs: [] }, isLoading: false });
    (useWidgetProps as jest.Mock).mockReturnValue([]);

    const { container } = render(<InstructorNav />);
    expect(container.firstChild).toBeNull();
  });

  it('renders tabs from API and slot, sorted by sortOrder', () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course', tabId: 'tab2' });
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: {
        tabs: [
          { tabId: 'tab1', url: '/tab1', title: 'Tab 1', sortOrder: 2 },
          { tabId: 'tab2', url: '/tab2', title: 'Tab 2', sortOrder: 1 },
        ],
      },
      isLoading: false,
    });
    (useWidgetProps as jest.Mock).mockReturnValue([
      { tabId: 'tab3', url: '/tab3', title: 'Tab 3', sortOrder: 3 },
    ]);

    render(<InstructorNav />);
    const tabLinks = screen.getAllByRole('link');
    expect(tabLinks).toHaveLength(3);
    expect(tabLinks[0]).toHaveTextContent('Tab 2');
    expect(tabLinks[1]).toHaveTextContent('Tab 1');
    expect(tabLinks[2]).toHaveTextContent('Tab 3');
  });

  it('does not render slot tabs without tabId or title', () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course', tabId: '' });
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: { tabs: [] },
      isLoading: false,
    });
    (useWidgetProps as jest.Mock).mockReturnValue([
      { tabId: '', url: '/tab4', title: 'No ID', sortOrder: 4 },
      { tabId: 'tab5', url: '/tab5', title: '', sortOrder: 5 },
      { tabId: 'tab6', url: '/tab6', title: 'Tab 6', sortOrder: 6 },
    ]);

    render(<InstructorNav />);
    expect(screen.getByText('Tab 6')).toBeInTheDocument();
    expect(screen.queryByText('No ID')).not.toBeInTheDocument();
  });

  it('calls clearAlerts when a tab is selected', async () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course', tabId: 'tab1' });
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: {
        tabs: [
          { tabId: 'tab1', url: '/tab1', title: 'Tab 1', sortOrder: 1 },
        ],
      },
      isLoading: false,
    });
    (useWidgetProps as jest.Mock).mockReturnValue([]);

    render(<InstructorNav />);
    const user = userEvent.setup();
    const tabLink = screen.getByText('Tab 1');
    await user.click(tabLink);
    expect(mockClearAlerts).toHaveBeenCalled();
  });

  it('marks the correct tab as active', () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+DemoX+Demo_Course', tabId: 'tab2' });
    (useCourseInfo as jest.Mock).mockReturnValue({
      data: {
        tabs: [
          { tabId: 'tab1', url: '/tab1', title: 'Tab 1', sortOrder: 1 },
          { tabId: 'tab2', url: '/tab2', title: 'Tab 2', sortOrder: 2 },
        ],
      },
      isLoading: false,
    });
    (useWidgetProps as jest.Mock).mockReturnValue([]);

    render(<InstructorNav />);
    waitFor(() => {
      const tab2Link = screen.getByText('Tab 2');
      expect(tab2Link.closest('a')).toHaveAttribute('aria-current', 'page');
    });
  });
});
