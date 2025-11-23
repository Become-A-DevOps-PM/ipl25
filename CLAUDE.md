# DevOps PM IPL25 - Hugo Documentation Site

## Project Overview

This repository contains the Hugo-based documentation site for the DevOps PM IPL25 course. The site is deployed to GitHub Pages at <https://devops-pm-25.educ8.se/>.

**Purpose:** Public-facing course documentation, exercises, tutorials, and reveal.js presentations for the IPL25 DevOps Project Management course.

**Technology Stack:**
- Static site generator: Hugo Extended (v0.128.0+)
- Theme: DocDock (with compatibility patches for modern Hugo)
- Deployment: GitHub Actions → GitHub Pages
- Presentations: reveal.js (built into DocDock)

## Related Repository - 2024 Reference Project

**Location:** `/Users/lasse/Library/Mobile Documents/iCloud~md~obsidian/Documents/IPL25-Server-Network-Security`

**Important:** This is a READ-ONLY reference. Never modify files in this directory.

The 2024 project contains the complete course development materials:

### Key Resources in 2024 Project

**Course Administration (`course/`):**
- `PROJECT-CHARTER.md` - Complete course vision and pedagogy (15,000+ words)
- `COURSE-STRUCTURE.md` - Capability-based learning organization
- `TECH-STACK-DECISION-LOG.md` - Authoritative technology decisions
- `onboarding/SETUP-GUIDE.md` - Comprehensive setup guide (1,400+ lines)
- `syllabus/` - Assignments and study guides

**Technical Concept Papers (`context/concepts/`):**
14 formal frameworks including:
- Step Card Framework - Infrastructure evolution
- Service Trinity - Compute/Network/Storage foundation
- NFR Ladder - Non-functional requirements progression
- Agentic Systems - AI agent organization

**IPL24 Legacy Content (`context/content/`):**
- 99 markdown files with exercises and tutorials
- Organized by: compute, network, storage, it-security, risk-analysis
- 26 exercises across 5 tracks
- **Note:** Uses LEMP stack (PHP) - needs conversion to Flask/Python for IPL25

**AI Agent Personas (`.claude/agents/`):**
5 specialized agents:
1. Alva Architect - System architecture
2. David Developer - Flask/Python development
3. Dennis DevOps - CI/CD and automation
4. Therese Tester - Security and testing
5. Stig Teacher - Course boundaries and pedagogy

**Exercise Creation Skill (`.claude/skills/create-exercise/`):**
- Complete framework for creating consistent educational exercises
- GUIDE.md, TEMPLATE.md, EXAMPLE.md

**Infrastructure Code (`infra/`):**
- Bicep templates for Azure deployment
- Cloud-init scripts for server provisioning

**Flask Application (`src/`):**
- Example Flask application code
- Models, forms, templates

## Working Guidelines

### Content Development

When creating content for this Hugo site:

1. **Exercises should follow the create-exercise template** from the 2024 project
2. **Convert LEMP examples to Flask/Python** - IPL25 uses Python exclusively
3. **Preserve frontmatter format** - Hugo uses TOML (`+++`)
4. **Each exercise must stand alone** - No cross-references to other exercises
5. **Use the 2024 content as source material** - Adapt, don't copy directly

### Technology Stack (IPL25 - No Alternatives)

```
Cloud:         Azure (mandatory)
OS:            Ubuntu 24.04 LTS
Language:      Python 3.11+
Web Framework: Flask 2.3+
Web Server:    nginx 1.24+
Database:      PostgreSQL 14+
Frontend:      HTML5 + CSS3 + Vanilla JavaScript
WSGI:          Gunicorn
IaC:           Bicep templates
Scripting:     Bash
CI/CD:         GitHub Actions
```

### Hugo Site Structure

