import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { AlertTriangle, Clock, XCircle } from 'lucide-react';
import { useTerminateActiveCourse } from '../mutations';
import { formatDate } from '@lib/utils';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCourse: {
    levelName: string;
    accessExpiresAt: string;
  };
};

const ActiveCourseConflictModal: FC<Props> = ({
  open,
  onOpenChange,
  activeCourse,
}) => {
  const { t } = useTranslation();
  const [confirmTerminate, setConfirmTerminate] = useState(false);
  const { mutate: terminate, isPending } = useTerminateActiveCourse();

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(activeCourse.accessExpiresAt).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const handleTerminate = () => {
    terminate(undefined, {
      onSuccess: () => {
        setConfirmTerminate(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
            <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-xl">
            {t('Global.activeCourseConflict.title')}
          </DialogTitle>
          <DialogDescription>
            {t('Global.activeCourseConflict.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Current course info */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t('Global.activeCourseConflict.currentCourse')}
              </span>
              <Badge variant="default">{activeCourse.levelName}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t('Global.activeCourseConflict.expiresAt')}
              </span>
              <span className="text-sm">
                {formatDate(activeCourse.accessExpiresAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Clock className="size-4" />
                {t('Global.activeCourseConflict.daysRemaining')}
              </div>
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700 text-lg font-bold px-3"
              >
                {daysRemaining}
              </Badge>
            </div>
          </div>

          {/* Confirm termination */}
          {confirmTerminate ? (
            <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <p className="text-sm text-destructive font-medium">
                {t('Global.activeCourseConflict.terminateConfirm')}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmTerminate(false)}
                >
                  {t('Global.cancel')}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleTerminate}
                  disabled={isPending}
                >
                  {isPending ? t('Global.processing') : t('Global.activeCourseConflict.terminateCourse')}
                  <XCircle className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {!confirmTerminate && (
            <Button
              variant="destructive"
              onClick={() => setConfirmTerminate(true)}
              className="w-full"
            >
              {t('Global.activeCourseConflict.terminateCourse')}
              <XCircle className="size-4" />
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t('Global.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveCourseConflictModal;
