#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class LighthouseOptimizer {
  constructor() {
    this.results = [];
    this.optimizations = [];
    this.scores = {};
    this.port = 3000;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌ ERROR' : type === 'warning' ? '⚠️  WARNING' : 'ℹ️  INFO';
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

  async startServer() {
    this.log('🌐 Starting development server for Lighthouse audit...');

    // Build the project first
    const buildResult = await this.runCommand('npm run build', 'Building project');
    if (!buildResult.success) {
      throw new Error('Failed to build project');
    }

    // Start server in background
    const serverProcess = require('child_process').spawn('npx', [
      'serve',
      'out',
      '-p',
      this.port.toString(),
      '-l',
      '--cors',
      '--no-clipboard'
    ], {
      stdio: 'pipe',
      detached: true
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    this.log(`🌐 Server started on port ${this.port}`);
    return serverProcess;
  }

  async runLighthouseAudit(urls = ['http://localhost:3000/']) {
    this.log('🔍 Running Lighthouse audits...');

    const results = [];

    for (const url of urls) {
      this.log(`🔍 Auditing ${url}`);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputPath = `lighthouse-results-${timestamp}.json`;

      const command = `npx lighthouse "${url}" \
        --output=json \
        --output-path="${outputPath}" \
        --chrome-flags="--headless --no-sandbox" \
        --view \
        --preset=desktop \
        --quiet`;

      const result = await this.runCommand(command, `Lighthouse audit for ${url}`);

      if (result.success) {
        try {
          const reportContent = await fs.readFile(outputPath, 'utf-8');
          const reportData = JSON.parse(reportContent);

          results.push({
            url,
            report: reportData,
            filePath: outputPath
          });

          this.scores[url] = {
            performance: reportData.categories.performance.score * 100,
            accessibility: reportData.categories.accessibility.score * 100,
            'best-practices': reportData.categories['best-practices'].score * 100,
            seo: reportData.categories.seo.score * 100
          };

          this.log(`📊 Scores for ${url}:`);
          this.log(`   Performance: ${this.scores[url].performance.toFixed(0)}`);
          this.log(`   Accessibility: ${this.scores[url].accessibility.toFixed(0)}`);
          this.log(`   Best Practices: ${this.scores[url]['best-practices'].toFixed(0)}`);
          this.log(`   SEO: ${this.scores[url].seo.toFixed(0)}`);
        } catch (readError) {
          this.log(`❌ Failed to read Lighthouse report: ${readError.message}`, 'error');
        }
      }
    }

    this.results = results;
    return results;
  }

  analyzeResults() {
    this.log('📈 Analyzing Lighthouse results...');

    const recommendations = [];

    for (const result of this.results) {
      const { url, report } = result;
      const audits = report.audits;

      // Performance recommendations
      if (this.scores[url].performance < 90) {
        if (audits['render-blocking-resources'] && audits['render-blocking-resources'].score < 1) {
          recommendations.push({
            category: 'performance',
            issue: 'Render-blocking resources',
            suggestion: 'Eliminate render-blocking resources using async/defer attributes',
            priority: 'high'
          });
        }

        if (audits['unused-css-rules'] && audits['unused-css-rules'].score < 0.9) {
          recommendations.push({
            category: 'performance',
            issue: 'Unused CSS rules',
            suggestion: 'Remove unused CSS rules to reduce page size',
            priority: 'medium'
          });
        }

        if (audits['uses-responsive-images'] && audits['uses-responsive-images'].score < 1) {
          recommendations.push({
            category: 'performance',
            issue: 'Unoptimized images',
            suggestion: 'Serve properly sized images and use modern formats',
            priority: 'high'
          });
        }

        if (audits['efficient-animated-content'] && audits['efficient-animated-content'].score < 1) {
          recommendations.push({
            category: 'performance',
            issue: 'Large animated content',
            suggestion: 'Optimize animated content or provide static alternatives',
            priority: 'medium'
          });
        }
      }

      // Accessibility recommendations
      if (this.scores[url].accessibility < 90) {
        if (audits['alt-text'] && audits['alt-text'].score < 1) {
          recommendations.push({
            category: 'accessibility',
            issue: 'Missing alt text',
            suggestion: 'Add descriptive alt text to all meaningful images',
            priority: 'high'
          });
        }

        if (audits['color-contrast'] && audits['color-contrast'].score < 1) {
          recommendations.push({
            category: 'accessibility',
            issue: 'Poor color contrast',
            suggestion: 'Improve color contrast ratios for better readability',
            priority: 'high'
          });
        }

        if (audits['label'] && audits['label'].score < 1) {
          recommendations.push({
            category: 'accessibility',
            issue: 'Missing form labels',
            suggestion: 'Ensure all form inputs have proper labels',
            priority: 'high'
          });
        }
      }

      // SEO recommendations
      if (this.scores[url].seo < 90) {
        if (audits['meta-description'] && audits['meta-description'].score < 1) {
          recommendations.push({
            category: 'seo',
            issue: 'Missing meta descriptions',
            suggestion: 'Add unique meta descriptions to all pages',
            priority: 'high'
          });
        }

        if (audits['http-status-code'] && audits['http-status-code'].score < 1) {
          recommendations.push({
            category: 'seo',
            issue: 'HTTP status issues',
            suggestion: 'Fix HTTP status codes and redirects',
            priority: 'high'
          });
        }
      }

      // Best practices recommendations
      if (this.scores[url]['best-practices'] < 90) {
        if (audits['errors-in-console'] && audits['errors-in-console'].score < 1) {
          recommendations.push({
            category: 'best-practices',
            issue: 'JavaScript errors',
            suggestion: 'Fix JavaScript errors in console',
            priority: 'high'
          });
        }
      }
    }

    // Remove duplicates and sort by priority
    const uniqueRecommendations = recommendations.filter((rec, index, self) =>
      index === self.findIndex(r => r.issue === rec.issue)
    );

    this.optimizations = uniqueRecommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return this.optimizations;
  }

  printSummary() {
    console.log('\n📊 LIGHTHOUSE AUDIT SUMMARY');
    console.log('=' .repeat(60));

    // Print scores
    for (const [url, scores] of Object.entries(this.scores)) {
      console.log(`\n📈 ${url}:`);
      Object.entries(scores).forEach(([category, score]) => {
        const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
        const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        console.log(`   ${status} ${categoryFormatted}: ${score.toFixed(0)}/100`);
      });
    }

    // Calculate average scores
    const avgScores = {
      performance: Object.values(this.scores).reduce((sum, s) => sum + s.performance, 0) / Object.keys(this.scores).length,
      accessibility: Object.values(this.scores).reduce((sum, s) => sum + s.accessibility, 0) / Object.keys(this.scores).length,
      'best-practices': Object.values(this.scores).reduce((sum, s) => sum + s['best-practices'], 0) / Object.keys(this.scores).length,
      seo: Object.values(this.scores).reduce((sum, s) => sum + s.seo, 0) / Object.keys(this.scores).length
    };

    console.log('\n📊 Average Scores:');
    Object.entries(avgScores).forEach(([category, score]) => {
      const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
      const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
      console.log(`   ${status} ${categoryFormatted}: ${score.toFixed(0)}/100`);
    });

    // Print recommendations
    if (this.optimizations.length > 0) {
      console.log('\n🔧 OPTIMIZATION RECOMMENDATIONS:');
      this.optimizations.forEach((rec, index) => {
        const priorityIcon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`\n${index + 1}. ${priorityIcon} ${rec.issue} (${rec.category})`);
        console.log(`   💡 ${rec.suggestion}`);
      });
    }

    // Overall assessment
    const allScoresAbove90 = Object.values(avgScores).every(score => score >= 90);
    if (allScoresAbove90) {
      console.log('\n🎉 Excellent! All scores are above 90!');
    } else {
      console.log('\n💪 Keep optimizing to reach 90+ in all categories!');
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      scores: this.scores,
      recommendations: this.optimizations,
      summary: {
        urlsTested: Object.keys(this.scores).length,
        optimizationsNeeded: this.optimizations.length,
        highPriorityIssues: this.optimizations.filter(r => r.priority === 'high').length,
        mediumPriorityIssues: this.optimizations.filter(r => r.priority === 'medium').length,
        lowPriorityIssues: this.optimizations.filter(r => r.priority === 'low').length
      }
    };

    const reportPath = `lighthouse-summary-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    return fs.writeFile(reportPath, JSON.stringify(report, null, 2))
      .then(() => {
        this.log(`📄 Summary report saved to ${reportPath}`);
        return reportPath;
      })
      .catch(error => {
        this.log(`❌ Failed to save report: ${error.message}`, 'error');
        throw error;
      });
  }

  async cleanup(serverProcess) {
    this.log('🧹 Cleaning up...');

    if (serverProcess) {
      serverProcess.kill();
      this.log('🛑 Server stopped');
    }
  }

  async run(urls = ['http://localhost:3000/']) {
    let serverProcess = null;

    try {
      // Start server
      serverProcess = await this.startServer();

      // Run audits
      await this.runLighthouseAudit(urls);

      // Analyze results
      await this.analyzeResults();

      // Print summary
      this.printSummary();

      // Generate report
      await this.generateReport();

      // Check if all scores are above 90
      const allScoresAbove90 = Object.values(this.scores).every(scores =>
        Object.values(scores).every(score => score >= 90)
      );

      if (allScoresAbove90) {
        this.log('🎉 All Lighthouse scores are above 90! Great job!');
        return 0; // Success exit code
      } else {
        this.log('💪 Some scores need improvement. Check the recommendations above.');
        return 1; // Failure exit code
      }

    } catch (error) {
      this.log(`💥 Fatal error: ${error.message}`, 'error');
      return 1;
    } finally {
      await this.cleanup(serverProcess);
    }
  }
}

// CLI arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const customUrls = args.filter(arg => !arg.startsWith('--'));

if (showHelp) {
  console.log(`
Lighthouse Auditor and Optimizer

Usage: node scripts/lighthouse-audit.js [options] [urls]

Options:
  --help, -h     Show this help message

Arguments:
  urls           URLs to audit (default: http://localhost:3000/)

Description:
  Runs comprehensive Lighthouse audits and provides optimization recommendations.
  Automatically starts a server, audits the specified URLs, and generates a report.

Exit codes:
  0 - All scores are 90+ or audit completed successfully
  1 - Audit failed or scores need improvement

Examples:
  node scripts/lighthouse-audit.js
  node scripts/lighthouse-audit.js http://localhost:3000/ http://localhost:3000/projects
  npm run lighthouse:audit
`);
  process.exit(0);
}

// Run auditor
async function main() {
  const auditor = new LighthouseOptimizer();
  const urls = customUrls.length > 0 ? customUrls : ['http://localhost:3000/'];
  const exitCode = await auditor.run(urls);
  process.exit(exitCode);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});