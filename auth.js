@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root {
    --ink: #152033;
    --ink-soft: #566176;
    --navy: #10233f;
    --navy-2: #173354;
    --blue: #5179c9;
    --violet: #8f7bd8;
    --aqua: #75c5cf;
    --rose: #d7a8c7;
    --paper: #f7f9fc;
    --surface: rgba(255, 255, 255, 0.82);
    --surface-strong: #ffffff;
    --line: rgba(21, 32, 51, 0.12);
    --line-strong: rgba(81, 121, 201, 0.28);
    --shadow: 0 24px 70px rgba(34, 50, 79, 0.12);
    --shadow-soft: 0 14px 35px rgba(34, 50, 79, 0.09);
    --gradient: linear-gradient(135deg, var(--blue), var(--violet) 55%, var(--aqua));
    --radius-xl: 32px;
    --radius-lg: 22px;
    --radius-md: 14px;
    --content: 1180px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    min-height: 100vh;
    color: var(--ink);
    font-family: "DM Sans", sans-serif;
    background:
        radial-gradient(circle at 10% 8%, rgba(143, 123, 216, 0.15), transparent 24rem),
        radial-gradient(circle at 90% 18%, rgba(117, 197, 207, 0.15), transparent 25rem),
        linear-gradient(180deg, #fbfcff 0%, #f4f7fb 55%, #f9fbfd 100%);
    overflow-x: hidden;
}

body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: .45;
    background-image:
        linear-gradient(rgba(81,121,201,.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(81,121,201,.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, black, transparent 78%);
}

img, iframe {
    max-width: 100%;
}

a {
    color: inherit;
}

button, input, textarea, select {
    font: inherit;
}

button, .button {
    border: 0;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
    outline: 3px solid rgba(81, 121, 201, .35);
    outline-offset: 3px;
}

.site-shell {
    width: min(var(--content), calc(100% - 40px));
    margin: 0 auto;
}

.site-main {
    min-height: 60vh;
}

.site-nav-wrap {
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 16px 0 8px;
}

.site-nav {
    width: min(var(--content), calc(100% - 40px));
    margin: 0 auto;
    min-height: 68px;
    padding: 10px 12px 10px 18px;
    display: flex;
    align-items: center;
    gap: 22px;
    background: rgba(255, 255, 255, .82);
    border: 1px solid var(--line);
    border-radius: 22px;
    box-shadow: var(--shadow-soft);
    backdrop-filter: blur(18px);
}

.brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
    flex: 0 0 auto;
}

.brand-symbol {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    color: white;
    background: var(--gradient);
    box-shadow: 0 10px 24px rgba(81, 121, 201, .25);
}

.brand-symbol svg {
    width: 23px;
    height: 23px;
}

.brand-copy strong {
    display: block;
    font: 700 18px/1 "Space Grotesk", sans-serif;
    letter-spacing: -.3px;
}

.brand-copy small {
    display: block;
    margin-top: 4px;
    color: var(--ink-soft);
    font-size: 11px;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: auto;
}

.nav-links a {
    padding: 10px 11px;
    border-radius: 11px;
    color: var(--ink-soft);
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: .2s ease;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--navy);
    background: rgba(81, 121, 201, .09);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.nav-user-copy {
    max-width: 160px;
    text-align: right;
}

.nav-user-copy strong,
.nav-user-copy small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.nav-user-copy strong {
    font-size: 13px;
}

.nav-user-copy small {
    color: var(--ink-soft);
    font-size: 11px;
}

.profile-menu {
    position: relative;
}

.profile-trigger {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: white;
    color: var(--ink);
    cursor: pointer;
    font-size: 20px;
    box-shadow: var(--shadow-soft);
}

.profile-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 230px;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: 17px;
    background: rgba(255,255,255,.97);
    box-shadow: var(--shadow);
    display: none;
}

.profile-menu.open .profile-dropdown {
    display: block;
}

.profile-dropdown a,
.profile-dropdown button {
    width: 100%;
    min-height: 42px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    border-radius: 11px;
    color: var(--ink);
    text-decoration: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
}

.profile-dropdown a:hover,
.profile-dropdown button:hover {
    background: rgba(81,121,201,.08);
}

.profile-dropdown .danger {
    color: #a83c53;
}

.mobile-menu-button {
    display: none;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: var(--navy);
    color: white;
    cursor: pointer;
}

.hero {
    width: min(var(--content), calc(100% - 40px));
    margin: 38px auto 88px;
    padding: clamp(42px, 7vw, 84px);
    min-height: 610px;
    display: grid;
    grid-template-columns: 1.08fr .92fr;
    align-items: center;
    gap: clamp(38px, 7vw, 86px);
    position: relative;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background:
        radial-gradient(circle at 90% 15%, rgba(117,197,207,.22), transparent 30%),
        radial-gradient(circle at 30% 95%, rgba(143,123,216,.16), transparent 36%),
        rgba(255,255,255,.72);
    box-shadow: var(--shadow);
}

.hero::after {
    content: "";
    width: 270px;
    height: 270px;
    position: absolute;
    right: -100px;
    bottom: -120px;
    border: 1px solid rgba(81,121,201,.15);
    border-radius: 50%;
    box-shadow:
        0 0 0 40px rgba(81,121,201,.03),
        0 0 0 80px rgba(143,123,216,.025);
}

.eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 18px;
    color: var(--blue);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.7px;
    text-transform: uppercase;
}

.eyebrow::before {
    content: "";
    width: 26px;
    height: 2px;
    border-radius: 99px;
    background: var(--gradient);
}

