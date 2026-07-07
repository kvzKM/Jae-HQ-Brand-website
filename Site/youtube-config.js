import { auth, db } from "./firebase.js";
import { watchAuth } from "./auth.js";
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getCountFromServer,
    query,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const state = {
    user: null,
    profile: null,
    currentView: "overview",
    records: {},
    editing: {},
    users: [],
    comments: [],
    deleteAction: null
};

const CONTENT_CONFIG = {
    posts: {
        label: "Blog posts",
        eyebrow: "Publishing",
        description: "Create, edit and publish posts to the live Firestore-powered JAE HQ blog.",
        singular: "post",
        titleField: "title",
        meta(record) {
            return `${record.status || "draft"} · ${record.slug || "no slug"}`;
        },
        fields: [
            { name: "title", label: "Post title", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text", required: true, hint: "Example: day-in-the-life" },
            { name: "excerpt", label: "Short description", type: "textarea", required: true },
            { name: "content", label: "Post content", type: "textarea", className: "large-editor", required: true },
            { name: "coverImage", label: "Cover image URL", type: "url" },
            { name: "tags", label: "Tags", type: "text", hint: "Comma-separated: life, writing, travel", transform: "array" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], required: true },
            { name: "seoTitle", label: "SEO title", type: "text" },
            { name: "seoDescription", label: "SEO description", type: "textarea" }
        ],
        defaults: { status: "draft" }
    },
    projects: {
        label: "Portfolio",
        eyebrow: "Software",
        description: "Manage projects for your software portfolio. Phase 5 will turn these records into filtered public project cards.",
        singular: "project",
        titleField: "name",
        meta(record) {
            const technology = Array.isArray(record.technologies) ? record.technologies.join(" · ") : "";
            return `${record.status || "draft"}${technology ? ` · ${technology}` : ""}`;
        },
        fields: [
            { name: "name", label: "Project name", type: "text", required: true },
            { name: "slug", label: "Slug", type: "text", required: true },
            { name: "summary", label: "Short summary", type: "textarea", required: true },
            { name: "description", label: "Full description", type: "textarea", className: "large-editor" },
            { name: "technologies", label: "Technologies", type: "text", hint: "Comma-separated: HTML, CSS, JavaScript", transform: "array" },
            { name: "category", label: "Category", type: "select", options: ["web", "python", "javascript", "delphi", "other"], required: true },
            { name: "githubUrl", label: "GitHub URL", type: "url" },
            { name: "liveUrl", label: "Live project URL", type: "url" },
            { name: "image", label: "Project image URL", type: "url" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], required: true },
            { name: "featured", label: "Featured project", type: "checkbox" }
        ],
        defaults: { status: "draft", category: "web", featured: false }
    },
    youtube: {
        label: "YouTube",
        eyebrow: "Video",
        description: "Store featured introductions and playlist records. Phase 6 will connect the public page to YouTube and searchable playlists.",
        singular: "YouTube entry",
        titleField: "title",
        meta(record) {
            return `${record.type || "playlist"} · ${record.status || "draft"}`;
        },
        fields: [
            { name: "title", label: "Title", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "type", label: "Entry type", type: "select", options: ["intro", "playlist"], required: true },
            { name: "videoId", label: "YouTube video ID", type: "text", hint: "For intro/featured videos" },
            { name: "playlistId", label: "YouTube playlist ID", type: "text", hint: "For playlist entries" },
            { name: "thumbnail", label: "Thumbnail URL", type: "url" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], required: true },
            { name: "featured", label: "Featured entry", type: "checkbox" }
        ],
        defaults: { type: "playlist", status: "draft", featured: false }
    },
    books: {
        label: "Books",
        eyebrow: "Writing projects",
        description: "Manage your books and long-form writing projects.",
        singular: "book",
        titleField: "title",
        meta(record) {
            return `${record.status || "draft"}${record.genre ? ` · ${record.genre}` : ""}`;
        },
        fields: [
            { name: "title", label: "Book title", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "genre", label: "Genre", type: "text" },
            { name: "coverImage", label: "Cover image URL", type: "url" },
            { name: "externalUrl", label: "External link", type: "url" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], required: true },
            { name: "featured", label: "Featured book", type: "checkbox" }
        ],
        defaults: { status: "draft", featured: false }
    },
    travel: {
        label: "Travel",
        eyebrow: "Places",
        description: "Manage locations, road trips and travel memories for the JAE HQ archive.",
        singular: "travel entry",
        titleField: "title",
        meta(record) {
            return `${record.status || "draft"}${record.location ? ` · ${record.location}` : ""}`;
        },
        fields: [
            { name: "title", label: "Title", type: "text", required: true },
            { name: "location", label: "Location", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "image", label: "Image URL", type: "url" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], required: true },
            { name: "featured", label: "Featured place", type: "checkbox" }
        ],
        defaults: { status: "draft", featured: false }
    }
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

