import type { LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { useCallback, useRef, useState, type ComponentProps } from 'react';
import { useCertification } from '../queries';
import { useTranslation } from 'react-i18next';

type Props = {
  name: string;
  levelId: LevelId;
  canCertificate?: boolean;
} & ComponentProps<typeof Button>;
const Certification = ({
  levelId,
  name,
  canCertificate = false,
  ...props
}: Props) => {
  const { data, isLoading } = useCertification(levelId);
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const certification = data?.data;
  const ref = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (ref.current === null) return;
    setIsGenerating(true);
    toPng(ref.current, {
      cacheBust: true,
      skipFonts: true,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Englishome_Certification_of_${levelId}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsGenerating(false));
  }, [ref, levelId]);
  if (isLoading) return null;
  if (!canCertificate) return null;
  return (
    <>
      {certification && (
        <>
          <Button onClick={onButtonClick} disabled={isGenerating} {...props}>
            {isGenerating ? (
              <>{t('Global.generating')}...</>
            ) : (
              <>
                <Download /> {t('Global.certification')}
              </>
            )}
          </Button>
          <div lang="en" className="fixed left-[-999999px]">
            <div ref={ref} className="relative aspect-[5500/3889] w-[800px]">
              <img
                src="/certification.webp"
                alt="certification"
                className="size-full"
              />
              <h1
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+70px)] text-black`}
              >
                {new Date(certification.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h1>
              <h1
                className={`absolute left-1/2 top-1/2 z-10 w-full max-w-[500px] -translate-x-1/2 -translate-y-[calc(50%+10px)] text-center text-3xl font-bold text-black`}
              >
                {name}
              </h1>
              <span
                className={`absolute left-[calc(50%+155px)] top-1/2 z-10 w-full -translate-x-1/2 translate-y-[calc(50%+8px)] text-center text-lg font-bold capitalize text-black`}
              >
                {levelId.replace('_', ' ')}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Certification;
