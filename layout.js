(function () {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.nav-hamburger');
    const closeBtn = document.getElementById('mobileMenuClose');

    if (!mobileMenu) return;

    function openMenu() {
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => mobileMenu.classList.add('open'));
        document.body.style.overflow = 'hidden';
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Close menu');
        }
        mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        mobileMenu.addEventListener('transitionend', () => {
            mobileMenu.style.display = 'none';
        }, { once: true });
        document.body.style.overflow = '';
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
        }
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) closeMenu();
            else openMenu();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    mobileMenu.addEventListener('click', e => {
        if (e.target === mobileMenu) closeMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });
})();
