/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useDebounce from '@/hooks/use-debounce';
import { getTestimonials } from '@/services/testimonials';
import { TestimonialsResponse } from '@/types/testimonials.types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
    parseAsInteger,
    parseAsString,
    useQueryStates,
} from 'nuqs';
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
    queryResult: UseQueryResult<AxiosResponse<TestimonialsResponse>>;
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

const TestimonialsContext = createContext<ContextType | undefined>(undefined);
const TestimonialsProvider = ({ children }: { children: React.ReactNode }) => {
    const [params, setParams] = useQueryStates(
        {
            query: parseAsString.withDefault(''),
            page: parseAsInteger.withDefault(1),
            limit: parseAsInteger.withDefault(10),
        },
        { history: 'replace' },
    );

    const debouncedSearch = useDebounce(params.query);

    const queryResult = useQuery({
        queryKey: [
            'testimonials',
            { query: debouncedSearch },
            params.limit,
            params.page,
        ],
        queryFn: () =>
            getTestimonials({
                params: { // Pass params property correctly for axios config
                    limit: params.limit,
                    page: params.page,
                    query: debouncedSearch === '' ? undefined : debouncedSearch,
                }
            }),
    });

    const [state, dispatch] = useReducer(reducer, params);

    useEffect(() => {
        setParams(state);
    }, [state, setParams]);

    return (
        <TestimonialsContext.Provider
            value={{
                queryResult,
                dispatch,
                params: state,
            }}
        >
            {children}
        </TestimonialsContext.Provider>
    );
};

const useTestimonials = () => {
    const context = useContext(TestimonialsContext);
    if (context === undefined) {
        throw new Error('useTestimonials must be used within a TestimonialsProvider');
    }
    return context;
};

const withTestimonialsProvider = <P extends object>(
    Component: React.ComponentType<P>,
) => {
    const WrappedComponent = (props: P) => {
        return (
            <TestimonialsProvider>
                <Component {...props} />
            </TestimonialsProvider>
        );
    };

    WrappedComponent.displayName = 'withTestimonials';

    return WrappedComponent;
};

export { useTestimonials, withTestimonialsProvider };
