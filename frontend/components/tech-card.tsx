'use client'

import Link from 'next/link'

interface TechCardProps {
  tech: string
}

export function TechCard({ tech }: TechCardProps) {
  return (
    <Link
      href="/knowledge"
      className="bg-card-bg border border-gray-700 rounded-lg p-4 hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
      role="listitem"
      aria-label={`View ${tech} skills and expertise`}
    >
      <div className="text-accent font-bold text-body">{tech}</div>
    </Link>
  )
}