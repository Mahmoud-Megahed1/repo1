import { ContactPage } from '@modules/landing/components/contact-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$locale/_globalLayout/contact')({
  component: ContactPage,
});
