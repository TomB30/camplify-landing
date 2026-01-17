// ========================================
// Hero Slideshow
// ========================================
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
}

// Change slide every 15 seconds
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
      successMsg.style.display = "block";

      this.reset();
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        successMsg.style.display = "none";
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
