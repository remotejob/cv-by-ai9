# Claude Code GitHub Actions Manual

## Overview

Claude Code GitHub Actions allows you to integrate Claude AI directly into your GitHub workflow. Claude can help with code reviews, answer questions, make changes, and assist with various development tasks directly through GitHub comments.

## Setup

### 1. Install the GitHub App

Use the Claude Code CLI to install the GitHub app:

```bash
claude install-github-app
```

If automatic installation fails, follow the manual setup instructions at: https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md

### 2. Configure Secrets

Add your Anthropic API key to GitHub repository secrets:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key

### 3. Workflow Configuration

Create `.github/workflows/claude.yml` in your repository:

```yaml
name: Claude Code

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
      actions: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          additional_permissions: |
            actions: read
```

## Usage Examples

### 1. Code Review on Pull Requests

**Comment on a PR:**
```
@claude Please review this pull request and provide feedback on code quality, potential issues, and suggestions for improvement.
```

**Claude will:**
- Analyze the code changes
- Provide detailed feedback
- Suggest improvements
- Identify potential bugs or security issues

### 2. Automated Testing and Fixes

**Comment on a PR:**
```
@claude Run tests and fix any failing tests or linting issues.
```

**Claude will:**
- Execute test suites
- Identify failing tests
- Fix code issues
- Update the PR with fixes

### 3. Documentation Generation

**Comment on an issue:**
```
@claude Generate comprehensive documentation for the new authentication module in src/auth/.
```

**Claude will:**
- Analyze the code structure
- Create detailed documentation
- Include usage examples
- Add inline code comments

### 4. Bug Investigation and Fixes

**Comment on an issue:**
```
@claude Investigate the login timeout issue described in #123 and implement a fix.
```

**Claude will:**
- Analyze the codebase
- Identify the root cause
- Implement a solution
- Create a pull request with the fix

### 5. Feature Implementation

**Comment on an issue:**
```
@claude Implement a new user profile page with the following requirements:
- Display user avatar, name, and email
- Show user's recent activity
- Include edit profile functionality
- Use our existing UI components
```

**Claude will:**
- Create the necessary components
- Implement the functionality
- Follow existing code patterns
- Add appropriate tests

### 6. Code Refactoring

**Comment on a PR:**
```
@claude Please refactor the user service to use modern async/await patterns instead of callbacks.
```

**Claude will:**
- Identify callback patterns
- Convert to async/await
- Maintain existing functionality
- Update tests accordingly

### 7. Security Analysis

**Comment on a PR:**
```
@claude Perform a security analysis of these changes, looking for potential vulnerabilities.
```

**Claude will:**
- Analyze code for security issues
- Check for common vulnerabilities
- Suggest security improvements
- Verify input validation

### 8. Performance Optimization

**Comment on an issue:**
```
@claude The dashboard page is loading slowly. Please analyze and optimize performance.
```

**Claude will:**
- Profile the application
- Identify performance bottlenecks
- Implement optimizations
- Measure improvements

## Advanced Configuration

### Custom Prompts

You can provide custom prompts in the workflow:

```yaml
- name: Run Claude Code
  uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    prompt: 'Update the pull request description to include a summary of changes.'
```

### Claude Arguments

Customize Claude's behavior with additional arguments:

```yaml
- name: Run Claude Code
  uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: '--model claude-opus-4-1-20250805 --allowed-tools Bash(gh pr:*)'
```

### Permissions

Configure specific permissions for Claude:

```yaml
permissions:
  contents: write          # Allow Claude to make commits
  pull-requests: write     # Allow Claude to create/update PRs
  issues: write           # Allow Claude to create/update issues
  actions: read           # Allow Claude to read CI results
  id-token: write         # Required for authentication
```

## Best Practices

### 1. Clear Instructions
Be specific about what you want Claude to do:
```
❌ @claude fix this
✅ @claude Fix the TypeScript errors in the user authentication module
```

### 2. Context Provision
Provide relevant context:
```
@claude The login form should validate email format and password strength before submission. Use the existing validation utilities in src/utils/validation.js
```

### 3. Scope Definition
Define the scope of work:
```
@claude Refactor only the user service files in src/services/user/ to use TypeScript interfaces
```

### 4. Testing Requirements
Specify testing expectations:
```
@claude Implement the shopping cart feature with unit tests and integration tests using Jest
```

## Troubleshooting

### Common Issues

1. **Claude doesn't respond**
   - Check if the workflow is properly configured
   - Verify the `@claude` mention is in the comment
   - Ensure the ANTHROPIC_API_KEY secret is set

2. **Permission errors**
   - Review the permissions section in your workflow
   - Make sure Claude has the necessary permissions for the task

3. **API key issues**
   - Verify your API key is valid
   - Check if you have sufficient credits
   - Ensure the secret name matches the workflow configuration

### Getting Help

- Check the official documentation: https://docs.anthropic.com/en/docs/claude-code
- Review the GitHub Action repository: https://github.com/anthropics/claude-code-action
- File issues or questions in your repository

## Workflow Triggers

The GitHub Action can be triggered by:

- **Issue comments**: When someone comments on an issue with `@claude`
- **PR comments**: When someone comments on a pull request with `@claude`
- **PR review comments**: When someone adds a review comment with `@claude`
- **New issues**: When an issue is created with `@claude` in title or body
- **PR reviews**: When a pull request review mentions `@claude`

## Security Considerations

- Keep your API key secure in GitHub secrets
- Review permissions carefully
- Monitor Claude's actions and commits
- Use branch protection rules when appropriate
- Consider limiting Claude's access to specific tools or repositories

## Examples Repository Structure

For optimal Claude Code usage, organize your repository with:

```
project/
├── .github/
│   └── workflows/
│       └── claude.yml
├── docs/
│   └── (documentation files)
├── src/
│   └── (source code)
├── tests/
│   └── (test files)
├── package.json
└── README.md
```

This structure helps Claude understand your project layout and work more effectively.