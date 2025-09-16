export interface Project {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  featured: boolean;
  slug: string;
  externalUrl: string;
  ogImage?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  link?: string;
  description?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  yearsOfExperience?: number;
  relatedProjects?: string[];
  certifications?: string[];
  learningResources?: Array<{
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'course' | 'certification' | 'blog';
  }>;
  lastUpdated?: string;
}

export interface ContentFilters {
  category?: string;
  tags?: string[];
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}