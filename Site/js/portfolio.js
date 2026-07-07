import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const state = {
    projects: [],
    search: "",
    category: "all"
};

const grid = document.getElementById("projectGrid");
const featuredSection = document.getElementById("featuredProjects");
const featuredGrid = document.getElementById("featuredProjectGrid");
const filters = document.getElementById("projectFilters");
const searchInput = document.getElementById("projectSearch");
const summary = document.getElementById("projectResultsSummary");

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

function safeHttpUrl(value) {
    const raw = clean(value);
    if (!raw) return "";

    try {
        const url = new URL(raw, window.location.origin);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function projectUrl(project) {
    return `project.html?slug=${encodeURIComponent(project.slug)}`;
}

function timestampValue(value) {
    return value?.toMillis?.() || value?.seconds * 1000 || 0;
}

function initials(name) {
    const letters = clean(name)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

    return letters || "JH";
}

function projectMedia(project, compact = false) {
    const image = safeHttpUrl(project.image);

    if (image) {
        return `<img src="${escapeHTML(image)}" alt="${escapeHTML(project.name)} project preview" loading="${compact ? "lazy" : "eager"}">`;
    }

    return `
        <div class="project-placeholder" aria-hidden="true">
            <div class="project-placeholder-inner">${escapeHTML(initials(project.name))}</div>
        </div>
    `;
}

function techMarkup(project) {
    const technologies = Array.isArray(project.technologies)
        ? project.technologies.filter(Boolean)
        : [];

    if (!technologies.length) return "";

    return `
        <div class="tech-list" aria-label="Technologies used">
            ${technologies.map((technology) => `<span class="tech-tag">${escapeHTML(technology)}</span>`).join("")}
        </div>
    `;
}

function actionMarkup(project, includeDetails = true) {
    const githubUrl = safeHttpUrl(project.githubUrl);
    const liveUrl = safeHttpUrl(project.liveUrl);

    return `
        <div class="project-card-actions">
            ${includeDetails ? `<a class="button gradient" href="${projectUrl(project)}">View project</a>` : ""}
            ${liveUrl ? `<a class="button secondary" href="${escapeHTML(liveUrl)}" target="_blank" rel="noopener noreferrer">Live site ↗</a>` : ""}
            ${githubUrl ? `<a class="button secondary" href="${escapeHTML(githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ""}
        </div>
    `;
}

function featuredMarkup(project) {
    return `
        <article class="featured-project">
            <div class="featured-project-copy">
                <span class="eyebrow">${escapeHTML(project.category || "software")} · Featured</span>
                <h2>${escapeHTML(project.name)}</h2>
                <p class="lead">${escapeHTML(project.summary || "")}</p>
                ${techMarkup(project)}
                ${actionMarkup(project)}
            </div>
            <div class="featured-project-media">
                ${projectMedia(project)}
            </div>
        </article>
    `;
}

function cardMarkup(project) {
    return `
        <article class="project-card">
            <div class="project-card-media">
                ${project.featured ? `<span class="project-featured-badge">Featured</span>` : ""}
                <a href="${projectUrl(project)}" aria-label="View ${escapeHTML(project.name)}">
                    ${projectMedia(project, true)}
                </a>
            </div>
            <div class="project-card-body">
                <div class="meta">${escapeHTML(project.category || "software")}</div>
                <h3><a href="${projectUrl(project)}">${escapeHTML(project.name)}</a></h3>
                <p class="project-card-summary">${escapeHTML(project.summary || "")}</p>
                ${techMarkup(project)}
                ${actionMarkup(project)}
            </div>
        </article>
    `;
}

function filteredProjects() {
    const term = state.search.toLowerCase();

    return state.projects.filter((project) => {
        const categoryMatch = state.category === "all" || project.category === state.category;

        const technologies = Array.isArray(project.technologies)
            ? project.technologies.join(" ")
            : "";

        const searchable = [
            project.name,
            project.summary,
            project.description,
            project.category,
            technologies
        ].join(" ").toLowerCase();

        return categoryMatch && (!term || searchable.includes(term));
    });
}

function renderFilters() {
    const categories = [
        "all",
        ...new Set(
            state.projects
                .map((project) => clean(project.category).toLowerCase())
                .filter(Boolean)
        )
    ];

    filters.innerHTML = categories.map((category) => `
        <button
            type="button"
            class="portfolio-filter ${state.category === category ? "active" : ""}"
            data-category="${escapeHTML(category)}"
        >
            ${category === "all" ? "All projects" : escapeHTML(category)}
        </button>
    `).join("");

    filters.querySelectorAll("[data-category]").forEach((button) => {
        button.addEventListener("click", () => {
            state.category = button.dataset.category;
            renderFilters();
            renderProjects();
        });
    });
}

function renderFeaturedProjects() {
    const featured = state.projects.filter((project) => project.featured === true);

    if (!featured.length) {
        featuredSection.classList.add("hidden");
        featuredGrid.innerHTML = "";
        return;
    }

    featuredGrid.innerHTML = featured.map(featuredMarkup).join("");
    featuredSection.classList.remove("hidden");
}

function renderProjects() {
    const projects = filteredProjects();

    const parts = [];
    if (state.search) parts.push(`matching "${state.search}"`);
    if (state.category !== "all") parts.push(`in ${state.category}`);

    summary.textContent = `${projects.length} published project${projects.length === 1 ? "" : "s"}${parts.length ? ` ${parts.join(" ")}` : ""}.`;

    if (!projects.length) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                No published projects match that search yet.
            </div>
        `;
        return;
    }

    grid.innerHTML = projects.map(cardMarkup).join("");
}

async function loadProjects() {
    try {
        const publicProjects = query(
            collection(db, "projects"),
            where("status", "==", "published")
        );

        const snapshot = await getDocs(publicProjects);

        state.projects = snapshot.docs
            .map((document) => ({ id: document.id, ...document.data() }))
            .filter((project) => clean(project.slug) && clean(project.name))
            .sort((a, b) => {
                if (Boolean(a.featured) !== Boolean(b.featured)) {
                    return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
                }

                return timestampValue(b.updatedAt || b.createdAt)
                    - timestampValue(a.updatedAt || a.createdAt);
            });

        renderFilters();
        renderFeaturedProjects();
        renderProjects();
    } catch (error) {
        console.error("Could not load published projects:", error);

        summary.textContent = "The project archive could not be loaded.";
        grid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1;">
                The software portfolio is temporarily unavailable. Please try again later.
            </div>
        `;
    }
}

searchInput?.addEventListener("input", () => {
    state.search = clean(searchInput.value);
    renderProjects();
});

loadProjects();
