import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Skills & Knowledge',
  description: 'Explore technical expertise across DevOps, cloud infrastructure, containerization, and automation technologies.',
  url: '/knowledge',
});

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}