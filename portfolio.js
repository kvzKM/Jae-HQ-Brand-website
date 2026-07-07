import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const state = {
    posts: [],
    tag: "all",
    search: ""
};

const grid = document.getElementById("blogGrid");
const searchInput = document.getElementById("blogSearch");
const filters = document.getElementById("blogFilters");

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

function formatDate(value) {
    const millis = toMillis(value);
    if (!millis) return "Published on JAE HQ";

    return new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "long"
    }).format(new Date(millis));
}

function butterflyPlaceholder() {
    return `
        <div class="blog-card-placeholder" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
                <path d="M31 29C25 13 10 7 7 17c-3 9 8 18 22 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M33 29c6-16 21-22 24-12 3 9-8 18-22 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M29 35C18 35 10 41 13 49c3 8 14 5 18-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M35 35c11 0 19 6 16 14-3 8-14 5-18-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M32 26v19" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
            </svg>
        </div>
    `;
}

function postUrl(post) {
    return `post.html?slug=${encodeURIComponent(post.slug)}`;
}

function renderFilters() {
    const tags = [...new Set(
        state.posts.flatMap((post) => Array.isArray(post.tags) ? post.tags : [])
            .map((tag) => clean(tag).toLowerCase())
            .filter(Boolean)
    )].sort();

    const values = ["all", ...tags];

    filters.innerHTML = values.map((tag) => `
        <button class="blog-filter-button ${state.tag === tag ? "active" : ""}" type="button" data-tag="${escapeHTML(tag)}">
            ${tag === "all" ? "All stories" : `#${escapeHTML(tag)}`}
        </button>
    `).join("");

    filters.querySelectorAll("[data-tag]").forEach((button) => {
        button.addEventListener("click", () => {
            state.tag = button.dataset.tag;
            renderFilters();
            renderPosts();
        });
    });
}

function renderPosts() {
    const term = state.search.toLowerCase();

    const posts = state.posts.filter((post) => {
        const tags = Array.isArray(post.tags) ? post.tags.map((tag) => clean(tag).toLowerCase()) : [];
        const matchesTag = state.tag === "all" || tags.includes(state.tag);
        const haystack = [post.title, post.excerpt, post.content, ...tags].join(" ").toLowerCase();
        return matchesTag && (!term || haystack.includes(term));
    });

    if (!posts.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">No published stories match that search yet.</div>`;
        return;
    }

    grid.innerHTML = posts.map((post) => {
        const tags = Array.isArray(post.tags) ? post.tags : [];
        const cover = clean(post.coverImage)
            ? `<img class="blog-card-image" src="${escapeHTML(post.coverImage)}" alt="${escapeHTML(post.title)} cover image" loading="lazy">`
            : butterflyPlaceholder();

        return `
            <article class="blog-card-live">
                <a href="${postUrl(post)}">
                    ${cover}
                    <div class="blog-card-content">
                        <div class="meta">${escapeHTML(formatDate(post.publishedAt || post.createdAt))}</div>
                        <h2>${escapeHTML(post.title)}</h2>
                        <p>${escapeHTML(post.excerpt)}</p>
                        <div class="blog-tags">
                            ${tags.map((tag) => `<span class="blog-tag">#${escapeHTML(tag)}</span>`).join("")}
                        </div>
                    </div>
                </a>
            </article>
        `;
    }).join("");
}

async function loadPublishedPosts() {
    try {
        const postsQuery = query(
            collection(db, "posts"),
            where("status", "==", "published")
        );

        const snapshot = await getDocs(postsQuery);

        state.posts = snapshot.docs
            .map((document) => ({ id: document.id, ...document.data() }))
            .filter((post) => clean(post.slug) && clean(post.title))
            .sort((a, b) => toMillis(b.publishedAt || b.createdAt) - toMillis(a.publishedAt || a.createdAt));

        renderFilters();
        renderPosts();
    } catch (error) {
        console.error("Could not load published blog posts:", error);
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                The blog could not load right now. Please try again after refreshing the page.
            </div>
        `;
    }
}

searchInput?.addEventListener("input", () => {
    state.search = clean(searchInput.value);
    renderPosts();
});

loadPublishedPosts();
