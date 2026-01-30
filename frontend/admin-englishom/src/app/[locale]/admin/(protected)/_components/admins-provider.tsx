/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useDebounce from '@/hooks/use-debounce';
import { getAdmins } from '@/services/admins';
import { AdminsResponse } from '@/types/admins.types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

enum AdminRole {
  ALL = 'all',
  SUPER = 'super',
  MANAGER = 'manager',
  VIEW = 'view',
  OPERATOR = 'operator',
}

enum AdminStatus {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

type Params = {
  page?: number;
  limit?: number;
  query?: string;
  isActive?: AdminStatus;
  adminRole?: AdminRole;
};
type ContextType = {
  queryResult: UseQueryResult<AxiosResponse<AdminsResponse>>;
  dispatch: Dispatch<Actions>;
  params: Params;
};

type Actions =
  | { type: 'SET_SEARCH_TERM'; payload?: string }
  | { type: 'SET_PAGE'; payload?: number }
  | { type: 'SET_LIMIT'; payload?: number }
  | { type: 'SET_IS_ACTIVE'; payload?: AdminStatus }
  | { type: 'SET_ADMIN_ROLE'; payload?: AdminRole }
  | { type: 'RESET' };

function reducer(state: Params, action: Actions) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, page: 1, query: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_LIMIT':
      return { ...state, page: 1, limit: action.payload };
    case 'SET_IS_ACTIVE':
      return { ...state, isActive: action.payload };
    case 'SET_ADMIN_ROLE':
      return { ...state, adminRole: action.payload };
    case 'RESET':
      return {
        page: 1,
        limit: 10,
        query: '',
        isActive: AdminStatus.ALL,
        adminRole: AdminRole.ALL,
      };
    default:
      return state;
  }
}

const AdminsContext = createContext<ContextType | undefined>(undefined);
const AdminsProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useQueryStates(
    {
      query: parseAsString.withDefault(''),
      adminRole: parseAsStringEnum<AdminRole>(
        Object.values(AdminRole),
      ).withDefault(AdminRole.ALL),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      isActive: parseAsStringEnum<AdminStatus>(
        Object.values(AdminStatus),
      ).withDefault(AdminStatus.ALL),
    },
    { history: 'replace' },
  );

  const debouncedSearch = useDebounce(params.query);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const queryResult = useQuery({
    queryKey: [
      'admins',
      { query: debouncedSearch },
      params.limit,
      params.page,
      params.adminRole,
      params.isActive,
    ],
    queryFn: () =>
      getAdmins({
        limit: params.limit,
        page: params.page,
        adminRole:
          params.adminRole === AdminRole.ALL ? undefined : params.adminRole,
        isActive:
          params.isActive === AdminStatus.ALL
            ? undefined
            : params.isActive === AdminStatus.ACTIVE,
        query: debouncedSearch === '' ? undefined : debouncedSearch,
      }),
  });

  const [state, dispatch] = useReducer(reducer, params);

  useEffect(() => {
    setParams(state);
  }, [state, setParams]);

  return (
    <AdminsContext.Provider
      value={{
        queryResult,
        dispatch,
        params: state,
      }}
    >
      {children}
    </AdminsContext.Provider>
  );
};

const useAdmins = () => {
  const context = useContext(AdminsContext);
  if (context === undefined) {
    throw new Error('useAdmins must be used within a AdminsProvider');
  }
  return context;
};

const withAdminsProvider = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  const WrappedComponent = (props: P) => {
    return (
      <AdminsProvider>
        <Component {...props} />
      </AdminsProvider>
    );
  };

  WrappedComponent.displayName = 'withAdmins';

  return WrappedComponent;
};

export { useAdmins, withAdminsProvider };