h1, h2, h3 {
    font-family: "Space Grotesk", sans-serif;
}

h1 {
    max-width: 760px;
    font-size: clamp(48px, 7vw, 88px);
    line-height: .98;
    letter-spacing: -4px;
}

h2 {
    font-size: clamp(32px, 5vw, 54px);
    line-height: 1.04;
    letter-spacing: -2px;
}

h3 {
    font-size: 22px;
    letter-spacing: -.7px;
}

.gradient-text {
    color: transparent;
    background: var(--gradient);
    background-clip: text;
    -webkit-background-clip: text;
}

.lead {
    max-width: 660px;
    margin-top: 24px;
    color: var(--ink-soft);
    font-size: clamp(16px, 2vw, 19px);
    line-height: 1.75;
}

.button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 30px;
}

.button {
    min-height: 48px;
    padding: 0 21px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: var(--navy);
    color: white;
    text-decoration: none;
    font-weight: 700;
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease;
}

.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(16,35,63,.18);
}

.button.secondary {
    border: 1px solid var(--line-strong);
    color: var(--navy);
    background: rgba(255,255,255,.65);
}

.button.gradient {
    background: var(--gradient);
}

.hero-visual {
    min-height: 430px;
    display: grid;
    place-items: center;
    position: relative;
}

.butterfly-panel {
    width: min(100%, 470px);
    aspect-ratio: 1 / 1;
    position: relative;
    display: grid;
    place-items: center;
}

.butterfly-glow {
    position: absolute;
    inset: 16%;
    border-radius: 50%;
    background: var(--gradient);
    filter: blur(60px);
    opacity: .2;
}

.butterfly-card {
    width: 72%;
    aspect-ratio: 1 / 1;
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,.7);
    border-radius: 34% 66% 60% 40% / 42% 38% 62% 58%;
    background:
        linear-gradient(135deg, rgba(255,255,255,.86), rgba(255,255,255,.42));
    box-shadow: var(--shadow);
    backdrop-filter: blur(20px);
    animation: breathe 7s ease-in-out infinite;
}

.butterfly-card svg {
    width: 52%;
    height: 52%;
    color: var(--blue);
    filter: drop-shadow(0 15px 22px rgba(81,121,201,.22));
}

@keyframes breathe {
    0%,100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-11px) rotate(2deg); }
}

.page-hero {
    width: min(var(--content), calc(100% - 40px));
    margin: 38px auto 52px;
    padding: clamp(42px, 6vw, 72px);
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background: rgba(255,255,255,.7);
    box-shadow: var(--shadow-soft);
}

.page-hero p {
    max-width: 700px;
    margin-top: 18px;
    color: var(--ink-soft);
    line-height: 1.7;
    font-size: 17px;
}

.section {
    width: min(var(--content), calc(100% - 40px));
    margin: 0 auto 90px;
}

.section-header {
    max-width: 720px;
    margin-bottom: 32px;
}

.section-header p {
    margin-top: 14px;
    color: var(--ink-soft);
    line-height: 1.7;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
}

.card {
    padding: 28px;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-soft);
}

.card-icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    margin-bottom: 22px;
    border-radius: 15px;
    color: white;
    background: var(--gradient);
}

.card p {
    margin-top: 12px;
    color: var(--ink-soft);
    line-height: 1.7;
}

.link-card {
    color: inherit;
    text-decoration: none;
    transition: transform .2s ease, border-color .2s ease;
}

.link-card:hover {
    transform: translateY(-5px);
    border-color: var(--line-strong);
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
}

.media-card {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: var(--surface);
    box-shadow: var(--shadow-soft);
}

.media-card img,
.media-card iframe {
    width: 100%;
    display: block;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border: 0;
}

.media-card-body {
    padding: 25px;
}

.media-card-body p {
    margin-top: 10px;
    color: var(--ink-soft);
    line-height: 1.65;
}

.meta {
    margin-bottom: 9px;
    color: var(--blue);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .7px;
    text-transform: uppercase;
}

.search-field {
    width: 100%;
    min-height: 52px;
    padding: 0 17px;
    border: 1px solid var(--line);
    border-radius: 15px;
    background: rgba(255,255,255,.85);
    color: var(--ink);
}

.auth-layout {
    width: min(1040px, calc(100% - 40px));
    min-height: calc(100vh - 110px);
    margin: 20px auto;
    display: grid;
    grid-template-columns: .9fr 1.1fr;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background: white;
    box-shadow: var(--shadow);
}

