import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface CohortData {
  id: string,
  name: string,
  assignmentType: string,
  contentGroupOption?: string,
  groupId: number | null,
  userPartitionId: number | null,
  userCount?: number,
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

const areCohortsEqual = (prev: CohortData | null, current: CohortData): boolean => {
  if (!prev) return false;
  return prev.name === current.name
    && prev.assignmentType === current.assignmentType
    && prev.contentGroupOption === current.contentGroupOption
    && prev.userPartitionId === current.userPartitionId
    && prev.userCount === current.userCount
    && prev.groupId === current.groupId;
};

export const CohortProvider: React.FC<CohortProviderProps> = ({ children }) => {
  const [selectedCohort, setSelectedCohortState] = useState<CohortData | null>(null);

  const setSelectedCohort = useCallback((cohort: CohortData) => {
    setSelectedCohortState(prev => {
      // Only update if the values actually changed
      if (!areCohortsEqual(prev, cohort)) {
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
