import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type QuestionnaireData = {
  [section: string]: { [field: string]: unknown };
};

type QuestionnaireContextType = {
  data: QuestionnaireData;
  updateField: (section: string, field: string, value: unknown) => void;
  getSection: (section: string) => { [field: string]: unknown };
  setSection: (section: string, values: { [field: string]: unknown }) => void;
  setAll: (data: QuestionnaireData) => void;
  resetAll: () => void;
};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};

export const QuestionnaireProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<QuestionnaireData>({});

  const updateField = (section: string, field: string, value: unknown) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getSection = (section: string) => {
    return data[section] || {};
  };

  const setSection = (section: string, values: { [field: string]: unknown }) => {
    setData((prev) => ({
      ...prev,
      [section]: values,
    }));
  };

  const setAll = (newData: QuestionnaireData) => {
    setData(JSON.parse(JSON.stringify(newData)));
  };


  const resetAll = () => {
    setData({});
  };

  return (
    <QuestionnaireContext.Provider
      value={{ data, updateField, getSection, setSection, setAll, resetAll }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};