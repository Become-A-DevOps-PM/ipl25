# Link Crawler Tools

This directory contains scripts to check for broken links on the DevOps PM IPL25 site.

## Quick Start with Claude Code Slash Command

The easiest way to use these tools is through the Claude Code slash command:

```bash
/check-links              # Check local site (default)
/check-links local        # Check local site explicitly
/check-links public       # Check public site
/check-links local --verbose   # Verbose output
/check-links public --verbose  # Verbose output for public site
```

The slash command will:
- Automatically check if local Hugo server is running (for local checks)
- Run the appropriate crawler script
- Display results clearly
- Suggest fixes if broken links are found

## Scripts

### Local Development Crawler
**File:** `crawl-links-local.sh`

Crawls your local Hugo development server running on `http://localhost:1313`

```bash
./.claude/commands/scripts/crawl-links-local.sh                # Standard mode
./.claude/commands/scripts/crawl-links-local.sh --verbose      # Verbose mode
```

### Public Site Crawler
**File:** `crawl-links-public.sh`

Crawls the live production site at `https://devops-pm-25.educ8.se`

```bash
./.claude/commands/scripts/crawl-links-public.sh               # Standard mode
./.claude/commands/scripts/crawl-links-public.sh --verbose     # Verbose mode
```

## Usage Examples

### Using Claude Code (Recommended)

```bash
/check-links              # Check local (requires Hugo server running)
/check-links public       # Check live production site
```

### Using Scripts Directly

```bash
# Check local development site
./.claude/commands/scripts/crawl-links-local.sh

# Check live production site
./.claude/commands/scripts/crawl-links-public.sh

# Verbose output to see all pages being crawled
./.claude/commands/scripts/crawl-links-public.sh --verbose
```

## What These Scripts Do

- **Crawls all internal links** on the specified site
- **Detects broken links** (404 errors and fetch failures)
- **Filters out external links**, JavaScript, and anchors
- **Resolves relative URLs** correctly for Hugo's directory structure
- **Reports total URLs checked** and any broken links found
- **Exits with code 1** if broken links are found (useful for CI/CD)

## Features

- Color-coded output (green = crawled, red = broken, blue = info)
- Prevents duplicate checks (efficient crawling)
- Handles both absolute and relative URLs
- Skips JavaScript template strings and event handlers
- Proper timeout handling (10 seconds per request)

## Suggested Improvements

### Option 1: Create Claude Code Commands

Create `.claude/commands/` directory with custom commands:

```bash
# Command file: .claude/commands/check-local.md
/crawl-local

# This would expand to run the local crawler
```

### Option 2: Create a Makefile

Add to the repository root:

```makefile
.PHONY: check-links-local check-links-public

check-links-local:
	@./docs/crawl-links-local.sh

check-links-public:
	@./docs/crawl-links-public.sh

check-links-verbose:
	@./docs/crawl-links-public.sh --verbose
```

Then run:
```bash
make check-links-local
make check-links-public
```

### Option 3: Create a Bash Alias

Add to your shell profile (e.g., `~/.zshrc` or `~/.bashrc`):

```bash
alias check-local='~/Developer/IPL_Development/IPL25-Hugo-Site/docs/crawl-links-local.sh'
alias check-public='~/Developer/IPL_Development/IPL25-Hugo-Site/docs/crawl-links-public.sh'
```

Then run:
```bash
check-local
check-public
```

### Option 4: Create a Wrapper Script

Create `./scripts/check-links.sh`:

```bash
#!/bin/bash
case "${1:-local}" in
  local|dev)
    ./docs/crawl-links-local.sh "${@:2}"
    ;;
  public|prod)
    ./docs/crawl-links-public.sh "${@:2}"
    ;;
  *)
    echo "Usage: ./scripts/check-links.sh [local|public] [--verbose]"
    exit 1
    ;;
esac
```

Then run:
```bash
./scripts/check-links.sh local
./scripts/check-links.sh public --verbose
```

## Recommended Approach

For this project, I suggest **Option 4 (Wrapper Script)** because it:
- Keeps all tools in one organized location
- Provides a unified interface
- Is easy to extend with more commands
- Works well with Claude Code slash commands
- Doesn't require shell configuration changes

## Integration with Claude Code

You could create a Claude Code slash command (`.claude/commands/check-links.md`):

```markdown
# Check for broken links

Run the link crawler:

```bash
./scripts/check-links.sh local    # Check local development site
./scripts/check-links.sh public   # Check live production site
```
```

Then in Claude Code, you could type `/check-links` to see instructions.

## Recent Test Results

- **Local Site:** 110 URLs checked, no broken links ✓
- **Public Site:** 110 URLs checked, no broken links ✓

Last tested: 2025-11-24
