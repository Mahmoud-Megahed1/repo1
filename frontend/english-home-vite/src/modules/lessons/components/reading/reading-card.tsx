import RichTextViewer from '@components/rich-text-viewer';
import { cn } from '@lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { BookOpen } from 'lucide-react';
import { type ComponentProps } from 'react';

type Props = {
  title: string;
  content: string;
} & ComponentProps<typeof Card>;

export function ReadingCard({ title, content, className, ...props }: Props) {
  return (
    <Card
      className={cn(
        'border-border shadow-card hover:shadow-soft border transition-all duration-200',
        className
      )}
      {...props}
    >
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Reading Content */}
        <div className="bg-accent/30 w-full rounded-lg p-2 *:mx-auto">
          <RichTextViewer lang="en" className="prose-img:max-h-[400px] prose-img:w-auto prose-img:mx-auto">
            {content}
          </RichTextViewer>
        </div>
      </CardContent>
    </Card>
  );
}
