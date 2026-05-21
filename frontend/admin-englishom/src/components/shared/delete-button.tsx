'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

type Props = {
  onDelete: () => void;
  isPending: boolean;
};

const DeleteButton: FC<Props> = ({ onDelete, isPending }) => {
  const t = useTranslations('Admin.cms');
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="ms-auto mt-auto w-fit"
          size="sm"
        >
          {t('delete')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none">
            {t('cancel')}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            disabled={isPending}
          >
            {isPending ? t('deleting') : t('delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
