(function () {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.nav-hamburger');
    const closeBtn = document.getElementById('mobileMenuClose');

    if (!mobileMenu) return;

    let isOpen = false;
    let isClosing = false;
    let hideTimer = 0;

    function finishHide() {
        if (isOpen) return;
        mobileMenu.removeEventListener('transitionend', onOverlayTransitionEnd);
        mobileMenu.style.display = 'none';
        isClosing = false;
    }

    function onOverlayTransitionEnd(event) {
        if (event.target !== mobileMenu || event.propertyName !== 'opacity') return;
        window.clearTimeout(hideTimer);
        finishHide();
    }

    function openMenu() {
        if (isOpen) return;
        window.clearTimeout(hideTimer);
        mobileMenu.removeEventListener('transitionend', onOverlayTransitionEnd);
        isClosing = false;
        isOpen = true;
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => mobileMenu.classList.add('open'));
        document.body.style.overflow = 'hidden';
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Close menu');
        }
        mobileMenu.setAttribute('aria-hidden', 'false');
        if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
        if (!isOpen || isClosing) return;
        isOpen = false;
        isClosing = true;
        mobileMenu.classList.remove('open');
        mobileMenu.addEventListener('transitionend', onOverlayTransitionEnd);
        hideTimer = window.setTimeout(finishHide, 400);
        document.body.style.overflow = '';
        if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
            hamburger.focus();
        }
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (isOpen) closeMenu();
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
        if (e.key === 'Escape' && isOpen) closeMenu();
    });
})();

(function () {
    const frames = document.querySelectorAll('[data-hero-scale]');
    if (!frames.length) return;

    function applyScale(frame) {
        const designWidth = Number(frame.getAttribute('data-hero-scale'));
        if (!designWidth) return;
        const width = frame.clientWidth;
        if (width > 0) {
            frame.style.setProperty('--hero-scale', String(width / designWidth));
        }
    }

    function applyAll() {
        frames.forEach(applyScale);
    }

    applyAll();
    requestAnimationFrame(applyAll);

    frames.forEach((frame) => {
        if (typeof ResizeObserver === 'function') {
            new ResizeObserver(() => applyScale(frame)).observe(frame);
        }
    });

    window.addEventListener('resize', applyAll, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', applyAll, { passive: true });
    }
})();