```
content/
├── _index.md              # Homepage
├── getting-started/       # Introduction chapter
│   ├── _index.md
│   └── introduction.md
└── slides/                # Reveal.js presentations
    ├── _index.md
    └── example-presentation.md

layouts/
└── partials/              # Theme overrides for Hugo compatibility
    ├── header.html
    ├── language-selector.html
    ├── flex/
    │   ├── body-aftercontent.html
    │   └── scripts.html
    └── original/
        └── scripts.html

static/
└── CNAME                  # Custom domain for GitHub Pages

docs/
└── hugo-github-pages-setup.md  # Setup tutorial
```

### Creating Presentations

Use reveal.js slides with `type = "slide"` in frontmatter:

```markdown
+++
title = "Presentation Title"
type = "slide"
theme = "league"

[revealOptions]
transition = "convex"
controls = true
progress = true
+++

# Slide 1
Content

---

# Slide 2
Use `---` for horizontal slides
Use `___` for vertical slides
```

### Theme Overrides

The DocDock theme (2018) requires compatibility patches for Hugo 0.128+. All patches are in `layouts/partials/` as overrides - never edit the theme directly.

**Key patches:**
- Fix nil pointer errors on taxonomy pages
- Replace deprecated `.Site.IsMultiLingual` with `hugo.IsMultilingual`
- Prevent menu collapse on active sections

### Building and Testing

```bash
# Local development
hugo server

# Production build
hugo --gc --minify

# Site available at http://localhost:1313
```

### Deployment

Automatic deployment via GitHub Actions when pushing to `main` branch.

**GitHub Pages Settings:**
- Source: GitHub Actions
- Custom domain: devops-pm-25.educ8.se

## Content Migration from 2024

When migrating content from the 2024 project:

### Do
- Use IPL24 exercise progression as a model (Manual → CLI → Automation)
- Preserve pedagogical approach and learning objectives
- Convert PHP/LEMP examples to Python/Flask
- Adapt security concepts and networking theory
- Follow create-exercise template structure

### Don't
- Copy PHP code examples directly
- Reference IPL24 file paths in public content
- Include dates or "next week" references
- Create cross-references between exercises
- Modify the 2024 reference project

### Content Sections to Develop

Based on 2024 structure, this Hugo site should include:

1. **Getting Started** - Course introduction, setup
2. **Compute** - Servers, VMs, Linux basics
3. **Network** - Networking, security groups, DNS
4. **Storage** - Databases, PostgreSQL
5. **Application** - Flask, Python, web development
6. **Security** - HTTPS, hardening, GDPR
7. **Automation** - IaC, CI/CD, scripting
8. **Risk Analysis** - Security assessment
9. **Presentations** - Weekly slides

## Git Workflow

### Before Committing
Always ask before committing or pushing changes.

### Commit Message Format
```
Brief summary of changes

- Detailed point 1
- Detailed point 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Branch Strategy
- `main` - Production, auto-deploys to GitHub Pages
- Feature branches for major changes

## Key Files Reference

| File | Purpose |
|------|---------|
| `hugo.toml` | Hugo configuration |
| `static/CNAME` | Custom domain |
| `.github/workflows/hugo.yaml` | Deployment workflow |
| `layouts/partials/` | Theme compatibility overrides |
| `docs/hugo-github-pages-setup.md` | Setup tutorial |

## Course Context

**IPL25 DevOps PM Course:**
- Duration: 6 weeks (4 weeks infrastructure + 2 weeks analysis)
- Focus: IT Project Manager perspective
- Language: Swedish instruction / English technical
- Students orchestrate AI agents to build Azure infrastructure

**Learning Philosophy:**
1. Decision-First Learning - Students make architectural decisions
2. AI-Assisted Implementation - 5 specialized agents as virtual team
3. Progressive Complexity - Binary choices → complex architecture
4. Technical Empathy Building - Hands-on experience builds understanding

## Resources

- **Hugo Documentation:** <https://gohugo.io/documentation/>
- **DocDock Theme:** <https://github.com/vjeantet/hugo-theme-docdock>
- **Reveal.js:** <https://revealjs.com/>
- **GitHub Pages:** <https://docs.github.com/en/pages>
