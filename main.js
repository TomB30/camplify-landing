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

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

document.querySelectorAll('.about-text, .about-image, .contact-form').forEach(el => {
    observer.observe(el);
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        campName: document.getElementById('campName').value,
        message: document.getElementById('message').value
    };
    
    console.log('Form submitted:', formData);
    
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    document.getElementById('contactForm').reset();
    
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
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

// Mobile carousel functionality
function initFeaturesCarousel() {
    const featuresGrid = document.querySelector('.features-grid');
    const dotsContainer = document.querySelector('.carousel-dots');
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (!featuresGrid || !dotsContainer || featureCards.length === 0) return;
    
    // Create dots
    featureCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to feature ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => scrollToCard(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    // Scroll to specific card
    function scrollToCard(index) {
        const card = featureCards[index];
        if (card) {
            const containerWidth = featuresGrid.offsetWidth;
            const cardWidth = card.offsetWidth;
            const cardLeft = card.offsetLeft;
            const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
            
            featuresGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Update active dot on scroll
    function updateActiveDot() {
        const scrollLeft = featuresGrid.scrollLeft;
        const containerWidth = featuresGrid.offsetWidth;
        
        let activeIndex = 0;
        let minDistance = Infinity;
        
        featureCards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const viewCenter = scrollLeft + containerWidth / 2;
            const distance = Math.abs(cardCenter - viewCenter);
            
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    // Listen to scroll events with debounce
    let scrollTimeout;
    featuresGrid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveDot, 50);
    });
    
    // Initial update
    updateActiveDot();
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeaturesCarousel);
} else {
    initFeaturesCarousel();
}