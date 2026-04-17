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
  onAudioPlay?: () => void;
} & QuestionAnswerLesson;
const QuestionAnswerCard: FC<QuestionAnswerCardProps> = ({
  index,
  question,
  answer,
  answerSrc,
  questionSrc,
  onAudioPlay,
}) => {
  const { t } = useTranslation();
  const locale = useLocale() === 'en' ? 'en-US' : 'ar-EG';
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-0 md:py-3" dir="ltr">
        <div className="space-y-2" dir={locale === 'en-US' ? 'ltr' : 'rtl'}>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-center text-sm">
              {localizedNumber(index, locale)}
            </span>
            {t('Global.question')}
          </h2>
          <Card lang="en" className="gap-2 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{question}</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaybackAudio src={questionSrc} onPlay={onAudioPlay} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-2" dir={locale === 'en-US' ? 'ltr' : 'rtl'}>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <CheckCircle className="text-green-600" /> {t('Global.answer')}
          </h2>
          <Card lang="en" className="gap-2 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{answer}</CardTitle>
            </CardHeader>
            <CardContent>
              <PlaybackAudio src={answerSrc} onPlay={onAudioPlay} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionAnswerCard;
