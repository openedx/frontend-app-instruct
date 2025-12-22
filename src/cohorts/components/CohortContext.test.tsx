import React from 'react';
import { render, act } from '@testing-library/react';
import { CohortProvider, useCohortContext } from './CohortContext';

const TestComponent: React.FC = () => {
  const {
    selectedCohort,
    setSelectedCohort,
    clearSelectedCohort,
    updateCohortField,
  } = useCohortContext();

  return (
    <div>
      <span>{selectedCohort ? selectedCohort.name : 'none'}</span>
      <button
        onClick={() =>
          setSelectedCohort({
            id: '1',
            name: 'Cohort 1',
            assignmentType: 'typeA',
            contentGroupOption: 'optionA',
            groupId: 123,
            userPartitionId: 456,
          })}
      >
        Set Cohort
      </button>
      <button onClick={clearSelectedCohort}>
        Clear Cohort
      </button>
      <button
        onClick={() => updateCohortField('name', 'Updated Cohort')}
      >
        Update Cohort
      </button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <CohortProvider>
      <TestComponent />
    </CohortProvider>
  );

describe('CohortContext', () => {
  it('should provide default value', () => {
    const { getByText } = renderWithProvider();
    expect(getByText('none')).toBeInTheDocument();
  });

  it('should set selected cohort', () => {
    const { getByRole, getByText } = renderWithProvider();
    act(() => {
      getByRole('button', { name: 'Set Cohort' }).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getByText('Cohort 1')).toBeInTheDocument();
  });

  it('should clear selected cohort', () => {
    const { getByRole, getByText } = renderWithProvider();
    act(() => {
      getByRole('button', { name: 'Set Cohort' }).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getByText('Cohort 1')).toBeInTheDocument();
    act(() => {
      getByRole('button', { name: 'Clear Cohort' }).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getByText('none')).toBeInTheDocument();
  });

  it('should update cohort field', () => {
    const { getByRole, getByText } = renderWithProvider();
    act(() => {
      getByRole('button', { name: 'Set Cohort' }).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    act(() => {
      getByRole('button', { name: 'Update Cohort' }).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getByText('Updated Cohort')).toBeInTheDocument();
  });

  it('should throw error if used outside provider', () => {
    // Suppress error output for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const BrokenComponent = () => {
      useCohortContext();
      return null;
    };
    expect(() => render(<BrokenComponent />)).toThrow(
      'useCohortContext must be used within a CohortProvider'
    );
    spy.mockRestore();
  });

  it('should not update selectedCohort if values are the same', () => {
    let renderCount = 0;
    const RenderCountComponent = () => {
      renderCount++;
      const { setSelectedCohort } = useCohortContext();
      React.useEffect(() => {
        setSelectedCohort({
          id: '1',
          name: 'Cohort 1',
          assignmentType: 'typeA',
          contentGroupOption: 'optionA',
          groupId: 123,
          userPartitionId: 456,
        });
        setSelectedCohort({
          id: '1',
          name: 'Cohort 1',
          assignmentType: 'typeA',
          contentGroupOption: 'optionA',
          groupId: 123,
          userPartitionId: 456,
        });
      }, [setSelectedCohort]);
      return null;
    };
    render(
      <CohortProvider>
        <RenderCountComponent />
      </CohortProvider>
    );
    // Should only render twice: initial and after first setSelectedCohort
    expect(renderCount).toBe(2);
  });
});
