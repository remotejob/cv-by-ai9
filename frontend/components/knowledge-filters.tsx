'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface KnowledgeFiltersProps {
  categories: string[];
  tags: string[];
  selectedCategory: string;
  selectedTags: string[];
  searchTerm: string;
}

export function KnowledgeFilters({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  searchTerm
}: KnowledgeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to update search params
  const createSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    return params.toString();
  };

  const handleCategoryChange = (category: string) => {
    const newParams = createSearchParams({ category: category || undefined });
    router.push(`/knowledge${newParams ? '?' + newParams : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const newParams = createSearchParams({ search: search || undefined });
    router.push(`/knowledge${newParams ? '?' + newParams : ''}`);
  };

  return (
    <div className="mb-8 space-y-4" role="region" aria-label="Knowledge filters">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <label htmlFor="knowledge-search" className="sr-only">
          Search skills, technologies, or topics
        </label>
        <input
          id="knowledge-search"
          type="text"
          name="search"
          placeholder="Search skills, technologies, or topics..."
          defaultValue={searchTerm}
          className="w-full px-4 py-2 bg-card-bg border border-gray-700 rounded-lg text-white placeholder-gray-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-describedby="search-help"
        />
        <div id="search-help" className="sr-only">
          Type to filter knowledge entries by title, summary, category, or tags
        </div>
      </form>

      {/* Category Filter */}
      <div>
        <label htmlFor="category-filter" className="block text-white mb-2">
          Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-2 bg-card-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-describedby="category-help"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div id="category-help" className="sr-only">
          Filter knowledge entries by category
        </div>
      </div>

      {/* Tag Filter */}
      <div>
        <label className="block text-white mb-2">Tags</label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tags">
          {tags.slice(0, 12).map(tag => (
            <Link
              key={tag}
              href={`/knowledge?${createSearchParams({
                tags: selectedTags.includes(tag)
                  ? selectedTags.filter((t: string) => t !== tag).join(',')
                  : [...selectedTags, tag].join(',')
              })}`}
              className={`px-3 py-1 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 ${
                selectedTags.includes(tag)
                  ? 'bg-accent text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || selectedTags.length > 0 || searchTerm) && (
        <div>
          <Link
            href="/knowledge"
            className="inline-block px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            Clear All Filters
          </Link>
        </div>
      )}
    </div>
  );
}