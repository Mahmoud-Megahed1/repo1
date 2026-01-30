'use client';
import GoBack from '@/components/shared/go-back';
import Spinner from '@/components/shared/spinner';
import { Button } from '@/components/ui/button';
import { updateTestimonial, getTestimonialById } from '@/services/testimonials';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/components/shared/smooth-navigation';
import { useParams } from 'next/navigation';
import { useId, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import TestimonialForm from '@/app/[locale]/admin/(protected)/testimonials/form';
import { TestimonialFormValues, testimonialSchema } from '@/app/[locale]/admin/(protected)/testimonials/form/schema';

const UpdateTestimonial = () => {
    const router = useRouter();
    const params = useParams();
    const testimonialId = params.id as string;
    const id = useId();

    // Fetch the testimonial details (Using list fetch for now as we don't have getOne endpoint in service exposed yet, or we can add it)
    // Actually, efficient way is to fetch one. But for MVP we might just fetch all and find, or assume we need to add getOne to service.
    // Ideally service should have getOne. I'll add "getTestimonialById" to service or client-side filter if list is cached.
    // Let's assume for now we use the cached list or just fetch directly if service supports it.
    // Wait, I didn't add `getTestimonialById` in the service file I wrote earlier.
    // I will rely on `useQuery` with `select` if I had list, or simply add `getOne` functionality.
    // Better approach: Update service file to include getOne.

    // WORKAROUND: For now, I'll filter from the 'testimonials' query if available, or fetch all and filter (inefficient but works for small lists).
    // CORRECT APPROACH: Add getOne to service. But I can't edit service *right now* in this tool call sequence easily without breaking flow. 
    // I will use a simple "Fetch All and Filter" approach as a temporary measure if 'getOne' API isn't explicitly requested, 
    // OR I will just add the service method in next steps. It's safer to add the service method.

    // Let's assume I will add `getTestimonial` to service in a moment.

    // Use getTestimonialById to reliably fetch the specific testimonial
    const { data: testimonial, isLoading: isLoadingTestimonial } = useQuery({
        queryKey: ['testimonial', testimonialId],
        queryFn: async () => {
            const response = await getTestimonialById(testimonialId);
            return response.data;
        },
        enabled: !!testimonialId,
    });

    const form = useForm<TestimonialFormValues>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            isVisible: true,
            rating: 5,
            order: 0,
        },
    });

    useEffect(() => {
        if (testimonial) {
            form.reset({
                name: testimonial.name,
                role: testimonial.role,
                content: testimonial.content,
                rating: testimonial.rating,
                order: testimonial.order,
                isVisible: testimonial.isVisible,
                avatar: testimonial.avatar,
            });
        }
    }, [testimonial, form]);

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationKey: ['updateTestimonial', testimonialId],
        mutationFn: (values: TestimonialFormValues) => updateTestimonial({ id: testimonialId, data: values }),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['testimonials'],
            });
            // Also invalidate single
            queryClient.invalidateQueries({
                queryKey: ['testimonial', testimonialId],
            });
            router.push('/admin/testimonials');
            toast.success('Testimonial updated successfully');
        },
        onError: () => {
            toast.error('Failed to update testimonial');
        }
    });

    function onSubmit(values: TestimonialFormValues) {
        mutate(values);
    }

    if (isLoadingTestimonial) {
        return <div className="flex h-full items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="flex flex-col gap-6 pb-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <GoBack />
                    <h1 className="capitalize heading">Update Testimonial</h1>
                </div>
                <Button form={id} disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner /> Updating...
                        </span>
                    ) : (
                        'Update Testimonial'
                    )}
                </Button>
            </header>
            <div className="rounded-xl border bg-card p-6 text-card-foreground shadow">
                <TestimonialForm id={id} form={form} onSubmit={form.handleSubmit(onSubmit)} />
            </div>
        </div>
    );
};

export default UpdateTestimonial;
