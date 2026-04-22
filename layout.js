(function () {
    // Detect if we are on the home page so anchor links work without a page reload
    const path = window.location.pathname;
    const isHome = !path.match(/(privacy-policy|terms-of-use)/);
    const home = isHome ? '' : './index.html';

    const NAV_HTML = `
<nav class="nav">
    <div class="nav-left">
        <div class="logo">
            <a href="https://camplify.app">
                <img
                  src="./media/camplify-logo-500x200.svg"
                  alt="Camplify"
                  class="logo-image"
                />
            </a>
        </div>
        <div class="nav-links">
            <a href="${home}#features">Features</a>
            <a href="${home}#about">About</a>
            <a href="${home}#faq">FAQs</a>
        </div>
    </div>
    <div class="nav-right">
        <a href="https://app.camplify.app/" class="nav-btn-secondary nav-btn-desktop-only">Login</a>
        <a href="https://cal.com/camplify/30min" class="nav-btn-primary nav-btn-desktop-only">Schedule a Demo</a>
        <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
        </button>
    </div>
</nav>`;

    const MOBILE_MENU_HTML = `
<div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    <div class="mobile-menu-card">
        <div class="mobile-menu-header">
            <a href="https://camplify.app">
                <img src="./media/camplify-logo-500x200.svg" alt="Camplify" class="logo-image" />
            </a>
            <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <nav class="mobile-menu-links">
            <a href="${home}#features" class="mobile-menu-link">Features</a>
            <a href="${home}#about" class="mobile-menu-link">About</a>
            <a href="${home}#faq" class="mobile-menu-link">FAQs</a>
        </nav>
        <div class="mobile-menu-ctas">
            <a href="https://cal.com/camplify/30min" class="mobile-cta-primary">Schedule a Demo &rsaquo;</a>
            <a href="https://app.camplify.app/" class="mobile-cta-secondary">Login</a>
        </div>
    </div>
</div>`;

    const FOOTER_HTML = `
<footer class="footer">
    <div class="footer-main">
        <div class="footer-brand">
            <a href="https://camplify.app">
                <img src="./media/camplify-logo-500x200.svg" alt="Camplify" class="footer-logo">
            </a>
            <p class="footer-tagline">Making summer camp management<br>simple, natural, and joyful.</p>
        </div>
        <div class="footer-nav">
            <div class="footer-col">
                <h4 class="footer-col-heading">Product</h4>
                <a href="${home}#features" class="footer-link">Features</a>
                <a href="${home}#about" class="footer-link">About</a>
                <a href="${home}#contact" class="footer-link">Contact</a>
            </div>
            <div class="footer-col">
                <h4 class="footer-col-heading">Legal</h4>
                <a href="./privacy-policy.html" class="footer-link">Privacy Policy</a>
                <a href="./terms-of-use.html" class="footer-link">Terms of Use</a>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 Camplify LLC. All rights reserved.</p>
    </div>
</footer>`;

    // Inject nav
    const navRoot = document.getElementById('nav-root');
    if (navRoot) navRoot.outerHTML = NAV_HTML;

    // Inject mobile menu overlay into body
    document.body.insertAdjacentHTML('beforeend', MOBILE_MENU_HTML);

    // Inject footer
    const footerRoot = document.getElementById('footer-root');
    if (footerRoot) footerRoot.outerHTML = FOOTER_HTML;

    // ── Mobile menu logic ──────────────────────────────────────────────
    const mobileMenu   = document.getElementById('mobileMenu');
    const hamburger    = document.querySelector('.nav-hamburger');
    const closeBtn     = document.getElementById('mobileMenuClose');

    function openMenu() {
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => mobileMenu.classList.add('open'));
        document.body.style.overflow = 'hidden';
        hamburger && (hamburger.setAttribute('aria-expanded', 'true'));
        mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        mobileMenu.addEventListener('transitionend', () => {
            mobileMenu.style.display = 'none';
        }, { once: true });
        document.body.style.overflow = '';
        hamburger && (hamburger.setAttribute('aria-expanded', 'false'));
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    hamburger  && hamburger.addEventListener('click', openMenu);
    closeBtn   && closeBtn.addEventListener('click', closeMenu);

    // Close on backdrop click (outside the card)
    mobileMenu && mobileMenu.addEventListener('click', e => {
        if (e.target === mobileMenu) closeMenu();
    });

    // Close when any link inside the menu is tapped
    mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });
})();
