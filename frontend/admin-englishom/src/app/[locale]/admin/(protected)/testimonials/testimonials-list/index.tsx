import Spinner from '@/components/shared/spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/types/testimonials.types';
import React, { FC } from 'react';
import TestimonialRow from './testimonial-row';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    testimonials: Testimonial[];
    isLoading?: boolean;
};

const TestimonialsList: FC<Props> = ({ className, isLoading, testimonials }) => {
    const isEmpty = testimonials.length === 0;
    return (
        <ScrollArea
            className={cn(
                'box h-[calc(100vh-300px)] md:h-[calc(100vh-204px)]',
                {
                    'h-fit md:h-fit': isLoading || isEmpty || testimonials.length < 6,
                },
                className,
            )}
        >
            {isLoading ? (
                <Spinner />
            ) : (
                <main className="h-full overflow-auto font-bold">
                    <div className="flex w-full items-center gap-2">
                        <div className="grid w-full grid-cols-6 gap-2 px-3 pb-4 pt-2 text-sm text-muted-foreground">
                            <span className="col-span-1">Order</span>
                            <span className="col-span-1">Name</span>
                            <span className="col-span-1">Role</span>
                            <span className="col-span-1">Rating</span>
                            <span className="col-span-1">Visibility</span>
                            <span className="col-span-1 text-right">Actions</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {isEmpty ? (
                            <h4 className="self-center text-3xl">Not found</h4>
                        ) : (
                            testimonials.map((testimonial) => (
                                <TestimonialRow
                                    key={testimonial._id}
                                    testimonial={testimonial}
                                />
                            ))
                        )}
                    </div>
                </main>
            )}
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default TestimonialsList;