function slugify(value) {
    return clean(value)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);
}

function toDateLabel(value) {
    if (!value) return "No date";
    const date = value instanceof Timestamp ? value.toDate() : value?.toDate?.() || new Date(value);
    if (Number.isNaN(date.getTime())) return "No date";
    return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(date);
}

function setAdminMessage(collectionName, message, type = "") {
    const element = document.getElementById(`${collectionName}Message`);
    if (!element) return;
    element.textContent = message;
    element.className = `admin-message ${type}`.trim();
}

function statusChip(value) {
    const status = clean(value || "draft").toLowerCase();
    return `<span class="admin-status ${escapeHTML(status)}">${escapeHTML(status)}</span>`;
}

function fieldMarkup(field, collectionName) {
    const id = `${collectionName}-${field.name}`;
    const hint = field.hint ? `<small class="form-message">${escapeHTML(field.hint)}</small>` : "";
    const required = field.required ? "required" : "";

    if (field.type === "textarea") {
        return `
            <div class="field">
                <label for="${id}">${escapeHTML(field.label)}</label>
                <textarea id="${id}" name="${field.name}" class="${field.className || ""}" ${required}></textarea>
                ${hint}
            </div>
        `;
    }

    if (field.type === "select") {
        return `
            <div class="field">
                <label for="${id}">${escapeHTML(field.label)}</label>
                <select id="${id}" name="${field.name}" ${required}>
                    ${field.options.map((option) => `<option value="${escapeHTML(option)}">${escapeHTML(option)}</option>`).join("")}
                </select>
                ${hint}
            </div>
        `;
    }

    if (field.type === "checkbox") {
        return `
            <div class="field">
                <label style="display:flex; align-items:center; gap:10px; min-height:50px;">
                    <input id="${id}" name="${field.name}" type="checkbox" style="width:20px; min-height:20px;">
                    <span>${escapeHTML(field.label)}</span>
                </label>
                ${hint}
            </div>
        `;
    }

    return `
        <div class="field">
            <label for="${id}">${escapeHTML(field.label)}</label>
            <input id="${id}" name="${field.name}" type="${field.type || "text"}" ${required}>
            ${hint}
        </div>
    `;
}

