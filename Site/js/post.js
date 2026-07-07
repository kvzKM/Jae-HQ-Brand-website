import { auth, db } from "./firebase.js";
import { watchAuth, getUserProfile } from "./auth.js";
import {
    collection,
    doc,
    addDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const mount = document.getElementById("postMount");
const params = new URLSearchParams(window.location.search);
const slug = String(params.get("slug") || "").trim().toLowerCase();

const state = {
    post: null,
    user: null,
    profile: null,
    comments: []
};

function clean(value) {
    return String(value ?? "").trim();
}

function escapeHTML(value) {
    return clean(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function toMillis(value) {
    if (!value) return 0;
    if (value instanceof Timestamp) return value.toMillis();
    if (typeof value.toMillis === "function") return value.toMillis();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function toISO(value) {
    const millis = toMillis(value);
    return millis ? new Date(millis).toISOString() : "";
}

function formatDate(value) {
    const millis = toMillis(value);
    if (!millis) return "Published on JAE HQ";

    return new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "long"
    }).format(new Date(millis));
}

function setMeta(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element && value) element.setAttribute(attribute, value);
}

function updateSEO(post) {
    const seoTitle = clean(post.seoTitle) || `${post.title} | JAE HQ`;
    const description = clean(post.seoDescription) || clean(post.excerpt);
    const canonicalUrl = new URL(`post.html?slug=${encodeURIComponent(post.slug)}`, window.location.origin).href;

    document.title = seoTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", seoTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", seoTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);

    if (clean(post.coverImage)) {
        setMeta('meta[property="og:image"]', "content", post.coverImage);
        setMeta('meta[name="twitter:image"]', "content", post.coverImage);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const existingSchema = document.getElementById("articleStructuredData");
    existingSchema?.remove();

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "articleStructuredData";
    schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description,
        ...(clean(post.coverImage) ? { image: [post.coverImage] } : {}),
        datePublished: toISO(post.publishedAt || post.createdAt),
        dateModified: toISO(post.updatedAt || post.publishedAt || post.createdAt),
        author: {
            "@type": "Person",
            name: "Katie"
        },
        publisher: {
            "@type": "Organization",
            name: "JAE HQ"
        },
        mainEntityOfPage: canonicalUrl,
        keywords: Array.isArray(post.tags) ? post.tags.join(", ") : ""
    });
    document.head.appendChild(schema);
}

function renderParagraphs(content) {
    const paragraphs = clean(content)
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    return paragraphs.length
        ? paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")
        : `<p>${escapeHTML(content)}</p>`;
}

