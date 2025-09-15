import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const knowledgeEntrySchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/knowledge-entry.schema.json",
  "title": "KnowledgeEntry",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "title", "summary", "category"],
  "properties": {
    "id": { "type": "string", "minLength": 1 },
    "title": { "type": "string", "minLength": 1, "maxLength": 100 },
    "summary": { "type": "string", "minLength": 1, "maxLength": 280 },
    "category": { "type": "string", "minLength": 1 },
    "tags": { "type": "array", "items": { "type": "string" }, "maxItems": 10 },
    "link": { "type": "string" }
  }
};

test('KnowledgeEntry schema validates correct knowledge entry data', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(knowledgeEntrySchema);

  const validEntry = {
    id: "typescript-basics",
    title: "TypeScript Basics",
    summary: "Fundamental TypeScript concepts and features",
    category: "Programming Languages",
    tags: ["typescript", "web-development"],
    link: "/knowledge/typescript-basics"
  };

  expect(validate(validEntry)).toBe(true);
});

test('KnowledgeEntry schema rejects missing required fields', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(knowledgeEntrySchema);

  const invalidEntry = {
    id: "incomplete",
    title: "Incomplete Entry"
    // Missing required fields: summary, category
  };

  expect(validate(invalidEntry)).toBe(false);
});

test('KnowledgeEntry schema validates tags array constraints', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(knowledgeEntrySchema);

  const validEntry = {
    id: "valid-tags",
    title: "Valid Tags Entry",
    summary: "Entry with valid tags array",
    category: "Testing"
  };

  // Test with no tags (valid, as tags are optional)
  expect(validate({ ...validEntry, tags: [] })).toBe(true);

  // Test with valid number of tags
  expect(validate({
    ...validEntry,
    tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
  })).toBe(true);

  // Test with too many tags (11 tags exceeds maxItems: 10)
  expect(validate({
    ...validEntry,
    tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11"]
  })).toBe(false);
});

test('KnowledgeEntry schema validates field length constraints', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(knowledgeEntrySchema);

  const validEntry = {
    id: "length-test",
    title: "Length Test Entry",
    summary: "Testing length constraints",
    category: "Testing"
  };

  // Test valid title length (100 characters or less)
  const longTitle = "x".repeat(100);
  expect(validate({ ...validEntry, title: longTitle })).toBe(true);

  // Test invalid title length (101 characters exceeds maxLength: 100)
  const tooLongTitle = "x".repeat(101);
  expect(validate({ ...validEntry, title: tooLongTitle })).toBe(false);

  // Test valid summary length (280 characters or less)
  const longSummary = "x".repeat(280);
  expect(validate({ ...validEntry, summary: longSummary })).toBe(true);

  // Test invalid summary length (281 characters exceeds maxLength: 280)
  const tooLongSummary = "x".repeat(281);
  expect(validate({ ...validEntry, summary: tooLongSummary })).toBe(false);
});

test('KnowledgeEntry schema allows optional link field', () => {
  const ajv = new Ajv();
  const validate = ajv.compile(knowledgeEntrySchema);

  const entryWithoutLink = {
    id: "no-link",
    title: "Entry Without Link",
    summary: "Knowledge entry without a link",
    category: "Documentation"
  };

  const entryWithLink = {
    id: "with-link",
    title: "Entry With Link",
    summary: "Knowledge entry with a link",
    category: "Documentation",
    link: "https://external-resource.com/docs"
  };

  expect(validate(entryWithoutLink)).toBe(true);
  expect(validate(entryWithLink)).toBe(true);
});