function renderContentView(collectionName) {
    const config = CONTENT_CONFIG[collectionName];
    const mount = document.getElementById(`view-${collectionName}`);

    mount.innerHTML = `
        <div class="admin-page-header">
            <div>
                <span class="eyebrow">${escapeHTML(config.eyebrow)}</span>
                <h1>${escapeHTML(config.label)}</h1>
                <p>${escapeHTML(config.description)}</p>
            </div>
            <button class="button gradient" type="button" data-new-record="${collectionName}">New ${escapeHTML(config.singular)}</button>
        </div>

        <div class="admin-content-layout">
            <section class="admin-list-panel">
                <div class="admin-toolbar">
                    <input id="${collectionName}Search" class="search-field" type="search" placeholder="Search ${escapeHTML(config.label.toLowerCase())}...">
                </div>
                <div id="${collectionName}List" class="admin-record-list"></div>
            </section>

            <section class="admin-editor-panel">
                <div class="admin-panel-header">
                    <div>
                        <h3 id="${collectionName}EditorTitle">New ${escapeHTML(config.singular)}</h3>
                        <p id="${collectionName}EditorSubtitle">Create a Firestore content record.</p>
                    </div>
                </div>

                <form id="${collectionName}Form" class="admin-form">
                    ${config.fields.map((field) => fieldMarkup(field, collectionName)).join("")}
                    <div id="${collectionName}Message" class="admin-message" aria-live="polite"></div>
                    <div class="admin-form-actions">
                        <button class="button gradient" type="submit">Save ${escapeHTML(config.singular)}</button>
                        <button class="button secondary" type="button" data-reset-form="${collectionName}">Clear form</button>
                    </div>
                </form>
            </section>
        </div>
    `;

    mount.querySelector(`[data-new-record="${collectionName}"]`)?.addEventListener("click", () => {
        resetContentForm(collectionName);
        document.getElementById(`${collectionName}Form`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    mount.querySelector(`[data-reset-form="${collectionName}"]`)?.addEventListener("click", () => resetContentForm(collectionName));

    document.getElementById(`${collectionName}Form`)?.addEventListener("submit", (event) => {
        event.preventDefault();
        saveContentRecord(collectionName);
    });

    document.getElementById(`${collectionName}Search`)?.addEventListener("input", () => renderContentList(collectionName));

    const titleField = document.getElementById(`${collectionName}-${config.titleField}`);
    const slugField = document.getElementById(`${collectionName}-slug`);

    if (titleField && slugField) {
        titleField.addEventListener("input", () => {
            if (!state.editing[collectionName] && !slugField.dataset.manual) {
                slugField.value = slugify(titleField.value);
            }
        });

        slugField.addEventListener("input", () => {
            slugField.dataset.manual = slugField.value ? "true" : "";
        });
    }

    resetContentForm(collectionName);
}

function getFormData(collectionName) {
    const config = CONTENT_CONFIG[collectionName];
    const data = {};

    for (const field of config.fields) {
        const element = document.getElementById(`${collectionName}-${field.name}`);
        if (!element) continue;

        if (field.type === "checkbox") {
            data[field.name] = element.checked;
        } else if (field.transform === "array") {
            data[field.name] = clean(element.value)
                .split(",")
                .map((item) => clean(item))
                .filter(Boolean);
        } else {
            data[field.name] = clean(element.value);
        }
    }

    if ("slug" in data) data.slug = slugify(data.slug);
    return data;
}

function validateContentData(collectionName, data) {
    const config = CONTENT_CONFIG[collectionName];

    for (const field of config.fields) {
        if (!field.required) continue;
        const value = data[field.name];
        if (Array.isArray(value) ? value.length === 0 : !value) {
            throw new Error(`${field.label} is required.`);
        }
    }

    if (data.slug) {
        const duplicate = (state.records[collectionName] || []).find(
            (record) => record.slug === data.slug && record.id !== state.editing[collectionName]
        );
        if (duplicate) throw new Error("That slug is already in use in this collection.");
    }
}

async function saveContentRecord(collectionName) {
    const config = CONTENT_CONFIG[collectionName];

    try {
        const data = getFormData(collectionName);
        validateContentData(collectionName, data);

        setAdminMessage(collectionName, "Saving...");

        const editingId = state.editing[collectionName];
        const payload = {
            ...data,
            updatedAt: serverTimestamp(),
            updatedBy: state.user.uid
        };

        if (data.status === "published" && collectionName === "posts") {
            const existing = (state.records.posts || []).find((record) => record.id === editingId);
            payload.publishedAt = existing?.publishedAt || serverTimestamp();
        }

        if (editingId) {
            await updateDoc(doc(db, collectionName, editingId), payload);
            setAdminMessage(collectionName, `${config.singular} updated successfully.`, "success");
        } else {
            await addDoc(collection(db, collectionName), {
                ...payload,
                createdAt: serverTimestamp(),
                createdBy: state.user.uid
            });
            setAdminMessage(collectionName, `${config.singular} created successfully.`, "success");
        }

        await loadContentCollection(collectionName);
        resetContentForm(collectionName, false);
        await refreshOverviewCounts();
    } catch (error) {
        console.error(`Could not save ${collectionName}:`, error);
        setAdminMessage(collectionName, error.message || "Could not save this record.", "error");
    }
}

function resetContentForm(collectionName, clearMessage = true) {
    const config = CONTENT_CONFIG[collectionName];
    const form = document.getElementById(`${collectionName}Form`);
    if (!form) return;

    form.reset();
    state.editing[collectionName] = null;

    for (const [key, value] of Object.entries(config.defaults || {})) {
        const element = document.getElementById(`${collectionName}-${key}`);
        if (!element) continue;
        if (element.type === "checkbox") element.checked = Boolean(value);
        else element.value = value;
    }

    const slugField = document.getElementById(`${collectionName}-slug`);
    if (slugField) slugField.dataset.manual = "";

    document.getElementById(`${collectionName}EditorTitle`).textContent = `New ${config.singular}`;
    document.getElementById(`${collectionName}EditorSubtitle`).textContent = "Create a Firestore content record.";

    if (clearMessage) setAdminMessage(collectionName, "");
}

function fillContentForm(collectionName, record) {
    const config = CONTENT_CONFIG[collectionName];
    state.editing[collectionName] = record.id;

    for (const field of config.fields) {
        const element = document.getElementById(`${collectionName}-${field.name}`);
        if (!element) continue;

        const value = record[field.name];

        if (field.type === "checkbox") element.checked = Boolean(value);
        else if (Array.isArray(value)) element.value = value.join(", ");
        else element.value = value ?? "";
    }

    const slugField = document.getElementById(`${collectionName}-slug`);
    if (slugField) slugField.dataset.manual = "true";

    document.getElementById(`${collectionName}EditorTitle`).textContent = `Edit ${config.singular}`;
    document.getElementById(`${collectionName}EditorSubtitle`).textContent = `Editing ${record[config.titleField] || record.id}`;
    setAdminMessage(collectionName, "");
    document.getElementById(`${collectionName}Form`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderContentList(collectionName) {
    const config = CONTENT_CONFIG[collectionName];
    const list = document.getElementById(`${collectionName}List`);
    const term = clean(document.getElementById(`${collectionName}Search`)?.value).toLowerCase();

    const records = (state.records[collectionName] || []).filter((record) => {
        const searchable = JSON.stringify(record).toLowerCase();
        return !term || searchable.includes(term);
    });

    if (!records.length) {
        list.innerHTML = `<div class="admin-empty">No ${escapeHTML(config.label.toLowerCase())} found.</div>`;
        return;
    }

    list.innerHTML = records.map((record) => `
        <article class="admin-record">
            <div>
                <h3>${escapeHTML(record[config.titleField] || "Untitled")}</h3>
                <div class="admin-record-meta">${escapeHTML(config.meta(record))} · Updated ${escapeHTML(toDateLabel(record.updatedAt || record.createdAt))}</div>
            </div>
            <div class="admin-record-actions">
                <button class="admin-icon-button" type="button" data-edit="${record.id}" title="Edit">Edit</button>
                <button class="admin-icon-button danger" type="button" data-delete="${record.id}" title="Delete">Delete</button>
            </div>
        </article>
    `).join("");

    list.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", () => {
            const record = state.records[collectionName].find((item) => item.id === button.dataset.edit);
            if (record) fillContentForm(collectionName, record);
        });
    });

    list.querySelectorAll("[data-delete]").forEach((button) => {
        button.addEventListener("click", () => {
            const record = state.records[collectionName].find((item) => item.id === button.dataset.delete);
            if (!record) return;

            openConfirm(
                `Delete ${config.singular}?`,
                `"${record[config.titleField] || "Untitled"}" will be permanently removed from Firestore.`,
                async () => {
                    await deleteDoc(doc(db, collectionName, record.id));
                    await loadContentCollection(collectionName);
                    await refreshOverviewCounts();
                }
            );
        });
    });
}

async function loadContentCollection(collectionName) {
    try {
        const snapshot = await getDocs(query(collection(db, collectionName), orderBy("updatedAt", "desc")));
        state.records[collectionName] = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
        renderContentList(collectionName);
    } catch (error) {
        console.error(`Could not load ${collectionName}:`, error);

        // Fresh collections may contain no documents yet. This fallback also
        // handles legacy records that predate the updatedAt field.
        try {
            const snapshot = await getDocs(collection(db, collectionName));
            state.records[collectionName] = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
            renderContentList(collectionName);
        } catch (fallbackError) {
            console.error(`Fallback load failed for ${collectionName}:`, fallbackError);
            document.getElementById(`${collectionName}List`).innerHTML =
                `<div class="admin-empty">Could not load this collection. Check Firestore Rules and the browser console.</div>`;
        }
    }
}

async function refreshOverviewCounts() {
    const mappings = [
        ["posts", "statPosts"],
        ["projects", "statProjects"],
        ["users", "statUsers"],
        ["comments", "statComments"]
    ];

    await Promise.all(mappings.map(async ([collectionName, elementId]) => {
        const element = document.getElementById(elementId);
        try {
            const snapshot = await getCountFromServer(collection(db, collectionName));
            element.textContent = snapshot.data().count;
        } catch (error) {
            console.error(`Count failed for ${collectionName}:`, error);
            element.textContent = "—";
        }
    }));

    renderOverviewActivity();
}

function renderOverviewActivity() {
    const mount = document.getElementById("overviewActivity");
    const recent = [];

    for (const collectionName of Object.keys(CONTENT_CONFIG)) {
        for (const record of state.records[collectionName] || []) {
            recent.push({
                collectionName,
                title: record[CONTENT_CONFIG[collectionName].titleField] || "Untitled",
                updatedAt: record.updatedAt || record.createdAt
            });
        }
    }

    recent.sort((a, b) => {
        const aDate = a.updatedAt?.toMillis?.() || 0;
        const bDate = b.updatedAt?.toMillis?.() || 0;
        return bDate - aDate;
    });

    if (!recent.length) {
        mount.innerHTML = `<div class="admin-empty">Create your first managed content item and it will appear here.</div>`;
        return;
    }

    mount.innerHTML = recent.slice(0, 5).map((item) => `
        <article class="admin-record">
            <div>
                <h3>${escapeHTML(item.title)}</h3>
                <div class="admin-record-meta">${escapeHTML(CONTENT_CONFIG[item.collectionName].label)} · ${escapeHTML(toDateLabel(item.updatedAt))}</div>
            </div>
            ${statusChip("active")}
        </article>
    `).join("");
}

async function loadUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    state.users = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
    renderUsers();
}