function renderPost() {
    const post = state.post;
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const cover = clean(post.coverImage)
        ? `<img class="article-cover" src="${escapeHTML(post.coverImage)}" alt="${escapeHTML(post.title)} cover image">`
        : "";

    mount.innerHTML = `
        <article class="article-card">
            ${cover}
            <header class="article-header">
                <span class="eyebrow">JAE HQ blog</span>
                <h1>${escapeHTML(post.title)}</h1>
                <p class="lead">${escapeHTML(post.excerpt)}</p>
                <div class="article-meta">
                    <span>${escapeHTML(formatDate(post.publishedAt || post.createdAt))}</span>
                    <span>By Katie</span>
                </div>
                <div class="blog-tags">
                    ${tags.map((tag) => `<a class="blog-tag" href="blog.html">#${escapeHTML(tag)}</a>`).join("")}
                </div>
            </header>

            <div class="article-body">
                <div class="article-copy">${renderParagraphs(post.content)}</div>
                <div class="article-share">
                    <button id="copyPostLink" class="button secondary" type="button">Copy post link</button>
                    <span id="copyPostMessage" class="form-message" aria-live="polite"></span>
                </div>
            </div>

            <section class="article-comments" id="commentsSection">
                <span class="eyebrow">Community</span>
                <h2>Comments</h2>
                <p class="auth-subtext">A little conversation below the story.</p>

                <div id="commentComposer"></div>
                <div id="commentList" class="comment-list-live"></div>
            </section>
        </article>
    `;

    document.getElementById("copyPostLink")?.addEventListener("click", async () => {
        const message = document.getElementById("copyPostMessage");
        try {
            await navigator.clipboard.writeText(window.location.href);
            message.textContent = "Link copied.";
        } catch (error) {
            console.error("Could not copy post link:", error);
            message.textContent = "Copy the link from your browser address bar.";
        }
    });

    renderCommentComposer();
    renderComments();
}

function renderCommentComposer() {
    const composer = document.getElementById("commentComposer");
    if (!composer) return;

    if (!state.user) {
        const next = `${window.location.pathname}${window.location.search}`;
        composer.innerHTML = `
            <div class="comment-signin-card">
                <h3>Join the conversation</h3>
                <p class="auth-subtext">Log in with your JAE HQ account to leave a comment.</p>
                <a class="button gradient" href="login.html?next=${encodeURIComponent(next)}">Log in to comment</a>
            </div>
        `;
        return;
    }

    composer.innerHTML = `
        <form id="commentForm" class="comment-form-live">
            <div class="field">
                <label for="commentText">Comment as ${escapeHTML(state.profile?.username || state.user.displayName || "JAE HQ Member")}</label>
                <textarea id="commentText" maxlength="2000" placeholder="Write your comment..." required></textarea>
            </div>
            <div id="commentMessage" class="form-message" aria-live="polite"></div>
            <div><button class="button gradient" type="submit">Post comment</button></div>
        </form>
    `;

    document.getElementById("commentForm")?.addEventListener("submit", addComment);
}

async function addComment(event) {
    event.preventDefault();

    const input = document.getElementById("commentText");
    const message = document.getElementById("commentMessage");
    const text = clean(input?.value);

    if (!state.user || !state.profile) {
        message.textContent = "Please log in again before commenting.";
        return;
    }

    if (!text || text.length > 2000) {
        message.textContent = "Comments must be between 1 and 2,000 characters.";
        return;
    }

    try {
        message.textContent = "Posting comment...";

        await addDoc(collection(db, "comments"), {
            postId: state.post.id,
            postSlug: state.post.slug,
            userId: state.user.uid,
            username: state.profile.username,
            emoji: state.profile.emoji || "🦋",
            text,
            createdAt: serverTimestamp()
        });

        input.value = "";
        message.textContent = "Comment posted.";
        await loadComments();
    } catch (error) {
        console.error("Could not post comment:", error);
        message.textContent = "Your comment could not be posted. Please refresh and try again.";
    }
}

async function loadComments() {
    try {
        const commentsQuery = query(
            collection(db, "comments"),
            where("postId", "==", state.post.id)
        );
        const snapshot = await getDocs(commentsQuery);

        state.comments = snapshot.docs
            .map((document) => ({ id: document.id, ...document.data() }))
            .sort((a, b) => toMillis(a.createdAt) - toMillis(b.createdAt));

        renderComments();
    } catch (error) {
        console.error("Could not load comments:", error);
        const list = document.getElementById("commentList");
        if (list) list.innerHTML = `<div class="empty-state">Comments could not load right now.</div>`;
    }
}

function renderComments() {
    const list = document.getElementById("commentList");
    if (!list) return;

    if (!state.comments.length) {
        list.innerHTML = `<div class="empty-state">No comments yet. You can be the first one here.</div>`;
        return;
    }

    list.innerHTML = state.comments.map((comment) => {
        const canDelete = state.user && (comment.userId === state.user.uid || state.profile?.role === "admin");
        return `
            <article class="comment-live">
                <div class="comment-live-header">
                    <div class="comment-user">
                        <span class="comment-avatar">${escapeHTML(comment.emoji || "🦋")}</span>
                        <span>
                            <strong>${escapeHTML(comment.username || "JAE HQ Member")}</strong>
                            <small>${escapeHTML(formatDate(comment.createdAt))}</small>
                        </span>
                    </div>
                    ${canDelete ? `<button class="comment-delete" type="button" data-delete-comment="${comment.id}">Delete</button>` : ""}
                </div>
                <p>${escapeHTML(comment.text)}</p>
            </article>
        `;
    }).join("");

    list.querySelectorAll("[data-delete-comment]").forEach((button) => {
        button.addEventListener("click", async () => {
            if (!window.confirm("Delete this comment?")) return;
            try {
                await deleteDoc(doc(db, "comments", button.dataset.deleteComment));
                await loadComments();
            } catch (error) {
                console.error("Could not delete comment:", error);
                window.alert("The comment could not be deleted.");
            }
        });
    });
}

function renderPostError(title, message) {
    document.title = `${title} | JAE HQ`;
    mount.innerHTML = `
        <div class="post-error">
            <span class="eyebrow">JAE HQ blog</span>
            <h1>${escapeHTML(title)}</h1>
            <p>${escapeHTML(message)}</p>
            <div class="button-row" style="justify-content:center;">
                <a class="button gradient" href="blog.html">Back to the blog</a>
            </div>
        </div>
    `;
}

async function loadPost() {
    if (!slug) {
        renderPostError("Post not found", "This blog link does not contain a valid post slug.");
        return;
    }

    try {
        const postQuery = query(
            collection(db, "posts"),
            where("slug", "==", slug),
            where("status", "==", "published")
        );

        const snapshot = await getDocs(postQuery);
        const document = snapshot.docs[0];

        if (!document) {
            renderPostError("Post not found", "This story is unavailable, unpublished or the link is incorrect.");
            return;
        }

        state.post = { id: document.id, ...document.data() };
        updateSEO(state.post);
        renderPost();
        await loadComments();
    } catch (error) {
        console.error("Could not load blog post:", error);
        renderPostError("The story could not load", "Please refresh the page and try again.");
    }
}

watchAuth(({ user, profile }) => {
    state.user = user;
    state.profile = profile;
    if (state.post) {
        renderCommentComposer();
        renderComments();
    }
});

loadPost();
