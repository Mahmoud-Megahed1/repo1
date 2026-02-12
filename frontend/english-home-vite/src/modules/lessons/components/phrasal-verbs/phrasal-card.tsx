import { cn } from '@lib/utils';
import { type FC } from 'react';
import BackSide from './back-side';
import FrontSide from './front-side';

type Props = {
  isFlipped: boolean;
  onFlip?: () => void;
  phrasalVerb: {
    definitionAr: string;
    definitionEn: string;
    exampleAr: string;
    exampleEn: string;
    pictureSrc: string;
    soundSrc: string;
    sentence: string;
  };
};
const PhrasalCard: FC<Props> = ({
  isFlipped,
  onFlip,
  phrasalVerb: {
    definitionAr,
    definitionEn,
    exampleAr,
    exampleEn,
    pictureSrc,
    soundSrc,
    sentence,
  },
}) => {
  return (
    <div
      className={cn(
        `transform-3d relative h-[400px] w-full transition-transform duration-700`,
        {
          'rotate-y-180': isFlipped,
        }
      )}
    >
      <FrontSide
        definitionAr={definitionAr}
        definitionEn={definitionEn}
        pictureSrc={pictureSrc}
        soundSrc={soundSrc}
        onFlip={onFlip}
      />
      <BackSide
        exampleAr={exampleAr}
        exampleEn={exampleEn}
        sentence={sentence}
        onFlip={onFlip}
      />
    </div>
  );
};

export default PhrasalCard;
