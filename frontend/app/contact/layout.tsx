import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Contact',
  description: 'Get in touch for DevOps consulting, collaboration opportunities, or technical inquiries. Contact form and email available.',
  url: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}