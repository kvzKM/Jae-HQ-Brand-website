# JAE HQ — Phase 3 Admin Studio

## Install

This is a complete Phase 3 project package built on the working Phase 1 + 2 foundation.

1. Back up the current repository.
2. Replace the current project files with this package.
3. In Firebase Console:
   - Build
   - Firestore Database
   - Rules
4. Replace the current Firestore Rules with `firestore.rules`.
5. Publish the rules.
6. Deploy the website to Cloudflare.
7. Log in with Katie's admin account.
8. Open the profile menu and select Admin Studio.

## Phase 3 features

### Secure route guard
`admin/index.html` waits for Firebase Auth and the Firestore user profile.
Only a profile with `role: "admin"` may initialise Admin Studio.

### Overview
The dashboard uses Firestore server count aggregation for:
- posts
- projects
- users
- comments

### Blog management
Collection: `posts`

Fields:
- title
- slug
- excerpt
- content
- coverImage
- tags
- status
- seoTitle
- seoDescription
- createdAt
- createdBy
- updatedAt
- updatedBy
- publishedAt when published

### Portfolio management
Collection: `projects`

Fields include:
- name
- slug
- summary
- description
- technologies
- category
- githubUrl
- liveUrl
- image
- status
- featured

### YouTube management
Collection: `youtube`

Admin Studio stores:
- intro records
- playlist records
- videoId
- playlistId
- description
- thumbnail
- status
- featured

Phase 6 will connect this data to the public YouTube experience and YouTube API.

### Books management
Collection: `books`

### Travel management
Collection: `travel`

### User management
Admins may:
- view member profiles
- change role between `member` and `admin`

The current logged-in admin cannot demote themselves from the table.

### Comments
Admin Studio can display and delete Firestore comments.

Phase 4 will build the real Firebase comment creation system and open carefully validated member comment writes in Firestore Rules.

## Important public-site status

The public Blog page still uses the temporary local blog data.
The public Portfolio page still uses the Phase 1 shell.
The public YouTube page still uses the Phase 1 shell.

This is intentional.

Phase 3 creates the content management/data layer.
Phase 4 connects `posts` and `comments`.
Phase 5 connects `projects`.
Phase 6 connects `youtube`.

## Test checklist

[ ] Publish Phase 3 Firestore Rules
[ ] Deploy Phase 3 package
[ ] Admin account opens Admin Studio
[ ] Normal member is redirected away from `/admin/index.html`
[ ] Overview loads
[ ] Create a draft blog post
[ ] Edit the draft blog post
[ ] Delete a test blog post
[ ] Create a portfolio project
[ ] Create a YouTube playlist record
[ ] Create a book record
[ ] Create a travel record
[ ] Search each collection
[ ] User table loads
[ ] Normal account does not see Admin Studio
