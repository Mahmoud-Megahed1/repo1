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
import { Checkbox } from '@ui/checkbox';
import { ScrollArea } from '@ui/scroll-area';
import { ShieldCheck } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  isPending?: boolean;
};

const PurchaseAgreementModal: FC<Props> = ({
  open,
  onOpenChange,
  onAccept,
  isPending,
}) => {
  const { t } = useTranslation();
  const [isAccepted, setIsAccepted] = useState(false);
  const [showFullAgreement, setShowFullAgreement] = useState(false);

  const handleAccept = () => {
    onAccept();
    setIsAccepted(false);
  };

  const agreementClauses = [
    {
      title: t('Global.purchaseAgreement.clause1Title'),
      content: t('Global.purchaseAgreement.clause1Content'),
    },
    {
      title: t('Global.purchaseAgreement.clause2Title'),
      content: t('Global.purchaseAgreement.clause2Content'),
    },
    {
      title: t('Global.purchaseAgreement.clause3Title'),
      content: t('Global.purchaseAgreement.clause3Content'),
    },
    {
      title: t('Global.purchaseAgreement.clause4Title'),
      content: t('Global.purchaseAgreement.clause4Content'),
    },
    {
      title: t('Global.purchaseAgreement.clause5Title'),
      content: t('Global.purchaseAgreement.clause5Content'),
    },
    {
      title: t('Global.purchaseAgreement.clause6Title'),
      content: t('Global.purchaseAgreement.clause6Content'),
    },
    {
      title: t('Global.purchaseAgreement.clause7Title'),
      content: t('Global.purchaseAgreement.clause7Content'),
    },
  ];

  return (
    <>
      {/* Main Purchase Agreement Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {t('Global.purchaseAgreement.title')}
            </DialogTitle>
            <DialogDescription>
              {t('Global.purchaseAgreement.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Link to read full agreement */}
            <Button
              variant="link"
              className="h-auto p-0 text-primary underline"
              onClick={() => setShowFullAgreement(true)}
            >
              {t('Global.purchaseAgreement.readFullAgreement')}
            </Button>

            {/* Checkbox */}
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <Checkbox
                id="purchase-agreement"
                checked={isAccepted}
                onCheckedChange={(checked) => setIsAccepted(!!checked)}
                className="mt-0.5"
              />
              <label
                htmlFor="purchase-agreement"
                className="text-sm leading-relaxed cursor-pointer"
              >
                {t('Global.purchaseAgreement.checkboxLabel')}
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('Global.cancel')}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!isAccepted || isPending}
            >
              {isPending
                ? t('Global.processing')
                : t('Global.purchaseAgreement.proceedToPayment')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Agreement Text Modal */}
      <Dialog open={showFullAgreement} onOpenChange={setShowFullAgreement}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>
              {t('Global.purchaseAgreement.fullAgreementTitle')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pe-4">
            <div className="space-y-6 text-sm leading-relaxed">
              {agreementClauses.map((clause, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-bold text-base">
                    {index + 1}. {clause.title}
                  </h3>
                  <p className="text-muted-foreground">{clause.content}</p>
                </div>
              ))}
              <div className="mt-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <p className="font-semibold text-center">
                  {t('Global.purchaseAgreement.closing')}
                </p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowFullAgreement(false)}>
              {t('Global.purchaseAgreement.understood')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchaseAgreementModal;
