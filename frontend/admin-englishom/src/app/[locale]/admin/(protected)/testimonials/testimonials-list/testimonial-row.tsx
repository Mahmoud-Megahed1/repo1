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

    return (
        <div className="flex w-full items-center gap-2 text-sm">
            <div className="grid h-14 w-full grid-cols-6 items-center gap-2 rounded-xl bg-white/50 px-3 py-2 dark:bg-background/20">
                <span className="col-span-1">{testimonial.order}</span>
                <span className="col-span-1 truncate font-medium">{testimonial.name}</span>
                <span className="col-span-1 truncate text-muted-foreground">{testimonial.role}</span>
                <span className="col-span-1 flex items-center gap-1 text-yellow-500">
                    <Star className="size-4 fill-current" /> {testimonial.rating}
                </span>
                <span
                    className={cn('col-span-1 font-semibold', {
                        'text-teal-500': testimonial.isVisible,
                        'text-destructive': !testimonial.isVisible,
                    })}
                >
                    {testimonial.isVisible ? 'Visible' : 'Hidden'}
                </span>

                <div className="col-span-1 flex items-center justify-end gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none" asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
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
