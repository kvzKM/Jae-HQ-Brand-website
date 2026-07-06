const posts = [
    {
        title: "Day in the life",
        date: "April 2026",
        tags: ["life", "writing"],
        image: "images/test.svg",
        content: "You will not believe what I did today..."
    },
    {
        title: "We are back",
        date: "April 2026",
        tags: ["life", "travel", "lando"],
        image: "images/test.svg",
        content: "Me and Lando went to visit Oscar today..."
    }
];

const container = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");

function renderPosts(items) {
    if (!container) return;

    if (!items.length) {
        container.innerHTML = `<div class="empty-state">No posts match your search yet.</div>`;
        return;
    }

    container.innerHTML = items.map((post) => `
        <article class="media-card">
            <img src="${post.image}" alt="">
            <div class="media-card-body">
                <div class="meta">${post.date} · ${post.tags.join(" · ")}</div>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            </div>
        </article>
    `).join("");
}

searchInput?.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    const results = posts.filter((post) =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term))
    );
    renderPosts(results);
});

renderPosts(posts);
