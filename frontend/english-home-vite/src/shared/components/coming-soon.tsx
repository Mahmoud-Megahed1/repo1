import { cn } from '@lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';

const ComingSoon: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(`flex flex-1 items-center justify-center`, className)}
      {...props}
    >
      <Card className="w-full gap-2 border-none md:max-w-[500px]">
        <CardHeader className="border-0">
          <CardTitle className="from-primary to-secondary mx-auto bg-gradient-to-bl bg-clip-text text-4xl font-bold text-transparent">
            {t('Global.comingSoon')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-base font-medium">
            {t('Global.comingSoonMessage')}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