.auth-brand-panel {
    padding: clamp(38px, 6vw, 72px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
    background:
        radial-gradient(circle at 20% 10%, rgba(117,197,207,.35), transparent 30%),
        radial-gradient(circle at 90% 90%, rgba(143,123,216,.38), transparent 32%),
        var(--navy);
}

.auth-brand-panel p {
    margin-top: 18px;
    color: rgba(255,255,255,.74);
    line-height: 1.75;
}

.auth-brand-panel h1 {
    font-size: clamp(44px, 6vw, 72px);
    letter-spacing: -3px;
}

.auth-form-panel {
    padding: clamp(38px, 6vw, 76px);
    display: flex;
    align-items: center;
}

.auth-form-wrap {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
}

.auth-form-wrap h2 {
    margin-bottom: 10px;
}

.auth-subtext {
    margin-bottom: 30px;
    color: var(--ink-soft);
    line-height: 1.6;
}

.form {
    display: grid;
    gap: 16px;
}

.field label {
    display: block;
    margin-bottom: 7px;
    font-size: 13px;
    font-weight: 700;
}

.field input,
.field textarea,
.field select {
    width: 100%;
    min-height: 50px;
    padding: 13px 15px;
    border: 1px solid var(--line);
    border-radius: 14px;
    color: var(--ink);
    background: var(--paper);
}

.form-message {
    min-height: 22px;
    color: var(--ink-soft);
    font-size: 13px;
}

.form-message.error { color: #a83c53; }
.form-message.success { color: #2a7c68; }

.emoji-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
}

.emoji-option {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: white;
    cursor: pointer;
    font-size: 22px;
}

.emoji-option.selected {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(81,121,201,.12);
}

.form-footer {
    margin-top: 24px;
    color: var(--ink-soft);
    font-size: 14px;
}

.form-footer a {
    color: var(--blue);
    font-weight: 700;
    text-decoration: none;
}

.profile-shell {
    display: grid;
    grid-template-columns: .7fr 1.3fr;
    gap: 22px;
}

.profile-card {
    padding: 32px;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: white;
    box-shadow: var(--shadow-soft);
}

.profile-avatar {
    width: 86px;
    height: 86px;
    display: grid;
    place-items: center;
    margin-bottom: 22px;
    border-radius: 26px;
    background: var(--gradient);
    color: white;
    font-size: 38px;
}

.profile-card p {
    margin-top: 8px;
    color: var(--ink-soft);
}

.status-chip {
    display: inline-flex;
    margin-top: 16px;
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(81,121,201,.1);
    color: var(--blue);
    font-size: 12px;
    font-weight: 700;
}

.hidden {
    display: none !important;
}

.empty-state {
    padding: 46px 24px;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-lg);
    color: var(--ink-soft);
    text-align: center;
}

.site-footer {
    width: min(var(--content), calc(100% - 40px));
    margin: 60px auto 22px;
    padding: 28px 0;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    border-top: 1px solid var(--line);
    color: var(--ink-soft);
    font-size: 13px;
}

.site-footer a {
    color: var(--ink-soft);
    text-decoration: none;
}

@media (max-width: 1040px) {
    .site-nav {
        flex-wrap: wrap;
    }

    .mobile-menu-button {
        display: grid;
        place-items: center;
        margin-left: auto;
    }

    .nav-links {
        order: 4;
        width: 100%;
        display: none;
        flex-direction: column;
        align-items: stretch;
        padding: 8px 0 3px;
        border-top: 1px solid var(--line);
    }

    .site-nav.menu-open .nav-links {
        display: flex;
    }

    .nav-links a {
        padding: 12px 13px;
    }

    .nav-user-copy {
        display: none;
    }

    .hero {
        grid-template-columns: 1fr;
        min-height: auto;
    }

    .hero-visual {
        min-height: 360px;
    }

    .card-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 760px) {
    :root {
        --radius-xl: 24px;
        --radius-lg: 18px;
    }

    .site-shell,
    .site-nav,
    .hero,
    .page-hero,
    .section,
    .site-footer,
    .auth-layout {
        width: min(100% - 24px, var(--content));
    }

    .site-nav-wrap {
        padding-top: 8px;
    }

    .brand-copy small {
        display: none;
    }

    .auth-layout {
        grid-template-columns: 1fr;
    }

    .auth-brand-panel {
        min-height: 310px;
    }

    .card-grid,
    .content-grid,
    .profile-shell {
        grid-template-columns: 1fr;
    }

    .hero {
        margin-top: 20px;
        margin-bottom: 60px;
        padding: 38px 24px;
    }

    h1 {
        font-size: clamp(45px, 15vw, 68px);
        letter-spacing: -3px;
    }

    .hero-visual {
        min-height: 290px;
    }

    .page-hero {
        margin-top: 20px;
        padding: 42px 25px;
    }

    .section {
        margin-bottom: 65px;
    }

    .site-footer {
        flex-direction: column;
    }
}

@media (max-width: 430px) {
    .site-nav {
        padding-left: 12px;
    }

    .brand-copy strong {
        font-size: 16px;
    }

    .nav-actions {
        gap: 6px;
    }

    .profile-trigger,
    .mobile-menu-button {
        width: 40px;
        height: 40px;
    }

    .button-row {
        flex-direction: column;
    }

    .button-row .button {
        width: 100%;
    }

    .auth-form-panel,
    .auth-brand-panel {
        padding: 34px 24px;
    }
}


/* =====================================================
   JAE HQ ADMIN STUDIO
===================================================== */

.admin-body {
    min-height: 100vh;
    background:
        radial-gradient(circle at 8% 8%, rgba(143, 123, 216, .14), transparent 26rem),
        radial-gradient(circle at 92% 14%, rgba(117, 197, 207, .13), transparent 28rem),
        #f3f6fb;
}

.admin-loading {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 30px;
}

.admin-loading-card {
    width: min(520px, 100%);
    padding: 42px;
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background: rgba(255, 255, 255, .9);
    box-shadow: var(--shadow);
    text-align: center;
}

.admin-app {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
}

.admin-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255,255,255,.1);
    color: white;
    background:
        radial-gradient(circle at 20% 0%, rgba(117,197,207,.18), transparent 26rem),
        radial-gradient(circle at 100% 100%, rgba(143,123,216,.24), transparent 26rem),
        var(--navy);
}

.admin-brand {
    padding: 8px 9px 26px;
    border-bottom: 1px solid rgba(255,255,255,.12);
}

.admin-brand .brand-copy small {
    color: rgba(255,255,255,.62);
}

.admin-nav {
    display: grid;
    gap: 5px;
    margin-top: 24px;
}

