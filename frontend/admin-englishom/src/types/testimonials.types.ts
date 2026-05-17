export interface Testimonial {
    _id: string;
    name: string;
    content: string;
    role: string;
    rating: number;
    isVisible: boolean;
    order: number;
    avatar?: string;
    userId?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    status?: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface CreateTestimonialDto {
    name: string;
    content: string;
    role: string;
    rating: number;
    isVisible: boolean;
    order: number;
    avatar?: string;
}

export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> { }

export interface TestimonialsResponse {
    testimonials: Testimonial[];
    totalPages: number;
    totalDocs: number;
}
