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
        <a href="https://cal.com/camplify/30min" class="nav-btn-secondary">Schedule a Demo</a>
        <a href="#" class="nav-btn-primary">Login</a>
    </div>
</nav>`;

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
                <a href="${home}#contact" class="footer-link">Request a Demo</a>
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

    const navRoot = document.getElementById('nav-root');
    if (navRoot) navRoot.outerHTML = NAV_HTML;

    const footerRoot = document.getElementById('footer-root');
    if (footerRoot) footerRoot.outerHTML = FOOTER_HTML;
})();