.admin-nav button {
    width: 100%;
    min-height: 46px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 13px;
    color: rgba(255,255,255,.72);
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-weight: 600;
}

.admin-nav button:hover,
.admin-nav button.active {
    color: white;
    background: rgba(255,255,255,.1);
}

.admin-nav-icon {
    width: 24px;
    text-align: center;
}

.admin-sidebar-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,.12);
}

.admin-user {
    padding: 12px;
    border-radius: 14px;
    background: rgba(255,255,255,.07);
}

.admin-user strong,
.admin-user small {
    display: block;
}

.admin-user small {
    margin-top: 4px;
    color: rgba(255,255,255,.62);
}

.admin-sidebar-footer .button {
    width: 100%;
    margin-top: 10px;
    background: rgba(255,255,255,.1);
}

.admin-main {
    min-width: 0;
    padding: 30px clamp(20px, 4vw, 54px) 70px;
}

.admin-topbar {
    min-height: 66px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
}

.admin-mobile-menu {
    display: none;
    width: 44px;
    height: 44px;
    border-radius: 13px;
    color: white;
    background: var(--navy);
    cursor: pointer;
}

.admin-topbar-copy {
    min-width: 0;
}

.admin-topbar-copy strong {
    display: block;
    font: 700 18px/1.2 "Space Grotesk", sans-serif;
}

.admin-topbar-copy small {
    color: var(--ink-soft);
}

.admin-live-link {
    margin-left: auto;
}

.admin-view {
    display: none;
}

.admin-view.active {
    display: block;
}

.admin-page-header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 24px;
    margin-bottom: 28px;
}

.admin-page-header p {
    max-width: 720px;
    margin-top: 10px;
    color: var(--ink-soft);
    line-height: 1.65;
}

.admin-page-header h1 {
    font-size: clamp(40px, 6vw, 68px);
    letter-spacing: -3px;
}

.admin-stat-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 28px;
}

.admin-stat {
    padding: 23px;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: rgba(255,255,255,.85);
    box-shadow: var(--shadow-soft);
}

.admin-stat-label {
    color: var(--ink-soft);
    font-size: 13px;
    font-weight: 700;
}

.admin-stat-value {
    display: block;
    margin-top: 12px;
    font: 700 clamp(32px, 4vw, 48px)/1 "Space Grotesk", sans-serif;
    letter-spacing: -2px;
}

.admin-stat-note {
    display: block;
    margin-top: 10px;
    color: var(--ink-soft);
    font-size: 12px;
}

.admin-panel-grid {
    display: grid;
    grid-template-columns: 1.15fr .85fr;
    gap: 20px;
}

.admin-panel {
    min-width: 0;
    padding: 25px;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: rgba(255,255,255,.88);
    box-shadow: var(--shadow-soft);
}

.admin-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
}

.admin-panel-header p {
    margin-top: 6px;
    color: var(--ink-soft);
    font-size: 13px;
}

.admin-quick-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.admin-quick-action {
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 16px;
    color: inherit;
    background: var(--paper);
    cursor: pointer;
    text-align: left;
}

.admin-quick-action:hover {
    border-color: var(--line-strong);
    background: white;
}

.admin-quick-action strong {
    display: block;
}

.admin-quick-action small {
    display: block;
    margin-top: 5px;
    color: var(--ink-soft);
}

.admin-content-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(330px, .9fr);
    gap: 20px;
    align-items: start;
}

.admin-list-panel,
.admin-editor-panel {
    min-width: 0;
    padding: 24px;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: rgba(255,255,255,.9);
    box-shadow: var(--shadow-soft);
}

.admin-editor-panel {
    position: sticky;
    top: 24px;
}

.admin-toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
}

.admin-toolbar .search-field {
    flex: 1;
}

.admin-record-list {
    display: grid;
    gap: 10px;
}

.admin-record {
    padding: 16px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 15px;
    background: var(--paper);
}

.admin-record h3 {
    font-size: 17px;
}

.admin-record-meta {
    margin-top: 5px;
    color: var(--ink-soft);
    font-size: 12px;
    overflow-wrap: anywhere;
}

.admin-record-actions {
    display: flex;
    gap: 7px;
}

.admin-icon-button {
    min-width: 38px;
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid var(--line);
    border-radius: 11px;
    color: var(--ink);
    background: white;
    cursor: pointer;
}

.admin-icon-button:hover {
    border-color: var(--line-strong);
}

.admin-icon-button.danger {
    color: #a83c53;
}

.admin-form {
    display: grid;
    gap: 14px;
}

.admin-form-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.admin-form .field textarea {
    min-height: 130px;
    resize: vertical;
}

.admin-form .field textarea.large-editor {
    min-height: 260px;
}

.admin-form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    padding-top: 6px;
}

.admin-message {
    min-height: 22px;
    color: var(--ink-soft);
    font-size: 13px;
}

.admin-message.success {
    color: #2a7c68;
}

.admin-message.error {
    color: #a83c53;
}

