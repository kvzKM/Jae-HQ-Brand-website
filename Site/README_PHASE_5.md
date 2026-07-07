# JAE HQ — Phase 5 Software Portfolio

## Install

This is the complete Phase 5 package built on the Phase 4 Blog & SEO project.

1. Back up the current repository.
2. Replace the current project files with this package.
3. Open Firebase Console:
   - Build
   - Firestore Database
   - Rules
4. Replace the current rules with `firestore.rules`.
5. Publish the rules.
6. Deploy to Cloudflare.
7. Hard refresh with Ctrl + Shift + R.

## What Phase 5 adds

### Public portfolio connected to Firestore
The public `portfolio.html` queries:

`projects` where `status == "published"`

Draft and archived projects are not returned to public visitors.

### Search
Searches:
- name
- summary
- description
- category
- technologies

### Automatic category filters
Filter buttons are generated from published project categories.

Examples:
- all projects
- web
- python
- javascript
- delphi
- other

### Featured projects
Projects with:
`featured: true`

appear in the Featured Work section.

They still also remain available in the full project archive.

### Technology tags
The Firestore `technologies` array is displayed as project technology chips.

### GitHub and live project links
The public portfolio supports:
- `githubUrl`
- `liveUrl`

Only HTTP/HTTPS URLs are rendered as external buttons.

### Project detail pages
Every published project with a slug receives a shareable URL:

`project.html?slug=jae-hq`

The page queries Firestore using:
- slug
- status == published

Draft and archived projects do not render publicly.

### Project metadata
Project detail pages update:
- title
- meta description
- Open Graph title
- Open Graph description
- Open Graph URL
- Open Graph image when available
- Twitter/X card metadata
- canonical URL

### Responsive portfolio
The project archive, featured projects, code-style hero and project detail page reflow for desktop, tablet and mobile.

## Firestore Rules

Phase 5 strengthens validation for the `projects` collection.

Admin project writes require:
- name
- slug
- summary
- technologies
- category
- status
- featured

Category must be one of:
- web
- python
- javascript
- delphi
- other

Normal visitors may read only published project documents.

## Live test

### Test A — JAE HQ project
Admin Studio > Portfolio

Create or edit:

Project name:
JAE HQ

Slug:
jae-hq

Short summary:
A responsive personal digital platform connecting my software portfolio, writing and creative work.

Technologies:
HTML, CSS, JavaScript, Firebase

Category:
web

GitHub URL:
Your JAE HQ GitHub repository

Live project URL:
Your JAE HQ website

Status:
published

Featured:
checked

Save the project.

Open:
`portfolio.html`

Expected:
- JAE HQ appears in Featured Work
- JAE HQ appears in the project archive
- HTML, CSS, JavaScript and Firebase technology tags appear
- View Project opens `project.html?slug=jae-hq`
- GitHub button opens the repository
- Live Site opens the deployed website

### Test B — draft project
Create a second project with status `draft`.

Expected:
- visible in Admin Studio
- not visible on `portfolio.html`
- direct public slug URL shows Project Not Found

### Test C — search and filters
Publish at least one `web` and one `python` project.

Expected:
- category buttons are created automatically
- web filter shows only web projects
- python filter shows only python projects
- searching `Firebase` finds JAE HQ when Firebase exists in technologies

## Phase status

Phase 1 — Complete
Phase 2 — Complete
Phase 3 — Complete
Phase 4 — Complete after live blog/comment checks
Phase 5 — Code complete; live portfolio tests pending
Phase 6 — YouTube
Phase 7 — Final polish
