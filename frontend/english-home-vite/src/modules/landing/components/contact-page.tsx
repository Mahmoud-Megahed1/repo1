import {
  FacebookIcon,
  InstagramIcon,
  SnapchatIcon,
  TelegramIcon,
  TiktokIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from '@components/icons';
import usePageTitle from '@hooks/use-page-title';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Separator } from '@shared/components/ui/separator';
import { CONTACT_INFO } from '@shared/constants';
import { Mail, MessageCircle, Phone, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LandingLayout from './landing-layout';

export function ContactPage() {
  const { t } = useTranslation();
  usePageTitle(t('Landing.contact.title'));

  const emailContacts = [
    {
      type: t('Landing.contact.emails.support.type'),
      email: CONTACT_INFO.support,
      description: t('Landing.contact.emails.support.description'),
      icon: Mail,
    },
    {
      type: t('Landing.contact.emails.info.type'),
      email: CONTACT_INFO.info,
      description: t('Landing.contact.emails.info.description'),
      icon: MessageCircle,
    },
    {
      type: t('Landing.contact.emails.billing.type'),
      email: CONTACT_INFO.billing,
      description: t('Landing.contact.emails.billing.description'),
      icon: Phone,
    },
    {
      type: t('Landing.contact.emails.admin.type'),
      email: CONTACT_INFO.admin,
      description: t('Landing.contact.emails.admin.description'),
      icon: Shield,
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/19wWacNacT/',
      icon: FacebookIcon,
      description: t('Landing.contact.social.facebook'),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/englishom1',
      icon: InstagramIcon,
      description: t('Landing.contact.social.instagram'),
    },
    {
      name: 'Snapchat',
      href: 'https://www.snapchat.com/add/englishom25',
      icon: SnapchatIcon,
      description: t('Landing.contact.social.snapchat'),
    },
    {
      name: 'Telegram',
      href: 'https://t.me/+xlzna51reL1hNzc0',
      icon: TelegramIcon,
      description: t('Landing.contact.social.telegram'),
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/qr/NLKCDGU2XBMEE1',
      icon: WhatsappIcon,
      description: t('Landing.contact.social.whatsapp'),
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@englishom1?_t=ZS-8zrqZgIC37K&_r=1',
      icon: TiktokIcon,
      description: t('Landing.contact.social.tiktok'),
    },
    {
      name: 'X (Twitter)',
      href: 'https://x.com/englishom28264',
      icon: XIcon,
      description: t('Landing.contact.social.twitter'),
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@EglishHOM',
      icon: YoutubeIcon,
      description: t('Landing.contact.social.youtube'),
    },
  ];

  return (
    <LandingLayout>
      <div className="container mx-auto py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
            {t('Landing.contact.title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('Landing.contact.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Email Contacts Section */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                {t('Landing.contact.emailsSection.title')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('Landing.contact.emailsSection.description')}
              </p>
            </div>

            <div className="space-y-4">
              {emailContacts.map(
                ({ type, description, email, icon: Icon }, index) => (
                  <Card
                    key={index}
                    className="gap-0 transition-all duration-300 hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type}</CardTitle>
                          <CardDescription>{description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="ps-[76px] pt-0">
                      <a
                        href={`mailto:${email}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {email}
                      </a>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                {t('Landing.contact.socialSection.title')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('Landing.contact.socialSection.description')}
              </p>
            </div>

            <div className="columns-1 gap-4 space-y-4 sm:columns-2">
              {socialLinks.map(
                ({ description, href, icon: Icon, name }, index) => (
                  <Card
                    key={index}
                    className="group transition-all duration-300 hover:shadow-md"
                  >
                    <CardContent>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                      >
                        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium">{name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {description}
                          </p>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {t('Landing.contact.additionalInfo.title')}
              </CardTitle>
              <Separator className="mt-2 opacity-40 dark:opacity-80" />
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                {t('Landing.contact.additionalInfo.responseTime')}
              </p>
              <p className="text-muted-foreground">
                {t('Landing.contact.additionalInfo.languages')}
              </p>
              <div className="border-border/50 rounded-lg border p-4">
                <p className="text-primary font-medium">
                  {t('Landing.contact.additionalInfo.preferredEmail')}
                </p>
                <a
                  href={`mailto:${CONTACT_INFO.support}`}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {CONTACT_INFO.support}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LandingLayout>
  );
}
