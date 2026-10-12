// Rebuild the public legal pages from legal/*.md.
// Run from the landing repo:
//   node scripts/render-legal.mjs
//
// marked is already installed for the product app. This imports that copy
// so the landing site does not need its own dependency.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const markedUrl = pathToFileURL(
    join(root, "../camplify/frontend/node_modules/marked/lib/marked.esm.js"),
).href;
const { marked } = await import(markedUrl);

const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const cssVersion = indexHtml.match(/main\.css\?v=(\d+)/)?.[1];
const layoutVersion = indexHtml.match(/layout\.js\?v=(\d+)/)?.[1];
if (!cssVersion || !layoutVersion) {
    throw new Error("Could not read main.css or layout.js versions from index.html");
}

const MONTHS = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
};

function legalVersion(markdown, source) {
    const match = markdown.match(/\*\*Last updated:\*\*\s+([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
    if (!match) throw new Error(`${source} is missing a Last updated date`);
    const month = MONTHS[match[1].toLowerCase()];
    if (!month) throw new Error(`${source} has an unrecognized month in Last updated`);
    return `${match[3]}-${month}-${String(match[2]).padStart(2, "0")}`;
}

const documents = [
    {
        source: "legal/privacy-policy.md",
        out: "privacy-policy/index.html",
        title: "Privacy Policy",
        description: "How Camplicity collects, uses, and protects camp information.",
        path: "/privacy-policy/",
    },
    {
        source: "legal/website-terms-of-use.md",
        out: "terms-of-use/index.html",
        title: "Website Terms of Use",
        description: "The terms that govern use of the Camplicity website.",
        path: "/terms-of-use/",
    },
    {
        source: "legal/saas-terms.md",
        out: "saas-terms/index.html",
        title: "SaaS Terms",
        description: "The terms that govern use of the Camplicity software.",
        path: "/saas-terms/",
    },
    {
        source: "legal/data-processing-addendum.md",
        out: "dpa/index.html",
        title: "Data Processing Addendum",
        description: "How Camplicity processes customer data on behalf of camps.",
        path: "/dpa/",
    },
];

function page(doc, body) {
    const canonical = `https://camplicity.app${doc.path}`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${doc.title} - Camplicity</title>
    <meta name="description" content="${doc.description}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="legal-version" content="${doc.version}" />
    <meta name="author" content="Camplicity LLC" />
    <meta name="theme-color" content="#38b6ff" />
    <meta property="og:title" content="${doc.title} - Camplicity" />
    <meta property="og:description" content="${doc.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/main.css?v=${cssVersion}" />
    <link rel="icon" href="/media/camplicity-icon-48x48.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" sizes="180x180" href="/media/apple-touch-icon.png" />
    <script src="/layout.js?v=${layoutVersion}" defer></script>
</head>
<body>
    <!-- Generated from ${doc.source}. Edit that file, then run scripts/render-legal.mjs. -->
    <nav class="nav">
    <div class="nav-left">
        <div class="logo">
            <a href="https://camplicity.app">
                <img src="/media/camplicity-logo-500x200.svg" alt="Camplicity" class="logo-image" />
            </a>
        </div>
        <div class="nav-links">
            <a href="/#features">Features</a>
            <a href="/#about">About</a>
            <a href="/#faq">FAQs</a>
        </div>
    </div>
    <div class="nav-right">
        <a href="https://app.camplicity.app/" class="nav-btn-secondary nav-btn-desktop-only">Login</a>
        <a href="/#contact" class="nav-btn-primary nav-btn-desktop-only">Let's Start</a>
        <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
        </button>
    </div>
</nav>

    <main class="legal-main">
        <article class="legal-doc">
${body}
        </article>
    </main>

    <footer class="footer">
    <div class="footer-main">
        <div class="footer-brand">
            <a href="https://camplicity.app">
                <img src="/media/camplicity-logo-500x200.svg" alt="Camplicity" class="footer-logo">
            </a>
            <p class="footer-tagline">Making summer camp management simple</p>
        </div>
        <div class="footer-nav">
            <div class="footer-col">
                <h4 class="footer-col-heading">Product</h4>
                <a href="/#features" class="footer-link">Features</a>
                <a href="/#about" class="footer-link">About</a>
                <a href="/#contact-us" class="footer-link">Contact</a>
            </div>
            <div class="footer-col">
                <h4 class="footer-col-heading">Legal</h4>
                <a href="/privacy-policy/" class="footer-link">Privacy Policy</a>
                <a href="/terms-of-use/" class="footer-link">Website Terms</a>
                <a href="/saas-terms/" class="footer-link">SaaS Terms</a>
                <a href="/dpa/" class="footer-link">DPA</a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 Camplicity LLC. All rights reserved.</p>
    </div>
</footer>

<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <div class="mobile-menu-card">
        <div class="mobile-menu-header">
            <a href="https://camplicity.app">
                <img src="/media/camplicity-logo-500x200.svg" alt="Camplicity" class="logo-image" />
            </a>
            <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <nav class="mobile-menu-links">
            <a href="/#features" class="mobile-menu-link">Features</a>
            <a href="/#about" class="mobile-menu-link">About</a>
            <a href="/#faq" class="mobile-menu-link">FAQs</a>
        </nav>
        <div class="mobile-menu-ctas">
            <a href="/#contact" class="mobile-cta-primary">Let's Start &rsaquo;</a>
            <a href="https://app.camplicity.app/" class="mobile-cta-secondary">Login</a>
        </div>
    </div>
</div>
</body>
</html>
`;
}

for (const doc of documents) {
    const markdown = readFileSync(join(root, doc.source), "utf8");
    doc.version = legalVersion(markdown, doc.source);
    const body = marked.parse(markdown, { async: false, breaks: true }).trim().replace(/^/gm, "            ");
    writeFileSync(join(root, doc.out), page(doc, body));
    console.log(`${doc.source} -> ${doc.out}`);
}
