import { Link } from '@shared/i18n/routing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/accordion';
import { useTranslation } from 'react-i18next';
const FAQ_LENGTH = 5;

const FAQ = () => {
  const { t } = useTranslation();

  return (
    <section id="faq" className="py-10 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t('Landing.fqa.title')}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {t('Landing.fqa.description')}
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="multiple" className="space-y-4">
            {Array.from({ length: FAQ_LENGTH }).map((_, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border-muted rounded-lg border px-6 py-2"
              >
                <AccordionTrigger className="font-medium">
                  {t(`Landing.fqa.questions.${i}.question` as never)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {t(`Landing.fqa.questions.${i}.answer` as never)}
                  {i === 4 && (
                    <Link
                      to="/privacy-policy"
                      className="text-primary ms-1 underline underline-offset-4"
                    >
                      {t('PrivacyPolicy.title')}
                    </Link>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
