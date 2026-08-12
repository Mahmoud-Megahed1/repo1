'use client';

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
import { useTranslations } from 'next-intl';

type Props = React.ComponentProps<typeof Dialog> & {
  formId: string;
  isPending: boolean;
};

const CreateDialog: FC<Props> = ({ children, formId, isPending, ...props }) => {
  const t = useTranslations('Admin.cms');
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button>{t('create')}</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col p-6 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl">{t('createLesson')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('fillForm')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1 py-1">
          {children}
        </div>
        <Button
          form={formId}
          className="ms-auto mt-4 block"
          disabled={isPending}
        >
          {isPending ? t('creating') : t('create')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