.admin-table-wrap {
    overflow-x: auto;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th,
.admin-table td {
    padding: 14px 12px;
    border-bottom: 1px solid var(--line);
    text-align: left;
    white-space: nowrap;
}

.admin-table th {
    color: var(--ink-soft);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .6px;
}

.admin-table td {
    font-size: 14px;
}

.admin-table select {
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: white;
    color: var(--ink);
}

.admin-empty {
    padding: 38px 20px;
    border: 1px dashed var(--line-strong);
    border-radius: 16px;
    color: var(--ink-soft);
    text-align: center;
}

.admin-status {
    display: inline-flex;
    padding: 6px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
}

.admin-status.published,
.admin-status.active,
.admin-status.admin {
    color: #226a59;
    background: rgba(42,124,104,.11);
}

.admin-status.draft,
.admin-status.hidden,
.admin-status.member {
    color: #6a5c24;
    background: rgba(198,161,91,.14);
}

.admin-status.archived {
    color: var(--ink-soft);
    background: rgba(86,97,118,.1);
}

.admin-note {
    padding: 16px 18px;
    margin-bottom: 20px;
    border-left: 4px solid var(--blue);
    border-radius: 0 14px 14px 0;
    background: rgba(81,121,201,.08);
    color: var(--ink-soft);
    line-height: 1.6;
    font-size: 13px;
}

.admin-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2000;
    padding: 20px;
    display: none;
    place-items: center;
    background: rgba(16,35,63,.48);
    backdrop-filter: blur(8px);
}

.admin-modal-backdrop.open {
    display: grid;
}

.admin-modal {
    width: min(500px, 100%);
    padding: 28px;
    border-radius: var(--radius-lg);
    background: white;
    box-shadow: var(--shadow);
}

.admin-modal p {
    margin-top: 12px;
    color: var(--ink-soft);
    line-height: 1.6;
}

.admin-modal .button-row {
    margin-top: 24px;
}

@media (max-width: 1180px) {
    .admin-stat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .admin-content-layout,
    .admin-panel-grid {
        grid-template-columns: 1fr;
    }

    .admin-editor-panel {
        position: static;
    }
}

@media (max-width: 900px) {
    .admin-app {
        grid-template-columns: 1fr;
    }

    .admin-sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        z-index: 1500;
        width: min(290px, 88vw);
        transform: translateX(-105%);
        transition: transform .25s ease;
        box-shadow: var(--shadow);
    }

    .admin-app.sidebar-open .admin-sidebar {
        transform: translateX(0);
    }

    .admin-mobile-menu {
        display: grid;
        place-items: center;
    }

    .admin-main {
        padding-top: 20px;
    }
}

@media (max-width: 650px) {
    .admin-main {
        padding-left: 12px;
        padding-right: 12px;
    }

    .admin-stat-grid,
    .admin-quick-grid,
    .admin-form-row {
        grid-template-columns: 1fr;
    }

    .admin-page-header {
        align-items: stretch;
        flex-direction: column;
    }

    .admin-page-header .button {
        width: 100%;
    }

    .admin-record {
        grid-template-columns: 1fr;
    }

    .admin-record-actions {
        justify-content: flex-end;
    }

    .admin-live-link {
        font-size: 0;
    }

    .admin-live-link::after {
        content: "View site";
        font-size: 14px;
    }
}


/* =====================================================
   JAE HQ BLOG + ARTICLE SYSTEM — PHASE 4
===================================================== */

.blog-controls {
    display: grid;
    gap: 18px;
    margin-bottom: 30px;
}

.blog-filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
}

.blog-filter-button {
    min-height: 40px;
    padding: 0 15px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(255,255,255,.8);
    color: var(--ink-soft);
    cursor: pointer;
    font-weight: 700;
}

.blog-filter-button:hover,
.blog-filter-button.active {
    color: white;
    border-color: transparent;
    background: var(--gradient);
}

.blog-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
}

.blog-card-live {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: rgba(255,255,255,.88);
    box-shadow: var(--shadow-soft);
}

.blog-card-live > a {
    color: inherit;
    text-decoration: none;
}

.blog-card-image {
    width: 100%;
    aspect-ratio: 16 / 9;
    display: block;
    object-fit: cover;
    background: linear-gradient(135deg, rgba(81,121,201,.18), rgba(143,123,216,.16), rgba(117,197,207,.18));
}

.blog-card-placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    display: grid;
    place-items: center;
    background:
        radial-gradient(circle at 70% 20%, rgba(117,197,207,.35), transparent 30%),
        radial-gradient(circle at 20% 80%, rgba(143,123,216,.3), transparent 34%),
        #eef3fa;
}

.blog-card-placeholder svg {
    width: 80px;
    color: var(--blue);
    opacity: .75;
}

.blog-card-content {
    padding: 26px;
}

.blog-card-content h2 {
    font-size: clamp(27px, 3vw, 38px);
    letter-spacing: -1.5px;
}

.blog-card-content p {
    margin-top: 12px;
    color: var(--ink-soft);
    line-height: 1.7;
}

.blog-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 18px;
}

.blog-tag {
    display: inline-flex;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(81,121,201,.09);
    color: var(--blue);
    font-size: 11px;
    font-weight: 700;
}

.blog-loading {
    grid-column: 1 / -1;
    min-height: 280px;
    display: grid;
    place-items: center;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-lg);
    color: var(--ink-soft);
}

.article-shell {
    width: min(900px, calc(100% - 40px));
    margin: 38px auto 90px;
}

.article-back {
    display: inline-flex;
    margin-bottom: 24px;
    color: var(--blue);
    text-decoration: none;
    font-weight: 700;
}

.article-card {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background: rgba(255,255,255,.94);
    box-shadow: var(--shadow);
}

.article-cover {
    width: 100%;
    max-height: 540px;
    display: block;
    object-fit: cover;
}

.article-header,
.article-body,
.article-comments {
    padding-left: clamp(24px, 7vw, 76px);
    padding-right: clamp(24px, 7vw, 76px);
}

.article-header {
    padding-top: clamp(42px, 7vw, 76px);
    padding-bottom: 34px;
}

