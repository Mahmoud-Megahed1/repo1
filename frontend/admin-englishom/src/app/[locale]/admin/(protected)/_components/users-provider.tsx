/* eslint-disable @typescript-eslint/no-explicit-any */
import useDebounce from '@/hooks/use-debounce';
import { getUsers } from '@/services/admins';
import { UsersResponse } from '@/types/admins.types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

type Params = {
  page?: number;
  limit?: number;
  query?: string;
};
type ContextType = {
  queryResult: UseQueryResult<AxiosResponse<UsersResponse>>;
  dispatch: Dispatch<Actions>;
  params: Params;
};

type Actions =
  | { type: 'SET_SEARCH_TERM'; payload?: string }
  | { type: 'SET_PAGE'; payload?: number }
  | { type: 'SET_LIMIT'; payload?: number }
  | { type: 'RESET' };

function reducer(state: Params, action: Actions) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, page: 1, query: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_LIMIT':
      return { ...state, page: 1, limit: action.payload };
    case 'RESET':
      return {
        page: 1,
        limit: 10,
        query: '',
      };
    default:
      return state;
  }
}

const UsersContext = createContext<ContextType | undefined>(undefined);
const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useQueryStates(
    {
      query: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    { history: 'replace' },
  );

  const debouncedSearch = useDebounce(params.query);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const queryResult = useQuery({
    queryKey: ['users', { query: debouncedSearch }, params.limit, params.page],
    queryFn: () =>
      getUsers({
        limit: params.limit,
        page: params.page,
        query: debouncedSearch === '' ? undefined : debouncedSearch,
      }),
  });

  const [state, dispatch] = useReducer(reducer, params);

  useEffect(() => {
    setParams(state);
  }, [state, setParams]);

  return (
    <UsersContext.Provider
      value={{
        queryResult,
        dispatch,
        params: state,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

const withUsersProvider = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  const WrappedComponent = (props: P) => {
    return (
      <UsersProvider>
        <Component {...props} />
      </UsersProvider>
    );
  };

  WrappedComponent.displayName = 'withAdmins';

  return WrappedComponent;
};

export { useUsers, withUsersProvider };
