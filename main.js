// ========================================
// Hero Slideshow with Lazy Loading
// ========================================
const heroSlides = document.querySelectorAll('.hero-slide');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentSlide = 0;

function loadSlideBackground(slide) {
    const bgSrc = slide.getAttribute('data-bg-src');
    if (bgSrc && !slide.getAttribute('data-bg-loaded')) {
        const img = new Image();
        img.onload = () => {
            slide.style.backgroundImage = `url('${bgSrc}')`;
            slide.setAttribute('data-bg-loaded', 'true');
        };
        img.src = bgSrc;
    }
}

function preloadNextSlide() {
    if (!heroSlides.length) return;
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    loadSlideBackground(heroSlides[nextIndex]);
}

function nextSlide() {
    if (!heroSlides.length) return;
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
    preloadNextSlide();
}

preloadNextSlide();

if (!prefersReducedMotion && heroSlides.length > 1) {
    setInterval(nextSlide, 10000);
}

// ========================================
// Hero headline: rotating word
// ========================================
const heroRotatingWords = ['operations', 'schedule', 'activities', 'housing', 'management'];
const heroWordEl = document.getElementById('hero-rotating-word');
let heroWordIndex = 0;
const heroWordIntervalMs = 4200;
const heroWordFadeMs = 500;

if (heroWordEl && !prefersReducedMotion) {
    setInterval(() => {
        heroWordEl.classList.add('hero-rotating-word--out');
        setTimeout(() => {
            heroWordIndex = (heroWordIndex + 1) % heroRotatingWords.length;
            heroWordEl.textContent = heroRotatingWords[heroWordIndex];
            heroWordEl.classList.remove('hero-rotating-word--out');
        }, heroWordFadeMs);
    }, heroWordIntervalMs);
}

// ========================================
// Intersection Observer for Animations
// ========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

document.querySelectorAll('.about-text, .about-image, .contact-form').forEach(el => {
    observer.observe(el);
});

// KEEP integrations: no-op until the commented HTML in index.html is uncommented.
document.querySelectorAll('.features-integrations-copy, .integration-orbit').forEach(el => {
    observer.observe(el);
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        fetch(this.action || 'https://formspree.io/f/xlgggvna', {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.classList.add('show');
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
            }

            this.reset();
        }).catch(error => {
            alert('Failed to send message. Please try again.');
            console.error(error);
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========================================
// FAQ Accordion — smooth animation, one open at a time
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

function closeItem(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    answer.style.transition = 'none';
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.offsetHeight;
    answer.style.transition = '';
    answer.style.maxHeight = '0px';
    item.classList.remove('is-open');
    answer.addEventListener('transitionend', () => {
        item.removeAttribute('open');
    }, { once: true });
}

function openItem(item) {
    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    item.setAttribute('open', '');
    item.classList.add('is-open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.addEventListener('transitionend', () => {
        if (item.hasAttribute('open')) answer.style.maxHeight = 'none';
    }, { once: true });
}

faqItems.forEach(item => {
    const summary = item.querySelector('.faq-question');
    if (!summary) return;

    summary.addEventListener('click', e => {
        e.preventDefault();
        const isOpen = item.hasAttribute('open');

        faqItems.forEach(other => {
            if (other !== item && other.hasAttribute('open')) closeItem(other);
        });

        isOpen ? closeItem(item) : openItem(item);
    });
});

// ========================================
// Sticky Feature Scroll
// ========================================
const stickySection = document.querySelector('.sticky-scroll-section');
if (stickySection) {
    const textItems = stickySection.querySelectorAll('.sticky-text-item');
    const imageItems = stickySection.querySelectorAll('.sticky-image-item');
    const dots = stickySection.querySelectorAll('.sticky-dot');
    const count = textItems.length;
    let currentIndex = 0;

    function setActive(index) {
        if (index === currentIndex) return;
        currentIndex = index;
        textItems.forEach((el, i) => el.classList.toggle('active', i === index));
        imageItems.forEach((el, i) => el.classList.toggle('active', i === index));
        dots.forEach((el, i) => el.classList.toggle('active', i === index));
    }

    window.addEventListener('scroll', () => {
        const rect = stickySection.getBoundingClientRect();
        const scrolled = -rect.top;
        const scrollable = stickySection.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.max(0, Math.min(1, scrolled / scrollable));
        const index = Math.min(Math.floor(progress * count), count - 1);
        setActive(index);
    }, { passive: true });
}

// ========================================
// Mobile Feature Cards
// ========================================
function buildMobileFeatures() {
    const section = document.querySelector('.sticky-scroll-section');
    if (!section) return;

    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
        const mobileGrid = section.querySelector('.features-mobile');
        const container = section.querySelector('.sticky-scroll-container');
        if (mobileGrid) mobileGrid.remove();
        if (container) container.style.display = '';
        delete section.dataset.mobileDone;
        return;
    }

    if (section.dataset.mobileDone) return;
    section.dataset.mobileDone = 'true';

    const textItems = section.querySelectorAll('.sticky-text-item');
    const imageItems = section.querySelectorAll('.sticky-image-item');
    const container = section.querySelector('.sticky-scroll-container');

    const mobileGrid = document.createElement('div');
    mobileGrid.className = 'features-mobile';

    textItems.forEach((text, i) => {
        const card = document.createElement('div');
        card.className = 'feature-card-mobile';

        const imgWrap = document.createElement('div');
        imgWrap.className = 'feature-card-img';
        imgWrap.innerHTML = imageItems[i] ? imageItems[i].innerHTML : '';

        const textWrap = document.createElement('div');
        textWrap.className = 'feature-card-text';
        textWrap.innerHTML = text.innerHTML;

        card.appendChild(imgWrap);
        card.appendChild(textWrap);
        mobileGrid.appendChild(card);
    });

    if (container) container.style.display = 'none';
    section.appendChild(mobileGrid);

    const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                mobileObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    mobileGrid.querySelectorAll('.feature-card-mobile').forEach(card => mobileObserver.observe(card));
}

buildMobileFeatures();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildMobileFeatures, 200);
});
