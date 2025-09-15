import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  loadProjects,
  loadKnowledgeEntries,
  getFeaturedProjects,
  paginateProjects,
  getUniqueCategories,
  getUniqueTags,
  validateProject,
  validateKnowledgeEntry,
  ContentFilters,
  PaginationOptions,
  PaginatedResult
} from '@/lib/content'
import { Project, KnowledgeEntry } from '@/types/content'

// Mock file system operations
const mockFs = {
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
  readdirSync: vi.fn()
}

vi.mock('fs', () => mockFs)

// Mock path operations
const mockPath = {
  join: vi.fn((...args) => args.join('/')),
  resolve: vi.fn((...args) => args.join('/'))
}

vi.mock('path', () => mockPath)

describe('Content Loading Utilities', () => {
  const mockProject: Project = {
    id: 'test-project',
    title: 'Test Project',
    slug: 'test-project',
    summary: 'A test project for unit testing',
    description: 'Detailed description of test project',
    externalUrl: 'https://gitlab.com/test/project',
    ogImage: 'https://example.com/image.jpg',
    tags: ['TypeScript', 'Next.js', 'Testing'],
    featured: true,
    publishedAt: '2024-01-01T00:00:00Z',
    content: '# Test Content\n\nThis is test content.'
  }

  const mockKnowledgeEntry: KnowledgeEntry = {
    id: 'test-knowledge',
    title: 'Test Knowledge',
    summary: 'Test knowledge entry',
    description: 'Detailed description',
    category: 'Programming',
    tags: ['TypeScript', 'Testing'],
    link: '/knowledge/test',
    content: '# Test Knowledge Content\n\nDetailed information.',
    publishedAt: '2024-01-01T00:00:00Z',
    lastUpdated: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('loadProjects', () => {
    it('should load and validate projects successfully', async () => {
      const mockProjects = [mockProject]
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['project1.json', 'project2.json'])
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockProject))

      const result = await loadProjects()

      expect(result).toEqual(mockProjects)
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.any(String))
      expect(mockFs.readdirSync).toHaveBeenCalledWith(expect.any(String))
      expect(mockFs.readFileSync).toHaveBeenCalledTimes(2)
    })

    it('should return empty array when projects directory does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false)

      const result = await loadProjects()

      expect(result).toEqual([])
      expect(mockFs.existsSync).toHaveBeenCalledWith(expect.any(String))
      expect(mockFs.readdirSync).not.toHaveBeenCalled()
    })

    it('should handle invalid JSON gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['invalid.json'])
      mockFs.readFileSync.mockReturnValue('invalid json')

      const result = await loadProjects()

      expect(result).toEqual([])
    })

    it('should filter out invalid projects', async () => {
      const invalidProject = { ...mockProject, title: '' } // Invalid: missing required title
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['valid.json', 'invalid.json'])
      mockFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockProject))
        .mockReturnValueOnce(JSON.stringify(invalidProject))

      const result = await loadProjects()

      expect(result).toEqual([mockProject])
    })
  })

  describe('loadKnowledgeEntries', () => {
    it('should load and validate knowledge entries successfully', async () => {
      const mockEntries = [mockKnowledgeEntry]
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['knowledge1.json', 'knowledge2.json'])
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockKnowledgeEntry))

      const result = await loadKnowledgeEntries()

      expect(result).toEqual(mockEntries)
    })

    it('should apply filters correctly', async () => {
      const mockEntries = [
        mockKnowledgeEntry,
        { ...mockKnowledgeEntry, category: 'DevOps', tags: ['Docker'] }
      ]
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['entry1.json', 'entry2.json'])
      mockFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockEntries[0]))
        .mockReturnValueOnce(JSON.stringify(mockEntries[1]))

      const filters: ContentFilters = {
        category: 'Programming',
        tags: ['TypeScript']
      }

      const result = await loadKnowledgeEntries(filters)

      expect(result).toEqual([mockKnowledgeEntry])
    })

    it('should handle search filter', async () => {
      const mockEntries = [
        mockKnowledgeEntry,
        { ...mockKnowledgeEntry, title: 'Different Title', summary: 'Completely different' }
      ]
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['entry1.json', 'entry2.json'])
      mockFs.readFileSync
        .mockReturnValueOnce(JSON.stringify(mockEntries[0]))
        .mockReturnValueOnce(JSON.stringify(mockEntries[1]))

      const filters: ContentFilters = {
        search: 'Test Knowledge'
      }

      const result = await loadKnowledgeEntries(filters)

      expect(result).toEqual([mockKnowledgeEntry])
    })

    it('should return empty array when knowledge directory does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false)

      const result = await loadKnowledgeEntries()

      expect(result).toEqual([])
    })
  })

  describe('getFeaturedProjects', () => {
    it('should return only featured projects', () => {
      const projects = [
        { ...mockProject, featured: true },
        { ...mockProject, id: 'project2', featured: false },
        { ...mockProject, id: 'project3', featured: true }
      ]

      const result = getFeaturedProjects(projects)

      expect(result).toEqual([
        expect.objectContaining({ id: 'test-project', featured: true }),
        expect.objectContaining({ id: 'project3', featured: true })
      ])
    })

    it('should return empty array when no featured projects', () => {
      const projects = [
        { ...mockProject, featured: false },
        { ...mockProject, id: 'project2', featured: false }
      ]

      const result = getFeaturedProjects(projects)

      expect(result).toEqual([])
    })

    it('should return empty array for empty input', () => {
      const result = getFeaturedProjects([])

      expect(result).toEqual([])
    })
  })

  describe('paginateProjects', () => {
    const mockProjects = Array.from({ length: 25 }, (_, i) => ({
      ...mockProject,
      id: `project-${i + 1}`,
      title: `Project ${i + 1}`
    }))

    it('should paginate projects correctly', () => {
      const options: PaginationOptions = {
        page: 2,
        limit: 10
      }

      const result = paginateProjects(mockProjects, options)

      expect(result.data).toHaveLength(10)
      expect(result.data[0].id).toBe('project-11')
      expect(result.data[9].id).toBe('project-20')
      expect(result.total).toBe(25)
      expect(result.totalPages).toBe(3)
      expect(result.currentPage).toBe(2)
    })

    it('should handle first page', () => {
      const options: PaginationOptions = {
        page: 1,
        limit: 10
      }

      const result = paginateProjects(mockProjects, options)

      expect(result.data).toHaveLength(10)
      expect(result.data[0].id).toBe('project-1')
      expect(result.data[9].id).toBe('project-10')
    })

    it('should handle last page', () => {
      const options: PaginationOptions = {
        page: 3,
        limit: 10
      }

      const result = paginateProjects(mockProjects, options)

      expect(result.data).toHaveLength(5)
      expect(result.data[0].id).toBe('project-21')
      expect(result.data[4].id).toBe('project-25')
    })

    it('should return empty result for page out of range', () => {
      const options: PaginationOptions = {
        page: 10,
        limit: 10
      }

      const result = paginateProjects(mockProjects, options)

      expect(result.data).toEqual([])
      expect(result.total).toBe(25)
      expect(result.totalPages).toBe(3)
      expect(result.currentPage).toBe(10)
    })

    it('should handle default pagination', () => {
      const result = paginateProjects(mockProjects)

      expect(result.data).toHaveLength(12) // Default limit
      expect(result.total).toBe(25)
      expect(result.currentPage).toBe(1)
    })

    it('should handle empty projects array', () => {
      const result = paginateProjects([])

      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(0)
      expect(result.currentPage).toBe(1)
    })
  })

  describe('getUniqueCategories', () => {
    it('should return unique categories', () => {
      const entries = [
        { ...mockKnowledgeEntry, category: 'Programming' },
        { ...mockKnowledgeEntry, category: 'DevOps' },
        { ...mockKnowledgeEntry, category: 'Programming' },
        { ...mockKnowledgeEntry, category: 'Cloud' }
      ]

      const result = getUniqueCategories(entries)

      expect(result).toEqual(['Cloud', 'DevOps', 'Programming']) // Should be sorted
    })

    it('should return empty array for empty entries', () => {
      const result = getUniqueCategories([])

      expect(result).toEqual([])
    })
  })

  describe('getUniqueTags', () => {
    it('should return unique tags', () => {
      const entries = [
        { ...mockKnowledgeEntry, tags: ['TypeScript', 'Next.js'] },
        { ...mockKnowledgeEntry, tags: ['Next.js', 'React'] },
        { ...mockKnowledgeEntry, tags: ['TypeScript', 'Docker'] }
      ]

      const result = getUniqueTags(entries)

      expect(result).toEqual(['Docker', 'Next.js', 'React', 'TypeScript']) // Should be sorted
    })

    it('should handle empty tags arrays', () => {
      const entries = [
        { ...mockKnowledgeEntry, tags: [] },
        { ...mockKnowledgeEntry, tags: ['TypeScript'] },
        { ...mockKnowledgeEntry, tags: [] }
      ]

      const result = getUniqueTags(entries)

      expect(result).toEqual(['TypeScript'])
    })

    it('should return empty array for empty entries', () => {
      const result = getUniqueTags([])

      expect(result).toEqual([])
    })
  })

  describe('validateProject', () => {
    it('should validate correct project', () => {
      const result = validateProject(mockProject)

      expect(result).toBe(true)
    })

    it('should reject project missing required fields', () => {
      const invalidProject = { ...mockProject, title: '' }

      const result = validateProject(invalidProject)

      expect(result).toBe(false)
    })

    it('should reject project with invalid URL', () => {
      const invalidProject = { ...mockProject, externalUrl: 'not-a-url' }

      const result = validateProject(invalidProject)

      expect(result).toBe(false)
    })

    it('should reject project with invalid date', () => {
      const invalidProject = { ...mockProject, publishedAt: 'invalid-date' }

      const result = validateProject(invalidProject)

      expect(result).toBe(false)
    })
  })

  describe('validateKnowledgeEntry', () => {
    it('should validate correct knowledge entry', () => {
      const result = validateKnowledgeEntry(mockKnowledgeEntry)

      expect(result).toBe(true)
    })

    it('should reject entry missing required fields', () => {
      const invalidEntry = { ...mockKnowledgeEntry, title: '' }

      const result = validateKnowledgeEntry(invalidEntry)

      expect(result).toBe(false)
    })

    it('should reject entry with invalid dates', () => {
      const invalidEntry = { ...mockKnowledgeEntry, publishedAt: 'invalid-date' }

      const result = validateKnowledgeEntry(invalidEntry)

      expect(result).toBe(false)
    })
  })
})

