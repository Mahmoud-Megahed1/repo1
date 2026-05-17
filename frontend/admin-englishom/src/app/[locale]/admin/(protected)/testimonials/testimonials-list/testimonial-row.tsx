'use client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { deleteTestimonial, updateTestimonial } from '@/services/testimonials';
import { Testimonial } from '@/types/testimonials.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Eye,
    EyeOff,
    MoreHorizontalIcon,
    Pencil,
    Star,
    Trash2,
} from 'lucide-react';
import { Link } from '@/components/shared/smooth-navigation';
import { FC } from 'react';
import { toast } from 'sonner';

interface Props {
    testimonial: Testimonial;
}

const TestimonialRow: FC<Props> = ({ testimonial }) => {
    const queryClient = useQueryClient();

    const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
        mutationKey: ['deleteTestimonial'],
        mutationFn: deleteTestimonial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success('Testimonial deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete testimonial');
        },
    });

    const { mutate: toggleVisibility, isPending: isToggling } = useMutation({
        mutationKey: ['toggleVisibility'],
        mutationFn: () =>
            updateTestimonial({
                id: testimonial._id,
                data: { isVisible: !testimonial.isVisible },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success('Visibility updated');
        },
        onError: () => {
            toast.error('Failed to update visibility');
        }
    });

    const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
        mutationKey: ['updateStatus'],
        mutationFn: (status: 'approved' | 'rejected') =>
            updateTestimonial({
                id: testimonial._id,
                data: { status, isVisible: status === 'approved' },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success('Status updated successfully');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    return (
        <div className="flex w-full items-center gap-2 text-sm">
            <div className="grid h-14 w-full grid-cols-6 items-center gap-2 rounded-xl bg-white/50 px-3 py-2 dark:bg-background/20">
                <span className="col-span-1">{testimonial.order}</span>
                <span className="col-span-1 truncate font-medium flex items-center gap-2">
                    {testimonial.name}
                    {testimonial.userId && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Student
                        </span>
                    )}
                </span>
                <span className="col-span-1 truncate text-muted-foreground">{testimonial.role}</span>
                <span className="col-span-1 flex items-center gap-1 text-yellow-500">
                    <Star className="size-4 fill-current" /> {testimonial.rating}
                </span>
                <div className="col-span-1 flex flex-col gap-1">
                    <span
                        className={cn('font-semibold text-xs', {
                            'text-teal-500': testimonial.isVisible,
                            'text-destructive': !testimonial.isVisible,
                        })}
                    >
                        {testimonial.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                    {testimonial.status === 'pending' && (
                        <span className="w-fit rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                            Pending Review
                        </span>
                    )}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none" asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            {testimonial.status === 'pending' && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => updateStatus('approved')}
                                        disabled={isUpdatingStatus}
                                        className="gap-2 cursor-pointer text-teal-600 focus:text-teal-600"
                                    >
                                        <Eye className="size-4" /> Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateStatus('rejected')}
                                        disabled={isUpdatingStatus}
                                        className="gap-2 cursor-pointer text-orange-600 focus:text-orange-600"
                                    >
                                        <EyeOff className="size-4" /> Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/testimonials/update/${testimonial._id}`} className="flex items-center gap-2 cursor-pointer">
                                    <Pencil className="size-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toggleVisibility()}
                                disabled={isToggling}
                                className="gap-2 cursor-pointer"
                            >
                                {testimonial.isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                {testimonial.isVisible ? 'Hide' : 'Show'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => deleteMutate(testimonial._id)}
                                disabled={isDeleting}
                                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default TestimonialRow;
