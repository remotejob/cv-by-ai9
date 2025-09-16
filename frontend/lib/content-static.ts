import { promises as fs } from 'fs'
import path from 'path'
import { KnowledgeEntry, Project } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/**
 * Load all knowledge entries during build time
 */
export async function loadKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  try {
    const knowledgePath = path.join(CONTENT_DIR, 'knowledge')
    const indexPath = path.join(knowledgePath, 'index.json')
    
    const indexContent = await fs.readFile(indexPath, 'utf-8')
    const entryIds = JSON.parse(indexContent) as string[]
    
    const entries = await Promise.all(
      entryIds.map(async (id) => {
        const entryPath = path.join(knowledgePath, `${id}.json`)
        const content = await fs.readFile(entryPath, 'utf-8')
        return JSON.parse(content) as KnowledgeEntry
      })
    )

    return entries
  } catch (error) {
    console.error('Error loading knowledge entries:', error)
    return []
  }
}

/**
 * Load all projects during build time
 */
export async function loadProjects(): Promise<Project[]> {
  try {
    const projectsPath = path.join(CONTENT_DIR, 'projects')
    const indexPath = path.join(projectsPath, 'index.json')
    
    const indexContent = await fs.readFile(indexPath, 'utf-8')
    const projects = JSON.parse(indexContent) as Project[]
    
    return projects
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

/**
 * Load a specific project by slug during build time
 */
export async function loadProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projectPath = path.join(CONTENT_DIR, 'projects', `${slug}.json`)
    const content = await fs.readFile(projectPath, 'utf-8')
    return JSON.parse(content) as Project
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error)
    return null
  }
}

/**
 * Filter knowledge entries by category and search term
 */
export function filterKnowledgeEntries(
  entries: KnowledgeEntry[],
  category?: string,
  search?: string
): KnowledgeEntry[] {
  return entries.filter((entry) => {
    const matchesCategory = !category || entry.category === category
    const matchesSearch = !search || 
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.summary.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })
}