.article-header h1 {
    max-width: 820px;
    font-size: clamp(44px, 7vw, 76px);
    letter-spacing: -3.5px;
}

.article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 18px;
    margin-top: 22px;
    color: var(--ink-soft);
    font-size: 13px;
}

.article-body {
    padding-bottom: clamp(46px, 7vw, 80px);
}

.article-copy {
    color: #344156;
    font-size: 18px;
    line-height: 1.9;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.article-copy p + p {
    margin-top: 1.3em;
}

.article-share {
    margin-top: 38px;
    padding-top: 24px;
    border-top: 1px solid var(--line);
}

.article-comments {
    padding-top: 46px;
    padding-bottom: 60px;
    border-top: 1px solid var(--line);
    background: rgba(247,249,252,.72);
}

.comment-list-live {
    display: grid;
    gap: 12px;
    margin-top: 24px;
}

.comment-live {
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 15px;
    background: white;
}

.comment-live-header {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: start;
}

.comment-user {
    display: flex;
    align-items: center;
    gap: 10px;
}

.comment-avatar {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: rgba(81,121,201,.09);
}

.comment-user strong,
.comment-user small {
    display: block;
}

.comment-user small {
    margin-top: 3px;
    color: var(--ink-soft);
    font-size: 11px;
}

.comment-live p {
    margin-top: 14px;
    color: var(--ink-soft);
    line-height: 1.7;
    white-space: pre-wrap;
}

.comment-delete {
    padding: 6px 9px;
    border-radius: 9px;
    color: #a83c53;
    background: rgba(168,60,83,.08);
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
}

.comment-form-live {
    display: grid;
    gap: 13px;
    margin-top: 28px;
}

.comment-form-live textarea {
    width: 100%;
    min-height: 130px;
    padding: 15px;
    border: 1px solid var(--line);
    border-radius: 14px;
    color: var(--ink);
    background: white;
    resize: vertical;
}

.comment-signin-card {
    margin-top: 26px;
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: white;
}

.post-error {
    padding: 54px 24px;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-lg);
    text-align: center;
}

.post-error p {
    max-width: 600px;
    margin: 14px auto 0;
    color: var(--ink-soft);
    line-height: 1.7;
}

@media (max-width: 760px) {
    .blog-grid {
        grid-template-columns: 1fr;
    }

    .article-shell {
        width: min(100% - 24px, 900px);
        margin-top: 20px;
    }

    .article-copy {
        font-size: 16.5px;
        line-height: 1.82;
    }
}

/* =====================================================
   PHASE 5 — SOFTWARE PORTFOLIO
===================================================== */

.portfolio-hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(300px, .85fr);
    gap: clamp(34px, 7vw, 90px);
    align-items: center;
}

.portfolio-code-window {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: rgba(16, 35, 63, .96);
    color: #e9effb;
    box-shadow: var(--shadow);
    transform: rotate(1deg);
}

.portfolio-window-bar {
    min-height: 48px;
    padding: 0 17px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255,255,255,.09);
    background: rgba(255,255,255,.04);
}

.window-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,.26);
}

.portfolio-window-title {
    margin-left: 8px;
    color: rgba(255,255,255,.55);
    font-size: 12px;
}

.portfolio-code {
    padding: clamp(25px, 5vw, 46px);
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: clamp(13px, 1.7vw, 16px);
    line-height: 1.9;
    overflow-x: auto;
}

