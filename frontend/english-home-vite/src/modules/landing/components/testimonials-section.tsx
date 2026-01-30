import { Avatar, AvatarFallback } from '@components/ui/avatar';
import { Card, CardContent } from '@components/ui/card';
import { Quote, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export function TestimonialsSection() {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('https://api.englishom.com/api/testimonials/public');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            {t('Landing.testimonials.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('Landing.testimonials.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial._id}
              className="relative transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="flex h-full flex-col p-6">
                <Quote className="text-primary mb-4 h-8 w-8" />
                <blockquote className="mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-auto flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {/* Placeholder gradient avatar if no image */}
                    <AvatarFallback
                      className={`bg-gradient-to-br ${index % 3 === 0 ? 'from-pink-500 to-rose-500' :
                          index % 3 === 1 ? 'from-blue-500 to-cyan-500' :
                            'from-purple-500 to-violet-500'
                        } font-semibold text-white`}
                    >
                      {testimonial.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

