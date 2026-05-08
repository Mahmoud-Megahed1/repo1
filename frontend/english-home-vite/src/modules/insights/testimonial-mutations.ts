import { useMutation } from '@tanstack/react-query';
import { submitTestimonial, type SubmitTestimonialData } from './testimonial-services';
import { toast } from 'sonner';

export function useSubmitTestimonial() {
  return useMutation({
    mutationFn: (data: SubmitTestimonialData) => submitTestimonial(data),
    onSuccess: () => {
      toast.success('تم إرسال تقييمك بنجاح! سيتم مراجعته من قبل الإدارة.');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'حدث خطأ أثناء إرسال التقييم';
      toast.error(message);
    },
  });
}
