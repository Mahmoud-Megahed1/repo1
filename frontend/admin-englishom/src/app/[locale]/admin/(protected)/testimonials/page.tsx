'use client';
import CustomPagination from '@/components/shared/custom-pagination';
import { Link } from '@/components/shared/smooth-navigation';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/custom-select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CirclePlusIcon, RefreshCcw } from 'lucide-react';
import { FC, useCallback } from 'react';
import { useTestimonials, withTestimonialsProvider } from '../_components/testimonials-provider';
import TestimonialsList from './testimonials-list';

const Testimonials = () => {
    const {
        queryResult: { data, isFetching, isLoading, refetch },
        dispatch,
        params: { page, limit },
    } = useTestimonials();

    const onPaginate = useCallback(
        (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
        [dispatch],
    );

    const onSizeChange = useCallback(
        (size: string) => dispatch({ type: 'SET_LIMIT', payload: +size }),
        [dispatch],
    );

    const testimonials = data?.data.testimonials || [];

    return (
        <div className="flex flex-col gap-6 pb-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="heading">Testimonials ({data?.data.totalDocs || 0})</h1>
                    <button
                        className={cn({
                            'animate-spin opacity-60': isFetching,
                        })}
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        <RefreshCcw />
                    </button>
                </div>
                <div className="flex w-full items-center gap-4 md:w-auto">
                    <Button className="shrink-0 gap-1 [&_svg]:size-5" asChild>
                        <Link href={'/admin/testimonials/add'}>
                            <CirclePlusIcon />
                            <span className="sr-only md:not-sr-only">Add Testimonial</span>
                        </Link>
                    </Button>
                    <SearchInput />
                </div>
            </header>
            <div className="mt-4 flex flex-col gap-4">
                <TestimonialsList
                    testimonials={testimonials}
                    isLoading={isLoading}
                    className={cn({
                        'animate-pulse duration-1000': isFetching,
                    })}
                />
                <div className="mx-auto flex items-end gap-4">
                    <CustomSelect
                        placeholder="Size"
                        label="Size"
                        onValueChange={onSizeChange}
                        defaultValue={`${limit}`}
                        options={[
                            { value: '10', label: '10' },
                            { value: '30', label: '30' },
                            { value: '50', label: '50' },
                        ]}
                    />
                    <CustomPagination
                        onPaginate={onPaginate}
                        defaultPage={page}
                        totalPages={data?.data.totalPages || 1}
                    />
                </div>
            </div>
        </div>
    );
};

const SearchInput: FC<React.ComponentProps<typeof Input>> = ({
    className,
    ...props
}) => {
    const { params, dispatch } = useTestimonials();
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const query = e.target.value.trim();
            dispatch({ type: 'SET_SEARCH_TERM', payload: query });
        },
        [dispatch],
    );

    return (
        <Input
            type="search"
            placeholder="Search by name or content"
            className={cn('md:w-[400px]', className)}
            onChange={handleSearch}
            defaultValue={params.query}
            value={params.query}
            {...props}
        />
    );
};

export default withTestimonialsProvider(Testimonials);
