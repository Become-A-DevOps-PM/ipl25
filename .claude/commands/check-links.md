---
description: Check for broken links on the Hugo site (local or public)
---

You are helping the user check for broken links on their Hugo site.

The user has invoked the `/check-links` command with the following arguments: {{ARGS}}

## Task

1. Parse the arguments:
   - If no arguments or "local" or "dev" → check local site (http://localhost:1313)
   - If "public" or "prod" or "production" → check public site (https://devops-pm-25.educ8.se)
   - Extract `--verbose` flag if present

2. If checking LOCAL site:
   - First, verify that the Hugo server is running on localhost:1313
   - Use: `curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/ --max-time 3`
   - If it returns anything other than "200", inform the user:
     ```
     ⚠️ Local Hugo server is not running on http://localhost:1313

     Please start the Hugo server first:
     hugo server

     Then run this command again.
     ```
   - Stop and don't proceed with the crawl

3. If server is running (or checking public site), run the appropriate crawler script:
   - Local: `.claude/commands/scripts/crawl-links-local.sh`
   - Public: `.claude/commands/scripts/crawl-links-public.sh`
   - Add `--verbose` flag if the user requested it

4. Display the results to the user

5. If broken links are found:
   - Summarize the broken links
   - Suggest next steps for fixing them

## Example Invocations

```
/check-links              → Check local site (default)
/check-links local        → Check local site explicitly
/check-links public       → Check public site
/check-links local --verbose  → Check local site with verbose output
/check-links public --verbose → Check public site with verbose output
```

## Important Notes

- The scripts are located in `.claude/commands/scripts/`
- Both scripts are executable and ready to run
- The scripts exit with code 1 if broken links are found
- Always check if local server is running before attempting to crawl it
