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
