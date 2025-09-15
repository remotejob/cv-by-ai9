#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class SiteExporter {
  constructor() {
    this.exportDir = path.join(process.cwd(), 'out');
    this.expectedRoutes = [
      '/',
      '/projects',
      '/knowledge',
      '/contact',
      '/projects/sample-project',
      '/knowledge/sample-entry'
    ];
    this.verificationResults = [];
    this.buildSuccess = false;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌ ERROR' : type === 'warning' ? '⚠️  WARNING' : type === 'success' ? '✅ SUCCESS' : 'ℹ️  INFO';
    console.log(`[${timestamp}] ${prefix}: ${message}`);
  }

  async runCommand(command, description, options = {}) {
    try {
      this.log(`🚀 ${description}...`);
      const output = execSync(command, {
        encoding: 'utf-8',
        stdio: 'pipe',
        ...options
      });
      this.log(`✅ ${description} completed successfully`);
      return { success: true, output };
    } catch (error) {
      this.log(`❌ ${description} failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async cleanPreviousBuild() {
    this.log('🧹 Cleaning previous build artifacts...');

    const dirsToClean = ['.next', 'out', 'dist'];

    for (const dir of dirsToClean) {
      try {
        await fs.rm(path.join(process.cwd(), dir), { recursive: true, force: true });
        this.log(`🗑️  Removed ${dir}/`);
      } catch (error) {
        // Directory doesn't exist, which is fine
      }
    }
  }

  async buildProject() {
    this.log('🏗️  Building Next.js project...');

    const buildResult = await this.runCommand('npm run build', 'Building Next.js project');

    if (!buildResult.success) {
      throw new Error('Build failed - cannot proceed with export');
    }

    this.buildSuccess = true;
    return buildResult;
  }

  async exportStatic() {
    this.log('📦 Exporting static site...');

    // Check if build was successful
    if (!this.buildSuccess) {
      throw new Error('Cannot export - build was not successful');
    }

    const exportResult = await this.runCommand('npm run export', 'Exporting static site');

    if (!exportResult.success) {
      throw new Error('Static export failed');
    }

    // Verify export directory exists
    try {
      await fs.access(this.exportDir);
      this.log('📁 Export directory created successfully');
    } catch (error) {
      throw new Error('Export directory not found after export');
    }

    return exportResult;
  }

  async verifyDirectoryStructure() {
    this.log('🔍 Verifying directory structure...');

    const expectedFiles = [
      'index.html',
      'projects/index.html',
      'knowledge/index.html',
      'contact/index.html',
      '404.html'
    ];

    const results = [];

    for (const file of expectedFiles) {
      const filePath = path.join(this.exportDir, file);
      try {
        await fs.access(filePath);
        const stats = await fs.stat(filePath);
        this.log(`✅ ${file} exists (${stats.size} bytes)`);
        results.push({ file, exists: true, size: stats.size });
      } catch (error) {
        this.log(`❌ ${file} is missing`, 'error');
        results.push({ file, exists: false, size: 0 });
      }
    }

    this.verificationResults.push({
      type: 'directory-structure',
      results
    });

    return results;
  }

  async verifyStaticAssets() {
    this.log('🔍 Verifying static assets...');

    const assetPaths = [
      '_next/static/css',
      '_next/static/chunks',
      '_next/static/media'
    ];

    const results = [];

    for (const assetPath of assetPaths) {
      const fullPath = path.join(this.exportDir, assetPath);
      try {
        await fs.access(fullPath);
        const files = await fs.readdir(fullPath);
        this.log(`✅ ${assetPath}/ contains ${files.length} files`);
        results.push({ path: assetPath, exists: true, fileCount: files.length });
      } catch (error) {
        this.log(`⚠️  ${assetPath}/ is missing or empty`, 'warning');
        results.push({ path: assetPath, exists: false, fileCount: 0 });
      }
    }

    this.verificationResults.push({
      type: 'static-assets',
      results
    });

    return results;
  }

  async verifyHtmlContent() {
    this.log('🔍 Verifying HTML content...');

    const pagesToCheck = [
      { file: 'index.html', title: 'Home' },
      { file: 'projects/index.html', title: 'Projects' },
      { file: 'knowledge/index.html', title: 'Knowledge' },
      { file: 'contact/index.html', title: 'Contact' }
    ];

    const results = [];

    for (const page of pagesToCheck) {
      const filePath = path.join(this.exportDir, page.file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');

        // Basic HTML checks
        const hasDoctype = content.includes('<!DOCTYPE html>');
        const hasHtmlTag = content.includes('<html');
        const hasHeadTag = content.includes('<head');
        const hasBodyTag = content.includes('<body');
        const hasTitle = content.includes('<title');

        const checks = {
          doctype: hasDoctype,
          htmlTag: hasHtmlTag,
          headTag: hasHeadTag,
          bodyTag: hasBodyTag,
          title: hasTitle
        };

        const allChecksPassed = Object.values(checks).every(check => check);

        if (allChecksPassed) {
          this.log(`✅ ${page.title} page HTML structure is valid`);
        } else {
          this.log(`❌ ${page.title} page has HTML structure issues`, 'error');
        }

        // Check for accessibility basics
        const hasLang = content.includes('lang=');
        const hasMetaCharset = content.includes('charset=');
        const hasViewport = content.includes('name="viewport"');

        const accessibilityChecks = {
          lang: hasLang,
          metaCharset: hasMetaCharset,
          viewport: hasViewport
        };

        results.push({
          page: page.title,
          file: page.file,
          htmlValid: allChecksPassed,
          checks,
          accessibility: accessibilityChecks,
          size: content.length
        });

      } catch (error) {
        this.log(`❌ Cannot read ${page.title} page: ${error.message}`, 'error');
        results.push({
          page: page.title,
          file: page.file,
          htmlValid: false,
          checks: {},
          accessibility: {},
          error: error.message
        });
      }
    }

    this.verificationResults.push({
      type: 'html-content',
      results
    });

    return results;
  }

  async verifyLinks() {
    this.log('🔍 Verifying internal links...');

    const indexFile = path.join(this.exportDir, 'index.html');

    try {
      const content = await fs.readFile(indexFile, 'utf-8');

      // Find internal links
      const internalLinks = content.match(/href="\/[^"]*"/g) || [];
      const uniqueLinks = [...new Set(internalLinks.map(link => link.replace(/href="|"$/, '')))];

      this.log(`📋 Found ${uniqueLinks.length} unique internal links`);

      const results = [];

      for (const link of uniqueLinks) {
        const linkPath = link === '/' ? 'index.html' : link.replace(/^\//, '') + '/index.html';
        const fullPath = path.join(this.exportDir, linkPath);

        try {
          await fs.access(fullPath);
          this.log(`✅ ${link} → ${linkPath} exists`);
          results.push({ link, target: linkPath, exists: true });
        } catch (error) {
          this.log(`❌ ${link} → ${linkPath} is missing`, 'error');
          results.push({ link, target: linkPath, exists: false });
        }
      }

      this.verificationResults.push({
        type: 'internal-links',
        results
      });

      return results;

    } catch (error) {
      this.log(`❌ Cannot verify links: ${error.message}`, 'error');
      return [];
    }
  }

  async checkFileSize() {
    this.log('📏 Checking file sizes...');

    const results = [];

    try {
      const getAllFiles = async (dir) => {
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files.push(...await getAllFiles(fullPath));
          } else {
            const stats = await fs.stat(fullPath);
            files.push({
              path: path.relative(this.exportDir, fullPath),
              size: stats.size,
              isHtml: entry.name.endsWith('.html'),
              isCss: entry.name.endsWith('.css'),
              isJs: entry.name.endsWith('.js')
            });
          }
        }
        return files;
      };

      const files = await getAllFiles(this.exportDir);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      // Find largest files
      const largestFiles = files
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

      this.log(`📊 Total export size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      this.log(`📊 Total files: ${files.length}`);

      // Log largest files
      if (largestFiles.length > 0) {
        this.log('📊 Largest files:');
        largestFiles.forEach((file, index) => {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2);
          this.log(`   ${index + 1}. ${file.path} (${sizeMB} MB)`);
        });
      }

      // Check for oversized files
      const oversizedFiles = files.filter(file => file.size > 1024 * 1024); // > 1MB
      if (oversizedFiles.length > 0) {
        this.log(`⚠️  Found ${oversizedFiles.length} files larger than 1MB`, 'warning');
        oversizedFiles.forEach(file => {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2);
          this.log(`   ${file.path} (${sizeMB} MB)`);
        });
      }

      results.push({
        totalSize,
        fileCount: files.length,
        largestFiles,
        oversizedFiles: oversizedFiles.length
      });

    } catch (error) {
      this.log(`❌ Cannot check file sizes: ${error.message}`, 'error');
    }

    this.verificationResults.push({
      type: 'file-sizes',
      results
    });

    return results;
  }

  async startPreviewServer() {
    this.log('🌐 Starting preview server...');

    const serverProcess = require('child_process').spawn('npx', [
      'serve',
      'out',
      '-p',
      '3000',
      '-l',
      '--cors',
      '--no-clipboard'
    ], {
      stdio: 'pipe',
      detached: true
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.log('🌐 Preview server started at http://localhost:3000');
    this.log('💡 Press Ctrl+C to stop the server');

    return serverProcess;
  }

  async promptForPreview() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('\n🌐 Would you like to start a preview server? (y/N): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      exportDir: this.exportDir,
      buildSuccess: this.buildSuccess,
      verificationResults: this.verificationResults,
      summary: {
        totalChecks: this.verificationResults.length,
        successfulChecks: this.verificationResults.filter(r =>
          r.type === 'directory-structure' ? r.results.every(f => f.exists) :
          r.type === 'html-content' ? r.results.every(r => r.htmlValid) :
          r.type === 'internal-links' ? r.results.every(r => r.exists) :
          true
        ).length
      }
    };

    const reportPath = `export-verification-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    return fs.writeFile(reportPath, JSON.stringify(report, null, 2))
      .then(() => {
        this.log(`📄 Verification report saved to ${reportPath}`);
        return reportPath;
      })
      .catch(error => {
        this.log(`❌ Failed to save report: ${error.message}`, 'error');
        throw error;
      });
  }

  printSummary() {
    console.log('\n📊 STATIC EXPORT VERIFICATION SUMMARY');
    console.log('=' .repeat(60));

    // Overall status
    const allChecksPassed = this.verificationResults.every(check => {
      if (check.type === 'directory-structure') {
        return check.results.every(f => f.exists);
      } else if (check.type === 'html-content') {
        return check.results.every(r => r.htmlValid);
      } else if (check.type === 'internal-links') {
        return check.results.every(r => r.exists);
      }
      return true;
    });

    if (allChecksPassed) {
      console.log('🎉 All verification checks passed!');
    } else {
      console.log('⚠️  Some verification checks failed');
    }

    // Print specific results
    this.verificationResults.forEach(check => {
      console.log(`\n📋 ${check.type.replace('-', ' ').toUpperCase()}:`);

      if (check.type === 'directory-structure') {
        const missingFiles = check.results.filter(f => !f.exists);
        if (missingFiles.length > 0) {
          console.log('   ❌ Missing files:');
          missingFiles.forEach(f => console.log(`      - ${f.file}`));
        } else {
          console.log('   ✅ All files present');
        }
      } else if (check.type === 'html-content') {
        const invalidPages = check.results.filter(r => !r.htmlValid);
        if (invalidPages.length > 0) {
          console.log('   ❌ Pages with HTML issues:');
          invalidPages.forEach(p => console.log(`      - ${p.page}`));
        } else {
          console.log('   ✅ All pages have valid HTML');
        }
      } else if (check.type === 'internal-links') {
        const brokenLinks = check.results.filter(r => !r.exists);
        if (brokenLinks.length > 0) {
          console.log('   ❌ Broken links:');
          brokenLinks.forEach(l => console.log(`      - ${l.link} → ${l.target}`));
        } else {
          console.log('   ✅ All internal links work');
        }
      }
    });

    console.log(`\n📁 Export location: ${this.exportDir}`);
    console.log('🌐 To preview the site, run: npx serve out -p 3000');
  }

  async run() {
    let serverProcess = null;

    try {
      // Clean previous build
      await this.cleanPreviousBuild();

      // Build project
      await this.buildProject();

      // Export static site
      await this.exportStatic();

      // Run verification checks
      await this.verifyDirectoryStructure();
      await this.verifyStaticAssets();
      await this.verifyHtmlContent();
      await this.verifyLinks();
      await this.checkFileSize();

      // Print summary
      this.printSummary();

      // Generate report
      await this.generateReport();

      // Ask if user wants to start preview server
      const shouldStartServer = await this.promptForPreview();
      if (shouldStartServer) {
        serverProcess = await this.startPreviewServer();

        // Keep script running
        process.on('SIGINT', async () => {
          if (serverProcess) {
            serverProcess.kill();
            this.log('🛑 Server stopped');
          }
          process.exit(0);
        });

        // Wait indefinitely
        await new Promise(() => {});
      }

      return 0; // Success exit code

    } catch (error) {
      this.log(`💥 Export and verification failed: ${error.message}`, 'error');
      return 1; // Failure exit code
    } finally {
      if (serverProcess) {
        serverProcess.kill();
      }
    }
  }
}

// CLI arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
Static Site Exporter and Verifier

Usage: node scripts/export-and-verify.js [options]

Options:
  --help, -h     Show this help message

Description:
  Exports the Next.js site as static files and verifies that all routes,
  assets, and links are working correctly. Provides a comprehensive
  verification report and optional preview server.

Exit codes:
  0 - Export and verification completed successfully
  1 - Export or verification failed

Examples:
  node scripts/export-and-verify.js
  npm run export:verify
`);
  process.exit(0);
}

// Run exporter
async function main() {
  const exporter = new SiteExporter();
  const exitCode = await exporter.run();
  process.exit(exitCode);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});