describe('Content Loading Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle file system errors gracefully', async () => {
    mockFs.existsSync.mockImplementation(() => {
      throw new Error('File system error')
    })

    const result = await loadProjects()

    expect(result).toEqual([])
  })

  it('should handle JSON parsing errors', async () => {
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readdirSync.mockReturnValue(['test.json'])
    mockFs.readFileSync.mockReturnValue('{ invalid json }')

    const result = await loadProjects()

    expect(result).toEqual([])
  })

  it('should handle mixed valid and invalid files', async () => {
    const validProject = mockProject
    const invalidJson = '{ invalid }'

    mockFs.existsSync.mockReturnValue(true)
    mockFs.readdirSync.mockReturnValue(['valid.json', 'invalid.json', 'nonexistent.json'])
    mockFs.readFileSync
      .mockReturnValueOnce(JSON.stringify(validProject))
      .mockReturnValueOnce(invalidJson)
      .mockImplementationOnce(() => {
        throw new Error('File not found')
      })

    const result = await loadProjects()

    expect(result).toEqual([validProject])
  })
})

describe('Performance Considerations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should only read files once per call', async () => {
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readdirSync.mockReturnValue(['test1.json', 'test2.json'])
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockProject))

    await loadProjects()

    expect(mockFs.readFileSync).toHaveBeenCalledTimes(2)
  })

  it('should cache directory existence checks', async () => {
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readdirSync.mockReturnValue(['test.json'])
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockProject))

    await loadProjects()

    expect(mockFs.existsSync).toHaveBeenCalledTimes(1)
  })
})