function renderUsers() {
    const body = document.getElementById("userTableBody");
    const term = clean(document.getElementById("userSearch")?.value).toLowerCase();

    const users = state.users.filter((user) =>
        !term ||
        clean(user.username).toLowerCase().includes(term) ||
        clean(user.email).toLowerCase().includes(term)
    );

    if (!users.length) {
        body.innerHTML = `<tr><td colspan="4"><div class="admin-empty">No users found.</div></td></tr>`;
        return;
    }

    body.innerHTML = users.map((user) => `
        <tr>
            <td>${escapeHTML(user.emoji || "🦋")} ${escapeHTML(user.username || "Member")}</td>
            <td>${escapeHTML(user.email || "")}</td>
            <td>${escapeHTML(user.membership || "JAE HQ Member")}</td>
            <td>
                <select data-user-role="${user.id}" ${user.id === state.user.uid ? "disabled" : ""}>
                    <option value="member" ${user.role !== "admin" ? "selected" : ""}>Member</option>
                    <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                </select>
            </td>
        </tr>
    `).join("");

    body.querySelectorAll("[data-user-role]").forEach((select) => {
        select.addEventListener("change", async () => {
            const userId = select.dataset.userRole;
            const nextRole = select.value;

            try {
                await updateDoc(doc(db, "users", userId), {
                    role: nextRole,
                    updatedAt: serverTimestamp()
                });
                await loadUsers();
            } catch (error) {
                console.error("Could not update user role:", error);
                alert("The role could not be updated. Check Firestore Rules.");
                await loadUsers();
            }
        });
    });
}