.code-dim { color: #8190aa; }
.code-key { color: #b8a8ef; }
.code-value { color: #8dd7df; }
.code-string { color: #e2b8d4; }

.portfolio-controls {
    display: grid;
    grid-template-columns: minmax(240px, 1fr) auto;
    gap: 16px;
    align-items: start;
    margin-bottom: 28px;
}

.portfolio-filter-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
}

.portfolio-filter {
    min-height: 48px;
    padding: 0 16px;
    border: 1px solid var(--line);
    border-radius: 14px;
    color: var(--ink-soft);
    background: rgba(255,255,255,.72);
    cursor: pointer;
    font-weight: 700;
    text-transform: capitalize;
}

.portfolio-filter:hover,
.portfolio-filter.active {
    color: var(--navy);
    border-color: var(--line-strong);
    background: white;
    box-shadow: var(--shadow-soft);
}

.portfolio-results-summary {
    margin-bottom: 18px;
    color: var(--ink-soft);
    font-size: 14px;
}

.featured-project-section {
    margin-bottom: 48px;
}

.featured-project-grid {
    display: grid;
    gap: 20px;
}

.featured-project {
    min-height: 430px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(330px, .9fr);
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background: rgba(255,255,255,.88);
    box-shadow: var(--shadow);
}

.featured-project-copy {
    padding: clamp(34px, 6vw, 66px);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.featured-project-copy .lead {
    margin-top: 18px;
    font-size: 17px;
}

.featured-project-media {
    position: relative;
    min-height: 360px;
    background:
        radial-gradient(circle at 80% 20%, rgba(117,197,207,.35), transparent 30%),
        radial-gradient(circle at 20% 85%, rgba(143,123,216,.34), transparent 36%),
        var(--navy);
}

.featured-project-media img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.project-placeholder {
    width: 100%;
    height: 100%;
    min-height: inherit;
    padding: 34px;
    display: grid;
    place-items: center;
    color: white;
}

.project-placeholder-inner {
    width: min(320px, 80%);
    aspect-ratio: 1 / 1;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 32% 68% 64% 36% / 40% 38% 62% 60%;
    background: rgba(255,255,255,.07);
    backdrop-filter: blur(16px);
    font: 700 clamp(45px, 8vw, 92px)/1 "Space Grotesk", sans-serif;
    letter-spacing: -7px;
    box-shadow: 0 30px 70px rgba(0,0,0,.2);
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
}

.project-card {
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    background: rgba(255,255,255,.87);
    box-shadow: var(--shadow-soft);
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
}

.project-card:hover {
    transform: translateY(-6px);
    border-color: var(--line-strong);
    box-shadow: var(--shadow);
}

.project-card-media {
    min-height: 220px;
    position: relative;
    overflow: hidden;
    background:
        radial-gradient(circle at 80% 10%, rgba(117,197,207,.34), transparent 34%),
        radial-gradient(circle at 10% 95%, rgba(143,123,216,.35), transparent 38%),
        var(--navy);
}

.project-card-media img {
    width: 100%;
    height: 220px;
    display: block;
    object-fit: cover;
    transition: transform .35s ease;
}

.project-card:hover .project-card-media img {
    transform: scale(1.035);
}

.project-card-media .project-placeholder {
    min-height: 220px;
    padding: 22px;
}

.project-card-media .project-placeholder-inner {
    width: 130px;
    border-radius: 28% 72% 62% 38% / 42% 35% 65% 58%;
    font-size: 44px;
    letter-spacing: -4px;
}

.project-featured-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 2;
    padding: 7px 10px;
    border-radius: 999px;
    color: white;
    background: rgba(16,35,63,.76);
    backdrop-filter: blur(12px);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase;
}

.project-card-body {
    flex: 1;
    padding: 25px;
    display: flex;
    flex-direction: column;
}

.project-card-body h3 a {
    color: inherit;
    text-decoration: none;
}

.project-card-body h3 a:hover {
    color: var(--blue);
}

.project-card-summary {
    margin-top: 11px;
    color: var(--ink-soft);
    line-height: 1.68;
}

.tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 18px;
}

.tech-tag {
    padding: 7px 10px;
    border: 1px solid rgba(81,121,201,.16);
    border-radius: 999px;
    color: var(--blue);
    background: rgba(81,121,201,.07);
    font-size: 11px;
    font-weight: 700;
}

.project-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
    padding-top: 23px;
}

.project-card-actions .button {
    min-height: 42px;
    padding: 0 15px;
    font-size: 13px;
}

.project-text-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--blue);
    text-decoration: none;
    font-weight: 700;
}

.project-text-link:hover {
    text-decoration: underline;
}

.project-detail-shell {
    width: min(980px, calc(100% - 40px));
    margin: 38px auto 90px;
}

.project-back-link {
    margin-bottom: 24px;
}

.project-detail-card {
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: var(--radius-xl);
    background: rgba(255,255,255,.9);
    box-shadow: var(--shadow);
}

.project-detail-hero {
    min-height: 470px;
    position: relative;
    background:
        radial-gradient(circle at 85% 15%, rgba(117,197,207,.36), transparent 30%),
        radial-gradient(circle at 20% 90%, rgba(143,123,216,.35), transparent 36%),
        var(--navy);
}

.project-detail-hero img {
    width: 100%;
    height: 100%;
    min-height: 470px;
    display: block;
    object-fit: cover;
}

.project-detail-hero .project-placeholder {
    min-height: 470px;
}

.project-detail-content {
    padding: clamp(34px, 6vw, 70px);
}

.project-detail-content h1 {
    font-size: clamp(48px, 8vw, 86px);
    letter-spacing: -4px;
}

.project-detail-summary {
    max-width: 760px;
    margin-top: 22px;
    color: var(--ink-soft);
    font-size: clamp(17px, 2vw, 20px);
    line-height: 1.75;
}

.project-detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 28px;
}

.project-detail-copy {
    margin-top: 48px;
    padding-top: 42px;
    border-top: 1px solid var(--line);
}

.project-detail-copy h2 {
    margin-bottom: 22px;
}

.project-detail-copy p {
    max-width: 760px;
    margin-bottom: 20px;
    color: var(--ink-soft);
    font-size: 17px;
    line-height: 1.85;
}

.project-detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 24px;
    margin-top: 23px;
    color: var(--ink-soft);
    font-size: 13px;
}

.project-detail-meta strong {
    color: var(--ink);
}

.portfolio-loading {
    padding: 48px 24px;
    text-align: center;
    color: var(--ink-soft);
}

@media (max-width: 980px) {
    .portfolio-hero-grid,
    .featured-project {
        grid-template-columns: 1fr;
    }

    .project-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .featured-project-media {
        min-height: 330px;
    }
}

@media (max-width: 720px) {
    .portfolio-controls {
        grid-template-columns: 1fr;
    }

    .portfolio-filter-list {
        justify-content: flex-start;
    }

    .project-grid {
        grid-template-columns: 1fr;
    }

    .project-detail-shell {
        width: min(100% - 24px, 980px);
        margin-top: 20px;
    }

    .project-detail-hero,
    .project-detail-hero img,
    .project-detail-hero .project-placeholder {
        min-height: 320px;
    }
}

@media (max-width: 430px) {
    .portfolio-filter {
        min-height: 42px;
        padding: 0 12px;
        font-size: 13px;
    }

    .project-detail-actions,
    .project-card-actions {
        flex-direction: column;
    }

    .project-detail-actions .button,
    .project-card-actions .button {
        width: 100%;
    }
}

