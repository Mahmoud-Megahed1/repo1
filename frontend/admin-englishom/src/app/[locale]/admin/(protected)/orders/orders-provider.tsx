'use client';
import { getOrders } from '@/services/orders';
import { OrdersResponse } from '@/types/orders.types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { parseAsInteger, parseAsStringEnum, useQueryStates } from 'nuqs';
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

type Params = {
  page: number;
  limit: number;
  period?: Period;
};

type ContextType = {
  queryResult: UseQueryResult<AxiosResponse<OrdersResponse>>;
  dispatch: Dispatch<Actions>;
  params: Params;
};

type Actions =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_LIMIT'; payload: number }
  | { type: 'SET_PERIOD'; payload?: Period }
  | { type: 'RESET' };

function reducer(state: Params, action: Actions): Params {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_LIMIT':
      return { ...state, page: 1, limit: action.payload };
    case 'SET_PERIOD':
      return { ...state, page: 1, period: action.payload };
    case 'RESET':
      return {
        page: 1,
        limit: 10,
        period: undefined,
      };
    default:
      return state;
  }
}

const OrdersContext = createContext<ContextType | undefined>(undefined);

const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      period: parseAsStringEnum<Period>([
        'daily',
        'weekly',
        'monthly',
        'yearly',
      ]),
    },
    { history: 'replace' },
  );

  const queryResult = useQuery({
    queryKey: ['orders', params.page, params.limit, params.period],
    queryFn: () =>
      getOrders({
        limit: params.limit,
        page: params.page,
        period: params.period ?? undefined,
      }),
  });

  const [state, dispatch] = useReducer(reducer, {
    page: params.page,
    limit: params.limit,
    period: params.period ?? undefined,
  });

  useEffect(() => {
    setParams({
      page: state.page,
      limit: state.limit,
      period: state.period ?? null,
    });
  }, [state, setParams]);

  return (
    <OrdersContext.Provider
      value={{
        queryResult,
        dispatch,
        params: state,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

const withOrdersProvider = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  const WrappedComponent = (props: P) => {
    return (
      <OrdersProvider>
        <Component {...props} />
      </OrdersProvider>
    );
  };

  WrappedComponent.displayName = 'withOrdersProvider';

  return WrappedComponent;
};

export { OrdersProvider, useOrders, withOrdersProvider };