async function loadComments() {
    try {
        const snapshot = await getDocs(query(collection(db, "comments"), orderBy("createdAt", "desc"), limit(200)));
        state.comments = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
    } catch (error) {
        console.warn("Comments query used fallback:", error);
        try {
            const snapshot = await getDocs(collection(db, "comments"));
            state.comments = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
        } catch (fallbackError) {
            console.error("Could not load comments:", fallbackError);
            state.comments = [];
        }
    }

    renderComments();
}

function renderComments() {
    const list = document.getElementById("commentList");
    const term = clean(document.getElementById("commentSearch")?.value).toLowerCase();

    const comments = state.comments.filter((comment) =>
        !term ||
        clean(comment.text).toLowerCase().includes(term) ||
        clean(comment.username).toLowerCase().includes(term)
    );

    if (!comments.length) {
        list.innerHTML = `<div class="admin-empty">No Firestore comments yet. Published posts now accept comments from signed-in members.</div>`;
        return;
    }

    list.innerHTML = comments.map((comment) => `
        <article class="admin-record">
            <div>
                <h3>${escapeHTML(comment.username || "Member")}</h3>
                <div class="admin-record-meta">${escapeHTML(comment.text || "")} · ${escapeHTML(toDateLabel(comment.createdAt))}</div>
            </div>
            <div class="admin-record-actions">
                <button class="admin-icon-button danger" type="button" data-delete-comment="${comment.id}">Delete</button>
            </div>
        </article>
    `).join("");

    list.querySelectorAll("[data-delete-comment]").forEach((button) => {
        button.addEventListener("click", () => {
            const comment = state.comments.find((item) => item.id === button.dataset.deleteComment);
            if (!comment) return;

            openConfirm(
                "Delete comment?",
                "This comment will be permanently removed.",
                async () => {
                    await deleteDoc(doc(db, "comments", comment.id));
                    await loadComments();
                    await refreshOverviewCounts();
                }
            );
        });
    });
}

