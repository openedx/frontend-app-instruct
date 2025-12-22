import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface CohortData {
  id: string,
  name: string,
  assignmentType: string,
  contentGroupOption?: string,
  groupId: number | null,
  userPartitionId: number | null,
}

interface CohortContextType {
  selectedCohort: CohortData | null,
  setSelectedCohort: (cohort: CohortData) => void,
  clearSelectedCohort: () => void,
  updateCohortField: (field: keyof CohortData, value: string) => void,
}

const CohortContext = createContext<CohortContextType | undefined>(undefined);

interface CohortProviderProps {
  children: ReactNode,
}

export const CohortProvider: React.FC<CohortProviderProps> = ({ children }) => {
  const [selectedCohort, setSelectedCohortState] = useState<CohortData | null>(null);

  const setSelectedCohort = useCallback((cohort: CohortData) => {
    setSelectedCohortState(prev => {
      // Only update if the values actually changed
      if (!prev
        || prev.name !== cohort.name
        || prev.assignmentType !== cohort.assignmentType
        || prev.contentGroupOption !== cohort.contentGroupOption
        || prev.groupId !== cohort.groupId) {
        return cohort;
      }
      return prev;
    });
  }, []);

  const clearSelectedCohort = useCallback(() => {
    setSelectedCohortState(null);
  }, []);

  const updateCohortField = useCallback((field: keyof CohortData, value: string) => {
    setSelectedCohortState(prev =>
      prev ? { ...prev, [field]: value } : null
    );
  }, []);

  return (
    <CohortContext.Provider
      value={{
        selectedCohort,
        setSelectedCohort,
        clearSelectedCohort,
        updateCohortField
      }}
    >
      {children}
    </CohortContext.Provider>
  );
};

export const useCohortContext = (): CohortContextType => {
  const context = useContext(CohortContext);
  if (context === undefined) {
    throw new Error('useCohortContext must be used within a CohortProvider');
  }
  return context;
};
