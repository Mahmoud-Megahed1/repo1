'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type ContextType = {
  title: React.ReactNode;
  setTitle: Dispatch<SetStateAction<React.ReactNode>>;
};

const HeaderTitleContext = createContext<ContextType | undefined>(undefined);

const HeaderTitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState<React.ReactNode>('Dashboard');

  return (
    <HeaderTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderTitleContext.Provider>
  );
};

const useHeaderTitle = () => {
  const context = useContext(HeaderTitleContext);
  if (context === undefined) {
    throw new Error('useHeaderTitle must be used within a HeaderTitleProvider');
  }
  return context;
};

const withHeaderTitleProvider = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> => {
  // eslint-disable-next-line react/display-name
  return (props: P) => (
    <HeaderTitleProvider>
      <Component {...props} />
    </HeaderTitleProvider>
  );
};

export { HeaderTitleProvider, useHeaderTitle, withHeaderTitleProvider };
