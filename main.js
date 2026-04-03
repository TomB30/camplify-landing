// ========================================
// Hero Slideshow with Lazy Loading
// ========================================
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

// Lazy load background images for slideshow
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

// Preload next slide when current slide is active
function preloadNextSlide() {
    const nextIndex = (currentSlide + 1) % heroSlides.length;
    loadSlideBackground(heroSlides[nextIndex]);
}

function nextSlide() {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
    preloadNextSlide();
}

// Preload next slide initially
preloadNextSlide();

// Change slide every 10 seconds
setInterval(nextSlide, 10000);

// ========================================
// Hero headline: rotating word (soft fade, slower)
// ========================================
const heroRotatingWords = ['operations', 'schedule', 'activities', 'housing', 'management'];
const heroWordEl = document.getElementById('hero-rotating-word');
let heroWordIndex = 0;
const heroWordIntervalMs = 4200;
const heroWordFadeMs = 500;

if (heroWordEl) {
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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-block').forEach(block => {
    observer.observe(block);
});

document.querySelectorAll('.about-text, .about-image, .contact-form').forEach(el => {
    observer.observe(el);
});

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch("https://formspree.io/f/xlgggvna", {
    method: "POST",
    body: formData,
    headers: {
      "Accept": "application/json"
    }
  }).then(response => {
    if (response.ok) {
      const successMsg = document.getElementById("successMessage");
      successMsg.classList.add("show");

      this.reset();
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        successMsg.classList.remove("show");
      }, 5000);
    } else {
      throw new Error("Form submission failed");
    }
  }).catch(error => {
    alert("Failed to send message. Please try again.");
    console.error(error);
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================================
// FAQ Accordion — smooth animation, one open at a time
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

function closeItem(item) {
    const answer = item.querySelector('.faq-answer');
    // Pin exact height (in case max-height is 'none'), disable transition momentarily
    answer.style.transition = 'none';
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.offsetHeight; // force reflow so the browser registers the pinned value
    // Now animate to 0
    answer.style.transition = '';
    answer.style.maxHeight = '0px';
    item.classList.remove('is-open');
    answer.addEventListener('transitionend', () => {
        item.removeAttribute('open');
    }, { once: true });
}

function openItem(item) {
    item.setAttribute('open', '');
    item.classList.add('is-open');
    const answer = item.querySelector('.faq-answer');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    // Once open, lift the fixed height so content can reflow freely
    answer.addEventListener('transitionend', () => {
        if (item.hasAttribute('open')) answer.style.maxHeight = 'none';
    }, { once: true });
}

faqItems.forEach(item => {
    const summary = item.querySelector('.faq-question');
    summary.addEventListener('click', e => {
        e.preventDefault();
        const isOpen = item.hasAttribute('open');

        // Close any other open item first
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

let lastScrollY = window.scrollY;
// window.addEventListener('scroll', () => {
//     const currentScrollY = window.scrollY;
    
//     document.querySelectorAll('.feature-card').forEach((card, index) => {
//         const speed = 0.05 + (index * 0.01);
//         const yPos = -(currentScrollY * speed);
//         card.style.transform = `translateY(${yPos}px)`;
//     });
    
//     lastScrollY = currentScrollY;
// });
