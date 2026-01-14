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
