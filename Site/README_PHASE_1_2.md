# JAE HQ — Phase 1 + Phase 2 Foundation

This package replaces the previous "luxury motorsport / secret agent" shell with
a softer creative-technology design and unifies the Firebase authentication layer.

## What changed

### Phase 1
- New responsive visual system
- Shared navigation rendered by `js/navbar.js`
- Shared footer
- Mobile navigation
- New JAE HQ butterfly mark drawn as inline SVG
- New home page
- New software portfolio shell
- Reworked page shells for Blog, YouTube, Books, Travel and Socials
- Socials moved out of the primary navigation and into the footer
- Consistent lowercase asset folders and file paths

### Phase 2
- Firebase is the only login state source
- Removed the `loggedInUser` localStorage concept
- Shared `watchAuth()` observer
- Signup creates both the Firebase Auth user and Firestore profile
- Firestore profile fields:
  - username
  - email
  - emoji
  - role
  - membership
  - createdAt
  - updatedAt
- Added member profile page
- Username and emoji editing
- Password reset uses Firebase
- Auth-aware navigation
- Guest/member home CTAs switch automatically
- Firestore rules protect `role` and `membership` from member self-editing
- New account roles default to `member`

## Before deploying

### 1. Replace your existing website files
Back up your current repository, then copy these files into the repository root.

### 2. Add your existing images
The package uses placeholder paths:
- `images/test.svg`
- `images/books-cover.svg`
- `images/tzaneen.svg`

Copy your existing images into those names or update the paths in the HTML/JS.

### 3. Deploy Firestore rules
Open Firebase Console:
1. Build
2. Firestore Database
3. Rules
4. Replace the current rules with `firestore.rules`
5. Publish

Do this before relying on role protection.

### 4. Test accounts
Test:
1. Create account
2. Refresh the browser
3. Confirm the profile emoji appears in the nav
4. Open My profile
5. Change username and emoji
6. Log out
7. Log back in
8. Reset password

## Making Katie an admin for Phase 3

The current client intentionally cannot promote itself to admin.

For the temporary Phase 2 bootstrap:
1. Firebase Console
2. Firestore Database
3. `users`
4. Open Katie's user document
5. Change `role` from `member` to `admin`

Once Phase 3 is built, admin access and admin tooling will be enforced around the
protected role. We can later move to Firebase custom claims through trusted server/Admin SDK code.

## Important

The Blog page is still using temporary local JavaScript post data. That is intentional.
The old `post.html`/localStorage post selector was not carried forward because the SEO
blog architecture belongs to Phase 4.

The YouTube page is intentionally a presentation shell in this package. Searchable
playlist loading belongs to Phase 6.

The Admin Studio is a placeholder only. Phase 3 builds the real dashboard.
