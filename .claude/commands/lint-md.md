# Lint and Fix Markdown Files

Lint markdown files using markdownlint, then automatically fix any issues found.

## Usage

- `/lint-md` - Lint all markdown files in the project (default: `**/*.md`)
- `/lint-md path/to/file.md` - Lint a specific file
- `/lint-md *.md` - Lint files matching a pattern

## Instructions

1. **Check if markdownlint is installed:**
   - Run `which markdownlint` to verify it exists in PATH
   - If NOT found, display installation instructions and exit (see Installation Help section)
   - If found, proceed to next step

2. Check if the user provided a file path/pattern in `$ARGUMENTS`

3. If `$ARGUMENTS` is provided, use that file path; otherwise default to `**/*.md`

4. Run markdownlint on the specified file(s) to identify issues

5. Use auto-fix to resolve automatically fixable issues

6. Display a summary of what was fixed

7. For any remaining issues that require manual review, explain them clearly

## Command

When the user runs this command, perform the following steps:

1. Determine the target file(s):
   - If user provided `$ARGUMENTS`, use: `markdownlint "$ARGUMENTS"` to see current issues
   - Otherwise use: `markdownlint "**/*.md"` to see current issues

2. If issues exist, execute the auto-fix command with the same target:
   - If user provided `$ARGUMENTS`: `markdownlint --fix "$ARGUMENTS"`
   - Otherwise: `markdownlint --fix "**/*.md"`

3. Run markdownlint again with the same target to show remaining issues (if any)

4. Provide a summary report showing:
   - Target file(s) that were checked
   - How many issues were auto-fixed
   - Any remaining issues that need manual attention
   - File paths with line numbers for remaining issues

5. Final Verification Step (Check VS Code Problems tab):
   - Check the VS Code Problems tab (View → Problems or Ctrl+Shift+M / Cmd+Shift+M) for any remaining markdown issues
   - For each issue found in the Problems tab that wasn't caught by markdownlint:
     - Use the Read tool to inspect the file and understand the issue
     - Use the Edit tool to automatically apply fixes to resolve the issue
     - Verify the changes are saved
   - After fixing all detected issues, re-run markdownlint one final time to confirm all issues are resolved
   - Provide a final summary including:
     - Issues found in VS Code Problems tab
     - Issues that were automatically fixed using Read/Edit tools
     - Any remaining issues that truly require manual human review (if any)

The project uses this `.markdownlint.json` config:

- MD024 (duplicate headings): disabled
- MD013 (line length): disabled
- MD033 (inline HTML): disabled

## Installation Help

If `markdownlint` is not found on your system, follow these steps:

### Prerequisites

- Node.js and npm must be installed
- Check with: `node --version` and `npm --version`

### Install markdownlint globally

#### Option 1: npm (Recommended)

```bash
npm install -g markdownlint-cli
```

#### Option 2: Homebrew (macOS)

```bash
brew install markdownlint-cli
```

### Verify installation

After installation, verify it works:

```bash
markdownlint --version
```

You should see the version number (e.g., `0.45.0`).

### Troubleshooting

#### If you still get "command not found"

- Try using the full path: `npm list -g markdownlint-cli`
- Restart your terminal after installation
- Check your npm prefix: `npm config get prefix` (should be in PATH)

#### If installation fails

- Update npm: `npm install -g npm@latest`
- Check npm permissions: <https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally>

After installation, run `/lint-md` again!
