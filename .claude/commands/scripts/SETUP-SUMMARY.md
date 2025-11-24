# Link Crawler Setup Summary

## What Was Created

### Directory Structure

```
.claude/commands/
├── check-links.md              # Claude Code slash command
└── scripts/
    ├── README.md               # Complete documentation
    ├── crawl-links-local.sh    # Local site crawler (4.3KB)
    └── crawl-links-public.sh   # Public site crawler (4.3KB)
```

### Files Created

1. **`.claude/commands/check-links.md`**
   - Claude Code slash command definition
   - Handles argument parsing (local/public, --verbose)
   - Checks if local Hugo server is running before crawling
   - Provides helpful error messages

2. **`.claude/commands/scripts/crawl-links-local.sh`**
   - Crawls local development site (http://localhost:1313)
   - Executable bash script
   - Supports `--verbose` flag

3. **`.claude/commands/scripts/crawl-links-public.sh`**
   - Crawls public production site (https://devops-pm-25.educ8.se)
   - Executable bash script
   - Supports `--verbose` flag

4. **`.claude/commands/scripts/README.md`**
   - Complete documentation for both scripts
   - Usage examples for slash command and direct invocation
   - Feature descriptions and test results

## How to Use

### Using Claude Code Slash Command (Recommended)

```bash
/check-links              # Check local site (default)
/check-links local        # Check local site explicitly
/check-links public       # Check public site
/check-links local --verbose   # Verbose mode
/check-links public --verbose  # Verbose mode
```

### Behavior

**When checking local site:**
1. Command first checks if Hugo server is running on localhost:1313
2. If not running, displays helpful message:
   ```
   ⚠️ Local Hugo server is not running on http://localhost:1313

   Please start the Hugo server first:
   hugo server

   Then run this command again.
   ```
3. If running, proceeds with link crawl

**When checking public site:**
- Directly crawls https://devops-pm-25.educ8.se
- No prerequisites needed

### Direct Script Usage

```bash
# Local site
./.claude/commands/scripts/crawl-links-local.sh
./.claude/commands/scripts/crawl-links-local.sh --verbose

# Public site
./.claude/commands/scripts/crawl-links-public.sh
./.claude/commands/scripts/crawl-links-public.sh --verbose
```

## Test Results

✅ **Both scripts tested and working:**
- **Local:** 110 URLs checked, no broken links
- **Public:** 110 URLs checked, no broken links

## Features

- ✅ Crawls all internal links
- ✅ Detects broken links (404 errors)
- ✅ Filters out external links, JavaScript, anchors
- ✅ Resolves relative URLs correctly
- ✅ Color-coded output (green=success, red=error, blue=info)
- ✅ Prevents duplicate checks (efficient)
- ✅ Exits with code 1 if broken links found (CI/CD ready)
- ✅ Server availability check for local site
- ✅ Verbose mode support

## Example Output

### Successful Crawl
```
ℹ Starting site crawler...
ℹ Base URL: http://localhost:1313

✓ Crawled: http://localhost:1313/
✓ Crawled: http://localhost:1313/getting-started/
✓ Crawled: http://localhost:1313/exercises/
...

════════════════════════════════════════
CRAWL COMPLETE - NO BROKEN LINKS
════════════════════════════════════════
Total URLs checked: 110
```

### Server Not Running (Local Check)
```
⚠️ Local Hugo server is not running on http://localhost:1313

Please start the Hugo server first:
hugo server

Then run this command again.
```

## Integration with Git

These tools are now part of the repository and can be:
- Committed to version control
- Shared with team members
- Used in CI/CD pipelines
- Documented in project README

## Next Steps

You can now:
1. Test the slash command: `/check-links`
2. Verify both local and public crawls work
3. Use in your development workflow
4. Integrate into CI/CD if needed

## Maintenance

The scripts are self-contained and require no external dependencies beyond:
- `bash` (built-in on macOS/Linux)
- `curl` (built-in on macOS/Linux)
- `grep`, `sed` (built-in on macOS/Linux)

Last updated: 2025-11-24
