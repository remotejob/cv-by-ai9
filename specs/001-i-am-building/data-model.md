# Data Model

## Entities

### Project
- id: string (slug-safe unique id)
- title: string (1-100)
- summary: string (1-280)
- tags: string[] (0-10)
- featured: boolean
- slug: string (matches id)
- externalUrl: string (https GitLab URL)
- ogImage: string (relative path) optional

Validation
- title, summary required; tags optional; externalUrl must be https
- Exactly 3 projects have featured=true

### KnowledgeEntry
- id: string (slug-safe)
- title: string (1-100)
- summary: string (1-280)
- category: string (primary)
- tags: string[] (0-10)
- link: string (internal path or external reference)

Validation
- title, category required; tags optional

## Relationships
- Project has many tags
- KnowledgeEntry has one primary category and many tags
