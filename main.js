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
// Hero slogan: rotating promise
// ========================================
const heroRotatingWords = ['Full clarity.', 'Total control.', 'One schedule.', 'Every detail.'];
const heroWordEl = document.getElementById('hero-rotating-word');
let heroWordIndex = 0;

if (heroWordEl && !prefersReducedMotion) {
    setInterval(() => {
        heroWordEl.classList.add('hero-rotating-word--out');
        setTimeout(() => {
            heroWordIndex = (heroWordIndex + 1) % heroRotatingWords.length;
            heroWordEl.textContent = heroRotatingWords[heroWordIndex];
            heroWordEl.classList.remove('hero-rotating-word--out');
        }, 400);
    }, 2800);
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

const contactFormEl = document.getElementById('contactForm');
const requestTypeInput = document.getElementById('requestType');
const formSubjectInput = document.getElementById('formSubject');
const campNameInput = document.getElementById('campName');
const messageField = document.getElementById('messageField');
const messageInput = document.getElementById('message');
const termsField = document.getElementById('termsField');
const termsInput = document.getElementById('agreeTerms');
const formSubmit = document.getElementById('formSubmit');
const formSuccessTitle = document.getElementById('formSuccessTitle');
const formSuccessText = document.getElementById('formSuccessText');
const contactSuccess = document.getElementById('contactSuccess');

function setRequestType(type) {
    const isTrial = type === 'trial';
    const requestTypeGroup = document.querySelector('.request-type');
    if (requestTypeGroup) requestTypeGroup.classList.toggle('is-contact', !isTrial);

    if (messageField) {
        messageField.classList.toggle('is-open', !isTrial);
        messageField.setAttribute('aria-hidden', isTrial ? 'true' : 'false');
    }
    if (termsField) {
        termsField.classList.toggle('is-open', isTrial);
        termsField.setAttribute('aria-hidden', isTrial ? 'false' : 'true');
    }

    if (messageInput) {
        messageInput.disabled = isTrial;
    }
    if (termsInput) {
        termsInput.disabled = !isTrial;
        termsInput.required = isTrial;
    }
    if (campNameInput) {
        campNameInput.name = isTrial ? 'camp_name' : 'campName';
    }
    if (requestTypeInput) {
        requestTypeInput.value = isTrial ? '14-day trial' : 'contact';
    }
    if (formSubjectInput) {
        formSubjectInput.value = isTrial ? '14-day trial request' : 'New message from the website';
    }
    if (formSubmit && !formSubmit.disabled) {
        formSubmit.textContent = isTrial ? 'Request my free trial' : 'Send message';
    }
    if (contactSuccess) {
        contactSuccess.dataset.persist = isTrial ? 'true' : 'false';
    }
    if (formSuccessTitle && formSuccessText) {
        formSuccessTitle.textContent = isTrial ? 'Thanks!' : 'Thank you for your interest!';
        formSuccessText.textContent = isTrial
            ? "We'll take a quick look at your request and email you a link to start your trial within 24 hours."
            : "We'll review your message and email you within 24 hours.";
    }
    syncTrialSubmitLock();
}

function syncTrialSubmitLock() {
    if (!formSubmit || !contactFormEl) return;
    const selected = contactFormEl.querySelector('input[name="type"]:checked');
    const isTrial = !selected || selected.value === 'trial';
    const locked = isTrial && !(termsInput && termsInput.checked);
    formSubmit.classList.toggle('is-locked', locked);
    formSubmit.setAttribute('aria-disabled', locked ? 'true' : 'false');
    if (!locked) {
        formSubmit.closest('.submit-wrap')?.classList.remove('is-hint');
    }
}

if (contactFormEl) {
    contactFormEl.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) setRequestType(radio.value);
        });
    });
    const contactFromHash = location.hash === '#contact-us';
    if (contactFromHash) {
        const contactRadio = contactFormEl.querySelector('input[name="type"][value="contact"]');
        if (contactRadio) contactRadio.checked = true;
    }
    const selectedType = contactFormEl.querySelector('input[name="type"]:checked');
    if (selectedType) setRequestType(selectedType.value);

    window.addEventListener('hashchange', () => {
        if (location.hash !== '#contact-us') return;
        const contactRadio = contactFormEl.querySelector('input[name="type"][value="contact"]');
        if (!contactRadio) return;
        contactRadio.checked = true;
        setRequestType('contact');
    });

    contactFormEl.addEventListener('reset', () => {
        setTimeout(() => {
            const selected = contactFormEl.querySelector('input[name="type"]:checked');
            if (selected) setRequestType(selected.value);
        }, 0);
    });

    if (termsInput) {
        termsInput.addEventListener('change', syncTrialSubmitLock);
    }
    if (formSubmit) {
        formSubmit.addEventListener('click', (event) => {
            if (!formSubmit.classList.contains('is-locked')) return;
            event.preventDefault();
            formSubmit.closest('.submit-wrap')?.classList.add('is-hint');
        });
    }
}

const TERMS_MONTHS = {
    january: '01', february: '02', march: '03', april: '04',
    may: '05', june: '06', july: '07', august: '08',
    september: '09', october: '10', november: '11', december: '12'
};

async function versionOpenedAt(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return '';
    const html = await response.text();
    const meta = html.match(/<meta\s+name="legal-version"\s+content="(\d{4}-\d{2}-\d{2})"\s*\/?>/i);
    const visible = html.match(/Last updated:<\/strong>\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/i);
    if (!meta || !visible) return '';
    const month = TERMS_MONTHS[visible[1].toLowerCase()];
    if (!month) return '';
    const fromPage = `${visible[3]}-${month}-${String(visible[2]).padStart(2, '0')}`;
    return fromPage === meta[1] ? fromPage : '';
}

