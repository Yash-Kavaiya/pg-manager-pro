// ============================================
// CORPE.IO CLONE - JAVASCRIPT FUNCTIONALITY
// ============================================

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger icon
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active')
        ? 'rotate(45deg) translateY(8px)'
        : 'none';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active')
        ? 'rotate(-45deg) translateY(-8px)'
        : 'none';
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Observe testimonial cards
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ===== FORM VALIDATION (Visual only - no backend) =====
const ctaButtons = document.querySelectorAll('.btn-primary');

ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Only trigger for "Get Started" and "Start Your Business" buttons
        const buttonText = button.textContent.trim();
        if (buttonText === 'Get Started' || buttonText === 'Start Your Business') {
            e.preventDefault();

            // Create a simple modal-like alert
            const alertBox = document.createElement('div');
            alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
        color: white;
        padding: 2rem 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        text-align: center;
        animation: fadeInUp 0.3s ease-out;
      `;

            alertBox.innerHTML = `
        <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">🎉 Thank You!</h3>
        <p style="margin-bottom: 1rem;">This is a demo version of the CorpE website.</p>
        <button style="
          background: white;
          color: #6366f1;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        ">Close</button>
      `;

            document.body.appendChild(alertBox);

            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
      `;
            document.body.appendChild(backdrop);

            // Close functionality
            const closeBtn = alertBox.querySelector('button');
            const closeAlert = () => {
                alertBox.remove();
                backdrop.remove();
            };

            closeBtn.addEventListener('click', closeAlert);
            backdrop.addEventListener('click', closeAlert);
        }
    });
});

// Add fadeIn animation for backdrop
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);

// ===== CONSOLE MESSAGE =====
console.log('%c CorpE Clone Website ', 'background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('This is a demo clone of the CorpE.io website.');
console.log('Built with HTML, CSS, and JavaScript.');
