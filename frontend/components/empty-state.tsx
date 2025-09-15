import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    href: string
    variant?: 'default' | 'outline' | 'destructive'
    ariaLabel?: string
  }
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className = ''
}: EmptyStateProps) {
  return (
    <Card className={`bg-card-bg border-gray-700 text-center ${className}`}>
      <CardContent className="py-12 px-6">
        {icon && (
          <div className="mb-6 flex justify-center" role="img" aria-label={title}>
            {icon}
          </div>
        )}
        <h3 className="text-white text-heading-md mb-4">{title}</h3>
        <p className="text-gray-5 text-body mb-8 max-w-md mx-auto">
          {description}
        </p>
        {action && (
          <Button
            asChild
            variant={action.variant || 'default'}
            className={`${
              action.variant === 'default'
                ? 'bg-accent text-black hover:bg-accent/90'
                : ''
            } focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <Link href={action.href} aria-label={action.ariaLabel || action.label}>
              {action.label}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Predefined empty states for common use cases
export function ProjectsEmptyState() {
  return (
    <EmptyState
      title="No Projects Found"
      description="There are no projects available at the moment. Check back later for new DevOps and infrastructure projects."
      icon={<div className="text-6xl">📂</div>}
      action={{
        label: "Go Home",
        href: "/",
        ariaLabel: "Return to home page"
      }}
    />
  )
}

export function KnowledgeEmptyState() {
  return (
    <EmptyState
      title="No Knowledge Entries Found"
      description="No skills or knowledge entries match your current filters. Try adjusting your search or filter criteria."
      icon={<div className="text-6xl">📚</div>}
      action={{
        label: "Clear Filters",
        href: "/knowledge",
        variant: "outline",
        ariaLabel: "Clear all knowledge filters"
      }}
    />
  )
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      title={`No Results for "${query}"`}
      description="We couldn't find any matches for your search. Try different keywords or check your spelling."
      icon={<div className="text-6xl">🔍</div>}
      action={{
        label: "Clear Search",
        href: "/knowledge",
        variant: "outline",
        ariaLabel: "Clear search query"
      }}
    />
  )
}

export function FilterEmptyState() {
  return (
    <EmptyState
      title="No Matching Entries"
      description="No entries match your selected filters. Try selecting different categories or tags."
      icon={<div className="text-6xl">🏷️</div>}
      action={{
        label: "Reset Filters",
        href: "/knowledge",
        variant: "outline",
        ariaLabel: "Reset all filters"
      }}
    />
  )
}

export function ContactFormEmptyState() {
  return (
    <EmptyState
      title="Message Sent Successfully!"
      description="Thank you for reaching out. I'll get back to you as soon as possible."
      icon={<div className="text-6xl">✉️</div>}
      action={{
        label: "Send Another Message",
        href: "/contact",
        variant: "outline",
        ariaLabel: "Send another message"
      }}
    />
  )
}