document.querySelectorAll('#contactForm').forEach(contactForm => {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (this.dataset.submitting === 'true') return;

        const formData = new FormData(this);
        const requestType = String(formData.get('request_type') || '');
        const campName = String(formData.get('camp_name') || formData.get('campName') || '').trim();
        const isTrial = requestType === '14-day trial';
        if (isTrial) {
            const termsBox = this.querySelector('#agreeTerms');
            if (termsBox) {
                termsBox.disabled = false;
                termsBox.required = true;
            }
            if (!termsBox || !termsBox.checked || !this.checkValidity()) {
                this.reportValidity();
                return;
            }
        } else if (!this.checkValidity()) {
            this.reportValidity();
            return;
        }

        this.dataset.submitting = 'true';
        const submitButton = this.querySelector('[type="submit"]');
        const submitLabel = submitButton ? submitButton.textContent : '';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending…';
        }
        const restoreButton = () => {
            this.dataset.submitting = '';
            if (!submitButton) return;
            submitButton.disabled = false;
            submitButton.textContent = submitLabel;
        };

        if (isTrial) {
            const termsLink = this.querySelector('a[href="/saas-terms/"]');
            const saasTermsVersion = termsLink ? await versionOpenedAt(termsLink.href) : '';
            if (!saasTermsVersion || !termsLink) {
                restoreButton();
                alert('Could not read the SaaS Terms version. Open the SaaS Terms link and try again.');
                return;
            }
            formData.set('_subject', campName ? `14-day trial request — ${campName}` : '14-day trial request');
            formData.set('saas_terms_version', saasTermsVersion);
            formData.set('saas_terms_url', termsLink.href);
            formData.set('message', [
                'FREE TRIAL REQUEST',
                `Agreed to the Camplicity SaaS Terms, version ${saasTermsVersion}.`,
                termsLink.href,
            ].join('\n'));
        } else if (campName) {
            formData.set('_subject', `Contact — ${campName}`);
        }

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

            const successMsg = document.getElementById(this.dataset.success);
            if (successMsg) {
                successMsg.classList.add('show');
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (successMsg.dataset.persist === 'true') {
                    this.hidden = true;
                    return;
                }
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
            }

            this.reset();
            restoreButton();
        }).catch(error => {
            restoreButton();
            alert('Failed to send message. Please try again.');
            console.error(error);
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        if (href === '#contact-us' && contactFormEl) {
            const contactRadio = contactFormEl.querySelector('input[name="type"][value="contact"]');
            if (contactRadio) {
                contactRadio.checked = true;
                setRequestType('contact');
            }
        }
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
// Sticky Feature Scroll (desktop) / stacked reveal (mobile)
// ========================================
const stickySection = document.querySelector('.sticky-scroll-section');
if (stickySection) {
    const textItems = stickySection.querySelectorAll('.sticky-text-item');
    const imageItems = stickySection.querySelectorAll('.sticky-image-item');
    const progressEl = stickySection.querySelector('.sticky-progress');
    const stepCount = stickySection.querySelector('.sticky-step-count');
    const count = textItems.length;
    const desktopStickyMq = window.matchMedia('(min-width: 769px)');
    let currentIndex = 0;

    function setActive(index) {
        if (index === currentIndex) return;
        currentIndex = index;
        textItems.forEach((el, i) => el.classList.toggle('active', i === index));
        imageItems.forEach((el, i) => el.classList.toggle('active', i === index));
        if (stepCount) stepCount.textContent = `${index + 1} of ${count}`;
        if (progressEl) progressEl.classList.toggle('is-done', index === count - 1);
        placeCue();
    }

    function placeCue() {
        if (!progressEl || !desktopStickyMq.matches) return;
        const paragraph = stickySection.querySelector('.sticky-text-item.active p');
        const parent = progressEl.offsetParent;
        if (!paragraph || !parent) return;
        const top = paragraph.getBoundingClientRect().bottom - parent.getBoundingClientRect().top + 28;
        progressEl.style.top = `${Math.round(top)}px`;
    }

    function onStickyScroll() {
        if (!desktopStickyMq.matches) return;
        const rect = stickySection.getBoundingClientRect();
        const scrolled = -rect.top;
        const scrollable = stickySection.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.max(0, Math.min(1, scrolled / scrollable));
        const index = Math.min(Math.floor(progress * count), count - 1);
        setActive(index);
    }

    const mobileReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-inview');
            mobileReveal.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    function syncFeatureLayout() {
        const featureNodes = [...textItems, ...imageItems];
        featureNodes.forEach(el => mobileReveal.unobserve(el));

        if (desktopStickyMq.matches) {
            featureNodes.forEach(el => el.classList.remove('is-inview'));
            onStickyScroll();
            return;
        }

        if (prefersReducedMotion) {
            featureNodes.forEach(el => el.classList.add('is-inview'));
            return;
        }

        featureNodes.forEach(el => {
            el.classList.remove('is-inview');
            mobileReveal.observe(el);
        });
    }

    window.addEventListener('scroll', onStickyScroll, { passive: true });
    window.addEventListener('resize', placeCue);
    desktopStickyMq.addEventListener('change', syncFeatureLayout);
    syncFeatureLayout();
    placeCue();
    if (document.fonts) document.fonts.ready.then(placeCue);
}
