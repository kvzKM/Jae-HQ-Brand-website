import { watchAuth } from "./auth.js";

const butterflyIcon = `
<svg viewBox="0 0 64 64" aria-hidden="true" fill="none">
    <path d="M31 29C25 13 10 7 7 17c-3 9 8 18 22 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M33 29c6-16 21-22 24-12 3 9-8 18-22 18" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M29 35C18 35 10 41 13 49c3 8 14 5 18-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M35 35c11 0 19 6 16 14-3 8-14 5-18-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M32 26v19" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const links = [
    ["Home", "index.html"],
    ["Portfolio", "portfolio.html"],
    ["Blog", "blog.html"],
    ["YouTube", "youtube.html"],
    ["Books", "books.html"],
    ["Travel", "travel.html"]
];

function currentFile() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function renderNavigation() {
    const mount = document.getElementById("siteNavigation");
    if (!mount) return;

    const activeFile = currentFile();

    mount.innerHTML = `
        <div class="site-nav-wrap">
            <nav class="site-nav" aria-label="Main navigation">
                <a href="index.html" class="brand" aria-label="JAE HQ home">
                    <span class="brand-symbol">${butterflyIcon}</span>
                    <span class="brand-copy">
                        <strong>JAE HQ</strong>
                        <small>Creative technology, by Katie.</small>
                    </span>
                </a>

                <button class="mobile-menu-button" id="mobileMenuButton" aria-label="Open navigation" aria-expanded="false">☰</button>

                <div class="nav-links" id="navLinks">
                    ${links.map(([label, href]) => `
                        <a href="${href}" class="${activeFile === href ? "active" : ""}">${label}</a>
                    `).join("")}
                </div>

                <div class="nav-actions">
                    <div class="nav-user-copy" id="navUserCopy">
                        <strong>Welcome</strong>
                        <small>Explore JAE HQ</small>
                    </div>

                    <div class="profile-menu" id="profileMenu">
                        <button class="profile-trigger" id="profileTrigger" aria-label="Account menu" aria-expanded="false">👤</button>
                        <div class="profile-dropdown" id="profileDropdown">
                            <a id="loginMenuLink" href="login.html">Log in</a>
                            <a id="signupMenuLink" href="signup.html">Create account</a>
                            <a id="profileMenuLink" href="profile.html" class="hidden">My profile</a>
                            <a id="adminMenuLink" href="admin/index.html" class="hidden">Admin Studio</a>
                            <button id="logoutMenuButton" class="danger hidden" type="button">Log out</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    `;

    const nav = mount.querySelector(".site-nav");
    const mobileButton = document.getElementById("mobileMenuButton");
    const profileMenu = document.getElementById("profileMenu");
    const profileTrigger = document.getElementById("profileTrigger");

    mobileButton?.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("menu-open");
        mobileButton.setAttribute("aria-expanded", String(isOpen));
        mobileButton.textContent = isOpen ? "✕" : "☰";
    });

    profileTrigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = profileMenu.classList.toggle("open");
        profileTrigger.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (!profileMenu?.contains(event.target)) {
            profileMenu?.classList.remove("open");
            profileTrigger?.setAttribute("aria-expanded", "false");
        }
    });

    document.getElementById("logoutMenuButton")?.addEventListener("click", () => window.logout());
}

function renderFooter() {
    const mount = document.getElementById("siteFooter");
    if (!mount) return;

    mount.innerHTML = `
        <footer class="site-footer">
            <span>© ${new Date().getFullYear()} JAE HQ. Built by Katie.</span>
            <span><a href="social.html">Socials</a> · Creative technology with a softer edge.</span>
        </footer>
    `;
}

function updateAuthUI(user, profile) {
    const copy = document.getElementById("navUserCopy");
    const trigger = document.getElementById("profileTrigger");
    const login = document.getElementById("loginMenuLink");
    const signup = document.getElementById("signupMenuLink");
    const profileLink = document.getElementById("profileMenuLink");
    const adminLink = document.getElementById("adminMenuLink");
    const logout = document.getElementById("logoutMenuButton");

    if (user) {
        const username = profile?.username || user.displayName || "Member";
        if (copy) {
            copy.innerHTML = `<strong>${username}</strong><small>${profile?.membership || "JAE HQ Member"}</small>`;
        }
        if (trigger) trigger.textContent = profile?.emoji || "🦋";
        login?.classList.add("hidden");
        signup?.classList.add("hidden");
        profileLink?.classList.remove("hidden");
        logout?.classList.remove("hidden");

        if (profile?.role === "admin") adminLink?.classList.remove("hidden");

        document.getElementById("guestCta")?.classList.add("hidden");
        document.getElementById("memberCta")?.classList.remove("hidden");
    } else {
        if (copy) copy.innerHTML = `<strong>Welcome</strong><small>Explore JAE HQ</small>`;
        if (trigger) trigger.textContent = "👤";
        login?.classList.remove("hidden");
        signup?.classList.remove("hidden");
        profileLink?.classList.add("hidden");
        adminLink?.classList.add("hidden");
        logout?.classList.add("hidden");

        document.getElementById("guestCta")?.classList.remove("hidden");
        document.getElementById("memberCta")?.classList.add("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderNavigation();
    renderFooter();
    watchAuth(({ user, profile }) => updateAuthUI(user, profile));
});
