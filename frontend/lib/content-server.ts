import { readFileSync } from 'fs';
import { join } from 'path';
import { KnowledgeEntry, Project } from '@/types/content';

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

export async function loadKnowledgeEntriesServer(): Promise<KnowledgeEntry[]> {
  try {
    const filePath = join(process.cwd(), 'content', 'knowledge', 'index.json');
    const fileContent = readFileSync(filePath, 'utf8');
    const entries = JSON.parse(fileContent);
    return entries.map(validateKnowledgeEntry);
  } catch (error) {
    console.error('Error loading knowledge entries:', error);
    return [];
  }
}

export async function loadKnowledgeEntryByIdServer(id: string): Promise<KnowledgeEntry | null> {
  try {
    // Try to load individual file first
    try {
      const filePath = join(process.cwd(), 'content', 'knowledge', `${id}.json`);
      const fileContent = readFileSync(filePath, 'utf8');
      const entry = JSON.parse(fileContent);
      return validateKnowledgeEntry(entry);
    } catch {
      // Fallback to index.json
      try {
        const entries = await loadKnowledgeEntriesServer();
        const matchingEntry = entries.find((entry: KnowledgeEntry) => entry.id === id);
        return matchingEntry || null;
      } catch (fallbackError) {
        console.error(`Error loading knowledge entry ${id} from index:`, fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error loading knowledge entry ${id}:`, error);
    return null;
  }
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

export async function loadProjectBySlugServer(slug: string): Promise<Project | null> {
  try {
    const filePath = join(process.cwd(), 'content', 'projects', `${slug}.json`);
    const fileContent = readFileSync(filePath, 'utf8');
    const project = JSON.parse(fileContent);
    return validateProject(project);
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}