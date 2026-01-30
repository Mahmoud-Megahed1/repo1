import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@ui/card';
import { EyeOff } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  exampleAr: string;
  exampleEn: string;

  sentence: string;
  onFlip?: () => void;
};
const BackSide: FC<Props> = ({ exampleAr, exampleEn, sentence, onFlip }) => {
  const { t } = useTranslation();
  return (
    <Card
      className={cn(
        'backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center border-none'
      )}
    >
      <CardContent className="flex w-full flex-col items-center justify-center gap-4">
        <CardTitle className="text-xl font-bold">
          {t('Global.example')}
        </CardTitle>
        <CardDescription
          lang="en"
          className="text-center text-lg font-medium italic"
        >
          <q>{sentence}</q>
        </CardDescription>
        <div className="bg-accent/40 w-full space-y-2 rounded-lg px-6 py-4 text-center">
          <p className="text-muted-foreground text-sm">
            {t('Global.phrasalVerb')}
          </p>
          <p lang="en" className="text-xl font-bold capitalize">
            {exampleEn}
          </p>
          <p lang="ar" className="text-xl font-bold">
            {exampleAr}
          </p>
        </div>
        <Button variant={'secondary'} onClick={onFlip}>
          <EyeOff /> {t('Global.back')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BackSide;
