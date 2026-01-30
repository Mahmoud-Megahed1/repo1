import { z } from 'zod';

export const testimonialSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    content: z.string().min(1, 'Content is required'),
    role: z.string().min(1, 'Role is required'),
    rating: z.coerce
        .number()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
    order: z.coerce.number().default(0),
    isVisible: z.boolean().default(true),
    avatar: z.string().optional(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