/* =====================================================
   PHASE 6 + 7 — YOUTUBE, CONTENT, ABOUT, ACCESSIBILITY
===================================================== */
.skip-link{position:fixed;top:10px;left:10px;z-index:9999;padding:11px 15px;border-radius:12px;color:white;background:var(--navy);transform:translateY(-150%);transition:transform .2s ease}.skip-link:focus{transform:translateY(0)}
.youtube-feature{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(320px,.85fr);overflow:hidden;border:1px solid var(--line);border-radius:var(--radius-xl);background:rgba(255,255,255,.9);box-shadow:var(--shadow)}
.youtube-feature-player{min-height:480px;background:var(--navy)}.youtube-feature-player iframe,.youtube-viewer-frame iframe{width:100%;height:100%;min-height:inherit;display:block;border:0}.youtube-feature-copy{padding:clamp(35px,6vw,66px);display:flex;flex-direction:column;justify-content:center}.youtube-feature-copy p{margin-top:18px;color:var(--ink-soft);font-size:17px;line-height:1.8}
.youtube-toolbar{display:grid;grid-template-columns:minmax(240px,1fr) auto;gap:16px;align-items:center;margin-bottom:24px}.youtube-api-status{color:var(--ink-soft);font-size:12px;text-align:right}.playlist-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.playlist-card{overflow:hidden;border:1px solid var(--line);border-radius:var(--radius-lg);background:rgba(255,255,255,.9);box-shadow:var(--shadow-soft);transition:transform .2s ease,border-color .2s ease}.playlist-card:hover{transform:translateY(-5px);border-color:var(--line-strong)}.playlist-card button{width:100%;padding:0;color:inherit;background:transparent;cursor:pointer;text-align:left}.playlist-thumb{width:100%;aspect-ratio:16/9;display:block;object-fit:cover;background:var(--navy)}.playlist-placeholder{aspect-ratio:16/9;display:grid;place-items:center;color:white;background:linear-gradient(135deg,var(--navy),var(--violet));font:700 46px/1 "Space Grotesk",sans-serif}.playlist-card-body{padding:23px}.playlist-card-body p{margin-top:10px;color:var(--ink-soft);line-height:1.65}.playlist-count{display:inline-flex;margin-top:15px;padding:6px 9px;border-radius:999px;color:var(--blue);background:rgba(81,121,201,.08);font-size:11px;font-weight:700}.youtube-viewer{margin-top:40px;overflow:hidden;border:1px solid var(--line);border-radius:var(--radius-xl);background:white;box-shadow:var(--shadow)}.youtube-viewer-frame{min-height:600px;background:var(--navy)}.youtube-viewer-copy{padding:28px clamp(25px,5vw,52px)}.youtube-viewer-copy p{margin-top:9px;color:var(--ink-soft);line-height:1.7}
.public-content-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.public-content-card{overflow:hidden;border:1px solid var(--line);border-radius:var(--radius-lg);background:rgba(255,255,255,.9);box-shadow:var(--shadow-soft)}.public-content-card img,.content-image-placeholder{width:100%;aspect-ratio:4/3;display:block;object-fit:cover}.content-image-placeholder{display:grid;place-items:center;color:white;background:linear-gradient(135deg,var(--navy),var(--violet),var(--aqua));font:700 48px/1 "Space Grotesk",sans-serif}.public-content-card-body{padding:25px}.public-content-card-body p{margin-top:11px;color:var(--ink-soft);line-height:1.7}
.about-grid{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);gap:clamp(35px,7vw,90px);align-items:center}.about-visual{min-height:520px;padding:35px;display:grid;place-items:center;border-radius:var(--radius-xl);background:linear-gradient(135deg,var(--navy),var(--violet),var(--aqua));box-shadow:var(--shadow)}.about-visual-mark{width:min(330px,80%);aspect-ratio:1/1;display:grid;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:34% 66% 60% 40%/42% 38% 62% 58%;color:white;background:rgba(255,255,255,.07);backdrop-filter:blur(20px);font:700 clamp(55px,9vw,110px)/1 "Space Grotesk",sans-serif}.about-copy p{margin-top:20px;color:var(--ink-soft);font-size:17px;line-height:1.85}.about-fact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:32px}.about-fact{padding:19px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.75)}.about-fact strong,.about-fact small{display:block}.about-fact small{margin-top:6px;color:var(--ink-soft)}
.admin-upload-box{padding:14px;border:1px dashed var(--line-strong);border-radius:14px;background:rgba(81,121,201,.045)}.admin-upload-box input[type=file]{width:100%;min-height:auto;padding:8px 0;border:0;background:transparent}.admin-upload-row{display:flex;gap:8px;align-items:center;margin-top:8px}.admin-upload-row .button{min-height:38px;padding:0 13px;font-size:12px}.admin-upload-progress{color:var(--ink-soft);font-size:12px}.seo-tool{padding:22px;border:1px solid var(--line);border-radius:var(--radius-lg);background:rgba(255,255,255,.88);box-shadow:var(--shadow-soft)}.seo-tool textarea{width:100%;min-height:260px;padding:15px;border:1px solid var(--line);border-radius:14px;background:var(--paper);color:var(--ink);font-family:Consolas,monospace;resize:vertical}
@media(max-width:1000px){.youtube-feature,.about-grid{grid-template-columns:1fr}.playlist-grid,.public-content-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.youtube-feature-player{min-height:420px}}
@media(max-width:700px){.youtube-toolbar{grid-template-columns:1fr}.youtube-api-status{text-align:left}.playlist-grid,.public-content-grid,.about-fact-grid{grid-template-columns:1fr}.youtube-feature-player,.youtube-viewer-frame{min-height:300px}.about-visual{min-height:340px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
