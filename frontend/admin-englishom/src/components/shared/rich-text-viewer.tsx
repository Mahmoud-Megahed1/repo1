import React, { FC } from 'react';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';

type Props = Omit<React.ComponentProps<'div'>, 'children'> & {
  children: string;
};
const RichTextViewer: FC<Props> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('prose prose-sm dark:prose-invert', className)}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(children, {
          FORBID_ATTR: ['style'],
        }),
      }}
      {...props}
    />
  );
};

export default RichTextViewer;
