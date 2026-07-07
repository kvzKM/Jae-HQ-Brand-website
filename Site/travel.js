import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    limit,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const shell = document.getElementById("projectDetailShell");
const card = shell.querySelector(".project-detail-card");

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

function initials(name) {
    const letters = clean(name)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

    return letters || "JH";
}

function paragraphs(value) {
    return clean(value)
        .split(/\n\s*\n/)
        .map((paragraph) => clean(paragraph))
        .filter(Boolean);
}

function setMeta(id, value) {
    const element = document.getElementById(id);
    if (element) element.setAttribute("content", value);
}

function setProjectMeta(project) {
    const title = `${project.name} | Software Portfolio | JAE HQ`;
    const description = clean(project.summary)
        || `View ${project.name}, a software project from Katie's JAE HQ portfolio.`;

    const canonical = new URL(window.location.pathname, window.location.origin);
    canonical.searchParams.set("slug", project.slug);

    document.title = title;
    document.getElementById("pageDescription")?.setAttribute("content", description);
    document.getElementById("canonicalLink")?.setAttribute("href", canonical.href);

    setMeta("ogTitle", title);
    setMeta("ogDescription", description);
    setMeta("ogUrl", canonical.href);
    setMeta("twitterTitle", title);
    setMeta("twitterDescription", description);

    const image = safeHttpUrl(project.image);

    if (image) {
        setMeta("ogImage", image);
        setMeta("twitterImage", image);
    } else {
        document.getElementById("ogImage")?.remove();
        document.getElementById("twitterImage")?.remove();
    }
}

function projectImage(project) {
    const image = safeHttpUrl(project.image);

    if (image) {
        return `<img src="${escapeHTML(image)}" alt="${escapeHTML(project.name)} project preview">`;
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

function projectActions(project) {
    const githubUrl = safeHttpUrl(project.githubUrl);
    const liveUrl = safeHttpUrl(project.liveUrl);

    if (!githubUrl && !liveUrl) return "";

    return `
        <div class="project-detail-actions">
            ${liveUrl ? `<a class="button gradient" href="${escapeHTML(liveUrl)}" target="_blank" rel="noopener noreferrer">Open live project ↗</a>` : ""}
            ${githubUrl ? `<a class="button secondary" href="${escapeHTML(githubUrl)}" target="_blank" rel="noopener noreferrer">View GitHub ↗</a>` : ""}
        </div>
    `;
}

function renderProject(project) {
    setProjectMeta(project);

    const description = paragraphs(project.description);

    card.innerHTML = `
        <div class="project-detail-hero">
            ${projectImage(project)}
        </div>

        <article class="project-detail-content">
            <span class="eyebrow">${escapeHTML(project.category || "software")}${project.featured ? " · Featured project" : ""}</span>
            <h1>${escapeHTML(project.name)}</h1>
            <p class="project-detail-summary">${escapeHTML(project.summary || "")}</p>

            ${techMarkup(project)}
            ${projectActions(project)}

            <div class="project-detail-meta">
                <span><strong>Category:</strong> ${escapeHTML(project.category || "Software")}</span>
                <span><strong>Built by:</strong> Katie · JAE HQ</span>
            </div>

            ${description.length ? `
                <section class="project-detail-copy">
                    <h2>About the project</h2>
                    ${description.map((paragraph) => `<p>${escapeHTML(paragraph).replaceAll("\n", "<br>")}</p>`).join("")}
                </section>
            ` : ""}
        </article>
    `;
}

function renderNotFound() {
    document.title = "Project Not Found | JAE HQ";

    card.innerHTML = `
        <div class="project-detail-content">
            <span class="eyebrow">Project archive</span>
            <h1>Project not found.</h1>
            <p class="project-detail-summary">
                This project does not exist, is not published, or the link is no longer available.
            </p>
            <div class="project-detail-actions">
                <a class="button gradient" href="portfolio.html">Explore the portfolio</a>
            </div>
        </div>
    `;
}

async function loadProject() {
    const slug = clean(new URLSearchParams(window.location.search).get("slug"));

    if (!slug) {
        renderNotFound();
        return;
    }

    try {
        const projectQuery = query(
            collection(db, "projects"),
            where("slug", "==", slug),
            where("status", "==", "published"),
            limit(1)
        );

        const snapshot = await getDocs(projectQuery);

        if (snapshot.empty) {
            renderNotFound();
            return;
        }

        renderProject({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        });
    } catch (error) {
        console.error("Could not load project:", error);

        card.innerHTML = `
            <div class="project-detail-content">
                <span class="eyebrow">Portfolio error</span>
                <h1>This project could not be loaded.</h1>
                <p class="project-detail-summary">Please try again later.</p>
                <div class="project-detail-actions">
                    <a class="button secondary" href="portfolio.html">Back to portfolio</a>
                </div>
            </div>
        `;
    }
}

loadProject();
