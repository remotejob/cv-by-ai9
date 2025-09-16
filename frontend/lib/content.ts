import { Project, KnowledgeEntry, ContentFilters, PaginationOptions, PaginatedResult } from '@/types/content';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, retries = RETRY_COUNT): Promise<Response> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying fetch for ${url}, ${retries} attempts remaining...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function loadProjects(): Promise<Project[]> {
  try {
    const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/projects/index.json`);
    const projects = await response.json();
    return projects.map(validateProject);
  } catch (error) {
    console.error('Error loading projects:', error);
    throw new Error('Failed to load projects. Check network connection and try again.');
  }
}

export async function loadProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/projects/${slug}.json`);
    const project = await response.json();
    return validateProject(project);
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

export async function loadKnowledgeEntries(filters?: ContentFilters): Promise<KnowledgeEntry[]> {
  try {
    const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/knowledge/index.json`);
    let entries = await response.json();

    entries = entries.map(validateKnowledgeEntry);

    if (filters) {
      entries = filterKnowledgeEntries(entries, filters);
    }

    return entries;
  } catch (error) {
    console.error('Error loading knowledge entries:', error);
    throw new Error('Failed to load knowledge entries. Check network connection and try again.');
  }
}

export async function loadKnowledgeEntryById(id: string): Promise<KnowledgeEntry | null> {
  try {
    const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/knowledge/${id}.json`);
    const entry = await response.json();
    return validateKnowledgeEntry(entry);
  } catch (error) {
    // Fallback to index.json
    try {
      console.warn(`Failed to load ${id}.json, falling back to index.json...`);
      const indexResponse = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/content/knowledge/index.json`);
      const entries = await indexResponse.json();
      const validatedEntries = entries.map(validateKnowledgeEntry);
      const matchingEntry = validatedEntries.find((entry: KnowledgeEntry) => entry.id === id);
      return matchingEntry || null;
    } catch (fallbackError) {
      console.error(`Error loading knowledge entry ${id} from index:`, fallbackError);
      return null;
    }
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
  if (!Array.isArray(entry.tags) || entry.tags.some(t => typeof t !== 'string')) {
    throw new Error('KnowledgeEntry validation failed: Invalid or missing tags');
  }

  return entry as unknown as KnowledgeEntry;
}

export function filterKnowledgeEntries(entries: KnowledgeEntry[], filters: ContentFilters): KnowledgeEntry[] {
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