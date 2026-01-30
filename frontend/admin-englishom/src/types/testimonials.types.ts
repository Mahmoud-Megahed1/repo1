export interface Testimonial {
    _id: string;
    name: string;
    content: string;
    role: string;
    rating: number;
    isVisible: boolean;
    order: number;
    avatar?: string;
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
