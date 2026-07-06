# JAE HQ — Phase 4 Blog & SEO

## Install

1. Back up the current repository.
2. Replace the project with this Phase 4 package.
3. Firebase Console → Firestore Database → Rules.
4. Replace the current rules with `firestore.rules` from this package.
5. Publish the rules.
6. Deploy to Cloudflare.
7. Hard refresh with Ctrl + Shift + R.

## What Phase 4 changes

### Public blog
`blog.html` now queries Firestore `posts` where `status == "published"`.
Draft and archived posts are not returned to the public query.

Published posts are sorted newest-first in the browser and support:
- text search
- tag filtering
- Firestore content
- crawlable anchor links to individual post URLs

### Individual posts
`post.html?slug=your-post-slug`

The post page queries Firestore by:
- slug
- published status

It dynamically updates:
- document title
- meta description
- Open Graph title/description/image
- Twitter card metadata
- canonical URL
- BlogPosting JSON-LD structured data

### Comments
Signed-in users may create a comment on a published post.
Comments are stored in the top-level `comments` collection.

Comment fields:
- postId
- postSlug
- userId
- username
- emoji
- text
- createdAt

Members may delete their own comments.
Admins may delete any comment.
Comments are visible publicly.
Comment editing is disabled.

### Security Rules
The Phase 4 rules:
- keep draft/archived posts private from public reads
- allow public reads of published posts
- validate comment field names
- require a JAE HQ profile before commenting
- require comment userId to match Firebase Auth UID
- require username and emoji to match the user's protected Firestore profile
- limit comment text to 2,000 characters
- require server-time creation
- require the target post to exist and be published
- allow comment deletion only by the owner or an admin

## Live test

1. Admin Studio → Blog posts.
2. Open your real blog post.
3. Set Status to `published`.
4. Save.
5. Open `blog.html`.
6. Confirm the post appears.
7. Open the post.
8. Confirm the URL contains `?slug=`.
9. Log out and confirm the post still loads.
10. Log in as a normal member.
11. Post a comment.
12. Refresh and confirm the comment remains.
13. Delete the member's own comment.
14. Post another test comment.
15. Log in as admin and delete it from Admin Studio → Comments.

## SEO note

This is a client-rendered static site. Google can process JavaScript content and JavaScript-generated structured data, and the blog index now exposes crawlable post links.

For final SEO polish, connect Google Search Console, submit the sitemap, inspect live post URLs, and consider server-rendering post HTML at Cloudflare if indexing proves inconsistent.
