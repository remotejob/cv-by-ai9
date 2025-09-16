import { loadKnowledgeEntriesServer } from '@/lib/content-server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KnowledgeFilters } from '@/components/knowledge-filters';
import Link from 'next/link';
import { Suspense } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge & Skills',
  description: 'Explore my technical expertise across DevOps, cloud infrastructure, and automation technologies'
};

interface KnowledgePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function KnowledgePage({
  searchParams,
}: KnowledgePageProps) {
  // Load all entries at build time
  const allEntries = await loadKnowledgeEntriesServer();

  // Get unique categories for filter options
  const categories = Array.from(new Set(allEntries.map(entry => entry.category)));

  // Get all unique tags
  const tags = Array.from(new Set(allEntries.flatMap(entry => entry.tags)));

  // For static export, default to empty filters during build
  let selectedCategory = '';
  let selectedTags: string[] = [];
  let searchTerm = '';

  try {
    const resolvedSearchParams = await searchParams;
    selectedCategory = typeof resolvedSearchParams?.category === 'string' ? resolvedSearchParams.category : '';
    selectedTags = typeof resolvedSearchParams?.tags === 'string' ? resolvedSearchParams.tags.split(',').filter(Boolean) : [];
    searchTerm = typeof resolvedSearchParams?.search === 'string' ? resolvedSearchParams.search : '';
  } catch {
    // During static generation, searchParams may not be available, use defaults
  }

  const filteredEntries = allEntries.filter(entry => {
    const matchesCategory = !selectedCategory || entry.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag: string) => entry.tags.includes(tag));
    const matchesSearch = !searchTerm ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesTags && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-20" id="main-content">
      <section className="py-16 px-4" aria-labelledby="knowledge-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="knowledge-heading" className="text-heading-xl font-bold text-white mb-4">
              Skills & Knowledge
            </h1>
            <p className="text-heading-lg text-gray-5 max-w-3xl mx-auto">
              Explore my technical expertise across DevOps, cloud infrastructure, and automation technologies
            </p>
          </div>

          {/* Filters */}
          <Suspense fallback={
            <div className="mb-8 space-y-4">
              <div className="h-12 bg-card-bg border border-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-card-bg border border-gray-700 rounded-lg animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 w-16 bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          }>
            <KnowledgeFilters
              categories={categories}
              tags={tags}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              searchTerm={searchTerm}
            />
          </Suspense>

          {/* Results */}
          <div className="mb-4 text-gray-5 text-body" role="status">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </div>

          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="bg-card-bg border-gray-700 hover:border-accent transition-colors h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-heading-md">{entry.title}</CardTitle>
                      <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                        {entry.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <CardDescription className="text-gray-5 text-body mb-4 flex-grow">
                      {entry.summary}
                    </CardDescription>

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {entry.tags.length > 3 && (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            +{entry.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full mt-auto"
                    >
                      <Link
                        href={`/knowledge/${entry.id}`}
                      >
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-5">No entries found matching your criteria.</p>
              <Link
                href="/knowledge"
                className="inline-block mt-4 px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}