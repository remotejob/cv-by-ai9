import { Project, KnowledgeEntry, ContentFilters, PaginationOptions, PaginatedResult } from '@/types/content';

export async function loadProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/projects/index.json`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.statusText}`);
    }
    const projects = await response.json();
    return projects.map(validateProject);
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export async function loadProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/projects/${slug}.json`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      return null;
    }
    const project = await response.json();
    return validateProject(project);
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

export async function loadKnowledgeEntries(filters?: ContentFilters): Promise<KnowledgeEntry[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/knowledge/index.json`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`Failed to load knowledge entries: ${response.statusText}`);
    }
    let entries = await response.json();

    entries = entries.map(validateKnowledgeEntry);

    if (filters) {
      entries = filterKnowledgeEntries(entries, filters);
    }

    return entries;
  } catch (error) {
    console.error('Error loading knowledge entries:', error);
    return [];
  }
}

export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter(project => project.featured).slice(0, 3);
}

export function paginateProjects(projects: Project[], options: PaginationOptions): PaginatedResult<Project> {
  const { page, limit } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProjects = projects.slice(startIndex, endIndex);

  return {
    data: paginatedProjects,
    total: projects.length,
    page,
    limit,
    totalPages: Math.ceil(projects.length / limit)
  };
}

function validateProject(project: Record<string, unknown>): Project {
  if (!project.id || typeof project.id !== 'string') {
    throw new Error('Project validation failed: Invalid or missing id');
  }
  if (!project.title || typeof project.title !== 'string' || project.title.length > 100) {
    throw new Error('Project validation failed: Invalid title');
  }
  if (!project.summary || typeof project.summary !== 'string' || project.summary.length > 280) {
    throw new Error('Project validation failed: Invalid summary');
  }
  if (typeof project.featured !== 'boolean') {
    throw new Error('Project validation failed: Invalid featured flag');
  }
  if (!project.slug || typeof project.slug !== 'string' || !/^[a-z0-9-]+$/.test(project.slug)) {
    throw new Error('Project validation failed: Invalid slug');
  }
  if (!project.externalUrl || typeof project.externalUrl !== 'string' || !project.externalUrl.startsWith('https://')) {
    throw new Error('Project validation failed: Invalid external URL');
  }
  if (project.tags && !Array.isArray(project.tags)) {
    throw new Error('Project validation failed: Invalid tags');
  }

  return project as unknown as Project;
}

function validateKnowledgeEntry(entry: Record<string, unknown>): KnowledgeEntry {
  if (!entry.id || typeof entry.id !== 'string') {
    throw new Error('KnowledgeEntry validation failed: Invalid or missing id');
  }
  if (!entry.title || typeof entry.title !== 'string' || entry.title.length > 100) {
    throw new Error('KnowledgeEntry validation failed: Invalid title');
  }
  if (!entry.summary || typeof entry.summary !== 'string' || entry.summary.length > 280) {
    throw new Error('KnowledgeEntry validation failed: Invalid summary');
  }
  if (!entry.category || typeof entry.category !== 'string') {
    throw new Error('KnowledgeEntry validation failed: Invalid category');
  }
  if (entry.tags && !Array.isArray(entry.tags)) {
    throw new Error('KnowledgeEntry validation failed: Invalid tags');
  }

  return entry as unknown as KnowledgeEntry;
}

function filterKnowledgeEntries(entries: KnowledgeEntry[], filters: ContentFilters): KnowledgeEntry[] {
  let filtered = [...entries];

  if (filters.category) {
    filtered = filtered.filter(entry =>
      entry.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(entry =>
      filters.tags!.some(tag =>
        entry.tags.some(entryTag =>
          entryTag.toLowerCase() === tag.toLowerCase()
        )
      )
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.summary.toLowerCase().includes(searchTerm) ||
      entry.category.toLowerCase().includes(searchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return filtered;
}

export function getUniqueCategories(entries: KnowledgeEntry[]): string[] {
  const categories = new Set(entries.map(entry => entry.category));
  return Array.from(categories).sort();
}

export function getUniqueTags(entries: KnowledgeEntry[]): string[] {
  const tags = new Set(entries.flatMap(entry => entry.tags));
  return Array.from(tags).sort();
}