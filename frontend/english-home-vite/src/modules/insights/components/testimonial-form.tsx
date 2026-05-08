import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Button } from '@ui/button';
import { Star, MessageSquarePlus } from 'lucide-react';
import { cn } from '@lib/utils';
import { useSubmitTestimonial } from '../testimonial-mutations';

const TestimonialForm: FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { mutate: submit, isPending } = useSubmitTestimonial();

  const handleSubmit = () => {
    if (!content.trim() || rating === 0) return;
    submit(
      { content: content.trim(), rating },
      {
        onSuccess: () => {
          setOpen(false);
          setContent('');
          setRating(0);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquarePlus className="size-4" />
          {t('Global.testimonial.submitButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
            <Star className="size-6 text-amber-500" />
          </div>
          <DialogTitle className="text-xl">
            {t('Global.testimonial.title')}
          </DialogTitle>
          <DialogDescription>
            {t('Global.testimonial.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t('Global.testimonial.ratingLabel')}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      'size-8 transition-colors',
                      (hoveredStar || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('Global.testimonial.contentLabel')}
            </label>
            <textarea
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder={t('Global.testimonial.contentPlaceholder') as string}
              rows={4}
              maxLength={500}
              className="flex min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground text-end">
              {content.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('Global.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || rating === 0 || isPending}
          >
            {isPending
              ? t('Global.processing')
              : t('Global.testimonial.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialForm;
