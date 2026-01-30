import client from '@/lib/client';
import {
    CreateTestimonialDto,
    Testimonial,
    TestimonialsResponse,
    UpdateTestimonialDto,
} from '@/types/testimonials.types';
import { AxiosRequestConfig } from 'axios';

export const getTestimonials = (config?: AxiosRequestConfig) => {
    return client.get<TestimonialsResponse>('/testimonials/admin', config);
};

export const createTestimonial = (data: CreateTestimonialDto) => {
    return client.post<Testimonial>('/testimonials/admin', data);
};

export const updateTestimonial = ({
    id,
    data,
}: {
    id: string;
    data: UpdateTestimonialDto;
}) => {
    return client.patch<Testimonial>(`/testimonials/admin/${id}`, data);
};

export const deleteTestimonial = (id: string) => {
    return client.delete<{ message: string }>(`/testimonials/admin/${id}`);
};

// Public fetcher (optional if needed here, mostly for frontend)
export const getPublicTestimonials = () => {
    return client.get<Testimonial[]>('/testimonials/public');
};

export const getTestimonialById = (id: string) => {
    return client.get<Testimonial>(`/testimonials/admin/${id}`);
};
