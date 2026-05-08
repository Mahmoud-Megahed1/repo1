import axiosClient from '@lib/axios-client';

export interface SubmitTestimonialData {
  content: string;
  rating: number;
}

export function submitTestimonial(data: SubmitTestimonialData) {
  return axiosClient.post('/testimonials/submit', data);
}
