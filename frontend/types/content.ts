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