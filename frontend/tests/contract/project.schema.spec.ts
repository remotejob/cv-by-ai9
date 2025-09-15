import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const projectSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/project.schema.json",
  "title": "Project",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "title", "summary", "featured", "slug", "externalUrl"],
  "properties": {
    "id": { "type": "string", "minLength": 1 },
    "title": { "type": "string", "minLength": 1, "maxLength": 100 },
    "summary": { "type": "string", "minLength": 1, "maxLength": 280 },
    "tags": { "type": "array", "items": { "type": "string" }, "maxItems": 10 },
    "featured": { "type": "boolean" },
    "slug": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "externalUrl": { "type": "string", "format": "uri", "pattern": "^https://" },
    "ogImage": { "type": "string" }
  }
};

test('Project schema validates correct project data', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(projectSchema);

  const validProject = {
    id: "sample-project",
    title: "Sample Project",
    summary: "A sample project for testing",
    featured: true,
    slug: "sample-project",
    externalUrl: "https://gitlab.com/user/sample-project",
    tags: ["typescript", "nextjs"],
    ogImage: "/images/sample-project.png"
  };

  expect(validate(validProject)).toBe(true);
});

test('Project schema rejects missing required fields', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(projectSchema);

  const invalidProject = {
    id: "incomplete",
    title: "Incomplete Project"
    // Missing required fields: summary, featured, slug, externalUrl
  };

  expect(validate(invalidProject)).toBe(false);
});

test('Project schema validates slug format', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(projectSchema);

  const validSlugProject = {
    id: "valid-slug",
    title: "Valid Slug",
    summary: "Valid slug project",
    featured: false,
    slug: "valid-slug-123",
    externalUrl: "https://gitlab.com/user/valid"
  };

  const invalidSlugProject = {
    id: "invalid-slug",
    title: "Invalid Slug",
    summary: "Invalid slug project",
    featured: false,
    slug: "Invalid_Slug_With_Underscores",
    externalUrl: "https://gitlab.com/user/invalid"
  };

  expect(validate(validSlugProject)).toBe(true);
  expect(validate(invalidSlugProject)).toBe(false);
});

test('Project schema validates external URL format', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(projectSchema);

  const validUrlProject = {
    id: "valid-url",
    title: "Valid URL",
    summary: "Valid URL project",
    featured: false,
    slug: "valid-url",
    externalUrl: "https://gitlab.com/user/project"
  };

  const invalidUrlProject = {
    id: "invalid-url",
    title: "Invalid URL",
    summary: "Invalid URL project",
    featured: false,
    slug: "invalid-url",
    externalUrl: "http://not-https.com/project"
  };

  expect(validate(validUrlProject)).toBe(true);
  expect(validate(invalidUrlProject)).toBe(false);
});