'use client';
import GoBack from '@/components/shared/go-back';
import Spinner from '@/components/shared/spinner';
import { Button } from '@/components/ui/button';
import { createTestimonial } from '@/services/testimonials';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+ app dir
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import TestimonialForm from '../form';
import { TestimonialFormValues, testimonialSchema } from '../form/schema';

const AddTestimonial = () => {
    const router = useRouter();
    const id = useId();
    const form = useForm<TestimonialFormValues>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            isVisible: true,
            rating: 5,
            order: 0,
            role: 'Student',
        },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationKey: ['createTestimonial'],
        mutationFn: createTestimonial,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['testimonials'],
            });
            router.push('/admin/testimonials');
            toast.success('Testimonial added successfully');
        },
        onError: () => {
            toast.error('Failed to add testimonial');
        }
    });

    function onSubmit(values: TestimonialFormValues) {
        mutate(values);
    }

    return (
        <div className="flex flex-col gap-6 pb-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GoBack />
                    <h1 className="capitalize heading">Add Testimonial</h1>
                </div>
                <Button form={id} disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner /> Adding...
                        </span>
                    ) : (
                        'Add Testimonial'
                    )}
                </Button>
            </header>
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                <TestimonialForm id={id} form={form} onSubmit={form.handleSubmit(onSubmit)} />
            </div>
        </div>
    );
};

export default AddTestimonial;