function openConfirm(title, text, action) {
    state.deleteAction = action;
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmText").textContent = text;
    document.getElementById("confirmModal").classList.add("open");
}

function closeConfirm() {
    state.deleteAction = null;
    document.getElementById("confirmModal").classList.remove("open");
}

function switchView(viewName) {
    if (!document.getElementById(`view-${viewName}`)) return;

    state.currentView = viewName;

    document.querySelectorAll(".admin-view").forEach((view) => {
        view.classList.toggle("active", view.id === `view-${viewName}`);
    });

    document.querySelectorAll(".admin-nav [data-view]").forEach((button) => {
        button.classList.toggle("active", button.dataset.view === viewName);
    });

    const labels = {
        overview: "Overview",
        posts: "Blog posts",
        projects: "Portfolio",
        youtube: "YouTube",
        books: "Books",
        travel: "Travel",
        users: "Users",
        comments: "Comments",
        media: "Media Upload",
        seo: "SEO Tools"
    };

    document.getElementById("adminTopTitle").textContent = labels[viewName] || "Admin Studio";
    document.getElementById("adminApp").classList.remove("sidebar-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function initialiseAdmin(profile, user) {
    state.profile = profile;
    state.user = user;

    document.getElementById("adminUsername").textContent = profile.username || user.displayName || "Katie";
    document.getElementById("adminEmail").textContent = user.email || "";
    document.getElementById("overviewName").textContent = profile.username || user.displayName || "Katie";

    for (const collectionName of Object.keys(CONTENT_CONFIG)) {
        renderContentView(collectionName);
    }

    document.querySelectorAll(".admin-nav [data-view]").forEach((button) => {
        button.addEventListener("click", () => switchView(button.dataset.view));
    });

    document.querySelectorAll("[data-quick-view]").forEach((button) => {
        button.addEventListener("click", () => {
            const viewName = button.dataset.quickView;
            switchView(viewName);
            resetContentForm(viewName);
        });
    });

    document.getElementById("adminMobileMenu").addEventListener("click", () => {
        document.getElementById("adminApp").classList.toggle("sidebar-open");
    });

    document.getElementById("adminLogoutButton").addEventListener("click", () => window.logout());

    document.getElementById("userSearch").addEventListener("input", renderUsers);
    document.getElementById("commentSearch").addEventListener("input", renderComments);

    document.getElementById("confirmCancel").addEventListener("click", closeConfirm);
    document.getElementById("confirmDelete").addEventListener("click", async () => {
        const action = state.deleteAction;
        closeConfirm();

        if (!action) return;
        try {
            await action();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("The item could not be deleted. Check Firestore Rules and the console.");
        }
    });

    document.getElementById("confirmModal").addEventListener("click", (event) => {
        if (event.target.id === "confirmModal") closeConfirm();
    });

    await Promise.all([
        ...Object.keys(CONTENT_CONFIG).map((collectionName) => loadContentCollection(collectionName)),
        loadUsers(),
        loadComments()
    ]);

    await refreshOverviewCounts();

    document.getElementById("adminLoading").classList.add("hidden");
    document.getElementById("adminApp").classList.remove("hidden");
}

watchAuth(async ({ user, profile }) => {
    if (!user) {
        window.location.replace("../login.html?next=/admin/index.html");
        return;
    }

    if (!profile || profile.role !== "admin") {
        console.warn("[JAE HQ ADMIN] Access denied", {
            uid: user.uid,
            role: profile?.role || null
        });
        window.location.replace("../index.html");
        return;
    }

    try {
        await initialiseAdmin(profile, user);
    } catch (error) {
        console.error("Admin Studio initialisation failed:", error);
        document.getElementById("adminLoading").innerHTML = `
            <div class="admin-loading-card">
                <span class="eyebrow">Admin Studio error</span>
                <h2>The studio could not finish loading.</h2>
                <p class="lead">Check that the Phase 3 Firestore Rules are published, then open the browser console for the exact error.</p>
                <div class="button-row"><a class="button secondary" href="../index.html">Return to JAE HQ</a></div>
            </div>
        `;
    }
});
