import type { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const siteConfig = {
  name: 'DevOps Portfolio',
  description: 'Modern DevOps Portfolio Website showcasing infrastructure automation, cloud solutions, and technical expertise',
  url: 'https://your-domain.com',
  ogImage: '/og-image.jpg',
};

export function generateMetadata({
  title,
  description,
  url,
  ogImage,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const pageOgImage = ogImage ? `${siteConfig.url}${ogImage}` : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      'DevOps',
      'Cloud Infrastructure',
      'Automation',
      'Docker',
      'Kubernetes',
      'AWS',
      'Terraform',
      'CI/CD',
      'GitLab',
    ],
    authors: [{ name: 'DevOps Engineer' }],
    creator: 'DevOps Engineer',
    publisher: 'DevOps Engineer',
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageOgImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageOgImage],
      creator: '@yourusername',
    },
    alternates: {
      canonical: pageUrl,
    },
    verification: {
      google: 'your-google-site-verification-code',
    },
  };
}

export function generateStructuredData(type: 'person' | 'website' | 'article' = 'website', data?: Record<string, unknown>) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'person':
      return {
        ...baseStructuredData,
        name: 'DevOps Engineer',
        url: siteConfig.url,
        sameAs: [
          'https://gitlab.com/yourusername',
          'https://linkedin.com/in/yourusername',
          'https://github.com/yourusername',
        ],
        jobTitle: 'DevOps Engineer',
        knowsAbout: [
          'DevOps',
          'Cloud Computing',
          'Infrastructure as Code',
          'Containerization',
          'Continuous Integration',
          'Continuous Deployment',
        ],
      };
    case 'website':
      return {
        ...baseStructuredData,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        author: {
          '@type': 'Person',
          name: 'DevOps Engineer',
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`,
          },
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/knowledge?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };
    case 'article':
      return {
        ...baseStructuredData,
        headline: data?.title || '',
        description: data?.description || '',
        author: {
          '@type': 'Person',
          name: 'DevOps Engineer',
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`,
          },
        },
        datePublished: data?.datePublished || new Date().toISOString(),
        dateModified: data?.dateModified || new Date().toISOString(),
      };
    default:
      return baseStructuredData;
  }
}