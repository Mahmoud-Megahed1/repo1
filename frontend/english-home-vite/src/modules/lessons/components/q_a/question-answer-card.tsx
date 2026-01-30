import useLocale from '@hooks/use-locale';
import { localizedNumber } from '@lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { CheckCircle } from 'lucide-react';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionAnswerLesson } from '../../types';
import PlaybackAudio from './playback-audio';
type QuestionAnswerCardProps = {
  index: number;
} & QuestionAnswerLesson;
const QuestionAnswerCard: FC<QuestionAnswerCardProps> = ({
  index,
  question,
  answer,
  answerSrc,
  questionSrc,
}) => {
  const { t } = useTranslation();
  const locale = useLocale() === 'en' ? 'en-US' : 'ar-EG';
  return (
    <Card className="border-none">
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-center text-sm">
              {localizedNumber(index, locale)}
            </span>
            {t('Global.question')}
          </h2>
          <Card lang="en" className="gap-2 shadow-none">
            <CardHeader>
              <CardTitle>{question}</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaybackAudio src={questionSrc} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <CheckCircle className="text-green-600" /> {t('Global.answer')}
          </h2>
          <Card lang="en" className="gap-2 shadow-none">
            <CardHeader>
              <CardTitle>{answer}</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaybackAudio src={answerSrc} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionAnswerCard;
