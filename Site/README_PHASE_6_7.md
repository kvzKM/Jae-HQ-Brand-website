# JAE HQ — Phase 6 + 7 Final Build

## Install

1. Back up Phase 5.
2. Replace the project files with this package.
3. Publish `firestore.rules` in Firebase Console > Firestore Database > Rules.
4. Enable Firebase Storage if it is not enabled.
5. Publish `storage.rules` in Firebase Console > Storage > Rules.
6. If Firebase prompts you to enable the Firestore/Storage Rules connection, approve it.
7. Deploy to Cloudflare and hard refresh with Ctrl + Shift + R.

## Phase 6 — YouTube

The public YouTube page reads published `youtube` Firestore records.

### Featured intro
Create a published YouTube entry in Admin Studio with:
- type: `intro`
- videoId
- title
- description
- featured: checked

The intro appears at the top of `youtube.html`.

### Playlists
Create published entries with:
- type: `playlist`
- playlistId
- title
- description
- optional thumbnail

The page builds searchable playlist cards. Clicking one opens the full YouTube playlist embed.

### Optional YouTube API enrichment
Open `js/youtube-config.js`.

Set:
`export const YOUTUBE_API_KEY = "YOUR_KEY";`

With a key configured, the page requests YouTube playlist metadata for up to 50 configured playlist IDs and enriches cards with current title, thumbnail and video count.

Restrict the key in Google Cloud Console to the JAE HQ website/referrer and YouTube Data API v3.

Without a key the page still works using Admin Studio/Firestore metadata.

## Phase 7 — Books, Travel and About

- `books.html` reads `books where status == published`.
- `travel.html` reads `travel where status == published`.
- featured records are shown first.
- `about.html` has been added and is linked in the shared navigation.

## Media Upload

Admin Studio now includes `Media Upload`.

Supported files:
- JPEG
- PNG
- WebP
- GIF
- maximum 8 MB

Uploads go to `admin-content/{folder}/...` in Firebase Storage.

After upload, copy the generated URL and paste it into the relevant content form image URL field.

`storage.rules` allows public reads for site media, but only JAE HQ admins may upload/update/delete. It also validates image MIME type and size.

## SEO Tools

Admin Studio now includes `SEO Tools`.

The sitemap generator reads current published posts and projects and creates canonical URLs for:
- static public pages
- `post.html?slug=...`
- `project.html?slug=...`

Generate the sitemap, download `sitemap.xml`, replace the repository sitemap file and redeploy. Run this after publishing or removing posts/projects.

## Search Console

After deployment:
1. Add/verify the JAE HQ property in Google Search Console.
2. Submit the deployed `sitemap.xml`.
3. Inspect `blog.html` and one published post URL.
4. Inspect `portfolio.html` and one published project URL.
5. Request indexing where useful.
6. Recheck after Google has rendered the JavaScript pages.

## Accessibility / polish

- skip-to-content link
- shared main-content anchor
- existing keyboard focus styles retained
- reduced-motion support
- responsive YouTube, Books, Travel and About layouts
- lazy loading for content images where appropriate

## Live test checklist

### YouTube
[ ] published intro appears
[ ] intro video plays
[ ] published playlists appear
[ ] playlist search works
[ ] playlist opens in embedded viewer
[ ] optional API enrichment works

### Storage
[ ] Firebase Storage enabled
[ ] storage.rules published
[ ] admin can upload an image
[ ] generated URL copies successfully
[ ] URL works in a blog/project/book/travel record
[ ] normal member cannot upload

### Books / Travel / About
[ ] published book appears
[ ] draft book hidden
[ ] published travel entry appears
[ ] draft travel entry hidden
[ ] About appears in navigation
[ ] About works on mobile

### SEO
[ ] SEO Tools generates sitemap XML
[ ] downloaded sitemap replaces repository sitemap.xml
[ ] site redeployed
[ ] sitemap submitted in Search Console

## Build status

Phase 1 — complete
Phase 2 — complete
Phase 3 — complete
Phase 4 — complete
Phase 5 — complete
Phase 6 — code complete; live YouTube tests pending
Phase 7 — code complete; Storage and Search Console setup pending
