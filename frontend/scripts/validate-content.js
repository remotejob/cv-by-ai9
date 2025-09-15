#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const Ajv = require('ajv');
const { validateProject, validateKnowledgeEntry } = require('../lib/content');

// Initialize AJV for additional validation
const ajv = new Ajv({ allErrors: true, verbose: true });

// JSON Schemas
const projectSchema = {
  type: 'object',
  required: [
    'id',
    'title',
    'slug',
    'summary',
    'description',
    'externalUrl',
    'tags',
    'publishedAt',
    'content'
  ],
  properties: {
    id: { type: 'string', minLength: 1 },
    title: { type: 'string', minLength: 1 },
    slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
    summary: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1 },
    externalUrl: {
      type: 'string',
      format: 'uri',
      pattern: '^https?://'
    },
    ogImage: {
      type: 'string',
      format: 'uri',
      pattern: '^https?://'
    },
    tags: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
      maxItems: 10
    },
    featured: { type: 'boolean' },
    publishedAt: {
      type: 'string',
      format: 'date-time'
    },
    content: { type: 'string', minLength: 1 }
  },
  additionalProperties: false
};

const knowledgeSchema = {
  type: 'object',
  required: [
    'id',
    'title',
    'summary',
    'description',
    'category',
    'tags',
    'publishedAt',
    'content'
  ],
  properties: {
    id: { type: 'string', minLength: 1 },
    title: { type: 'string', minLength: 1 },
    summary: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1 },
    category: { type: 'string', minLength: 1 },
    tags: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
      maxItems: 8
    },
    link: {
      type: 'string',
      oneOf: [
        { format: 'uri' },
        { pattern: '^/' }
      ]
    },
    publishedAt: {
      type: 'string',
      format: 'date-time'
    },
    lastUpdated: {
      type: 'string',
      format: 'date-time'
    },
    content: { type: 'string', minLength: 1 }
  },
  additionalProperties: false
};

// Compile schemas
const validateProjectSchema = ajv.compile(projectSchema);
const validateKnowledgeSchema = ajv.compile(knowledgeSchema);

class ContentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      projects: 0,
      knowledge: 0
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌ ERROR' : type === 'warning' ? '⚠️  WARNING' : 'ℹ️  INFO';
    console.log(`[${timestamp}] ${prefix}: ${message}`);
  }

  async validateFile(filePath, schemaType) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      this.stats.total++;

      let isValid = false;
      let schemaErrors = [];

      if (schemaType === 'project') {
        this.stats.projects++;
        isValid = validateProject(data);
        validateProjectSchema(data);
        schemaErrors = validateProjectSchema.errors || [];
      } else if (schemaType === 'knowledge') {
        this.stats.knowledge++;
        isValid = validateKnowledgeEntry(data);
        validateKnowledgeSchema(data);
        schemaErrors = validateKnowledgeSchema.errors || [];
      }

      if (isValid && schemaErrors.length === 0) {
        this.stats.valid++;
        this.log(`✅ ${path.basename(filePath)} is valid`);
        return true;
      } else {
        this.stats.invalid++;
        this.errors.push({
          file: filePath,
          type: schemaType,
          errors: schemaErrors
        });

        // Log all validation errors
        schemaErrors.forEach(error => {
          const errorPath = error.instancePath || error.schemaPath || 'root';
          this.log(`📝 ${path.basename(filePath)} - ${errorPath}: ${error.message}`, 'error');
        });

        return false;
      }
    } catch (error) {
      this.stats.invalid++;
      this.errors.push({
        file: filePath,
        type: schemaType,
        errors: [{ message: error.message }]
      });

      this.log(`❌ ${path.basename(filePath)}: ${error.message}`, 'error');
      return false;
    }
  }

  async validateDirectory(dirPath, schemaType) {
    try {
      const files = await fs.readdir(dirPath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      if (jsonFiles.length === 0) {
        this.warnings.push(`No JSON files found in ${dirPath}`);
        this.log(`⚠️  No JSON files found in ${dirPath}`, 'warning');
        return;
      }

      this.log(`📂 Validating ${jsonFiles.length} ${schemaType} files in ${dirPath}`);

      for (const file of jsonFiles) {
        const filePath = path.join(dirPath, file);
        await this.validateFile(filePath, schemaType);
      }
    } catch (error) {
      this.errors.push({
        directory: dirPath,
        type: schemaType,
        errors: [{ message: `Failed to read directory: ${error.message}` }]
      });

      this.log(`❌ Failed to read ${dirPath}: ${error.message}`, 'error');
    }
  }

  async validateAll() {
    const contentDir = path.join(process.cwd(), 'content');

    this.log('🚀 Starting content validation...');

    // Validate projects
    const projectsDir = path.join(contentDir, 'projects');
    await this.validateDirectory(projectsDir, 'project');

    // Validate knowledge entries
    const knowledgeDir = path.join(contentDir, 'knowledge');
    await this.validateDirectory(knowledgeDir, 'knowledge');

    // Print summary
    this.printSummary();

    // Return exit code
    return this.stats.invalid === 0 ? 0 : 1;
  }

  printSummary() {
    console.log('\n📊 VALIDATION SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Total files checked: ${this.stats.total}`);
    console.log(`Valid files: ${this.stats.valid} ✅`);
    console.log(`Invalid files: ${this.stats.invalid} ❌`);
    console.log(`Projects: ${this.stats.projects}`);
    console.log(`Knowledge entries: ${this.stats.knowledge}`);
    console.log(`Success rate: ${((this.stats.valid / this.stats.total) * 100).toFixed(1)}%`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:');
      this.errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.file || error.directory}`);
        error.errors.forEach(err => {
          console.log(`   - ${err.message}`);
        });
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    if (this.stats.invalid === 0) {
      console.log('\n🎉 All content files are valid!');
    } else {
      console.log('\n💡 Fix the errors above and run the validation again.');
    }
  }
}

// CLI arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
Content Validator

Usage: node scripts/validate-content.js [options]

Options:
  --help, -h     Show this help message
  --fix          Attempt to auto-fix common issues (future feature)

Description:
  Validates all JSON content files in the content/ directory against their respective schemas.
  Ensures data consistency and catches errors before deployment.

Exit codes:
  0 - All files are valid
  1 - One or more files have validation errors

Examples:
  node scripts/validate-content.js
  npm run validate:content
`);
  process.exit(0);
}

// Run validation
async function main() {
  const validator = new ContentValidator();
  const exitCode = await validator.validateAll();
  process.exit(exitCode);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});