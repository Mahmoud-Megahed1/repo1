import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = React.ComponentProps<typeof Dialog> & {
  formId: string;
  isPending: boolean;
};

const CreateDialog: FC<Props> = ({ children, formId, isPending, ...props }) => (
  <Dialog {...props}>
    <DialogTrigger asChild>
      <Button>Create</Button>
    </DialogTrigger>
    <DialogContent className="p-0">
      <ScrollArea className="flex max-h-[90vh] flex-col px-5 py-6">
        <DialogHeader className="mb-4 px-1">
          <DialogTitle className="text-xl">Create Lesson</DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the form to create a new lesson.
          </DialogDescription>
        </DialogHeader>
        {children}
        <Button
          form={formId}
          className="ms-auto mt-4 block"
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

export default CreateDialog;
