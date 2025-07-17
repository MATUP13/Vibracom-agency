// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des composants
    initHero();
    initMobileMenu();
    initStatsAnimation();
    initSmoothScroll();
    initStickyHeader();
    initTestimonials();
    initScrollAnimations();
});

// Chargement hero image
function initHero() {
    window.addEventListener('load', function() {
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('loaded');
    });
}

// Menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) icon.classList.toggle('fa-times');
        });

        // Fermer le menu en cliquant sur un lien
        const navLinks = document.querySelectorAll('.nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.classList.remove('fa-times');
            });
        });
    }
}

// Animation des statistiques
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');
    
    if (statNumbers.length > 0 && statsSection) {
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count')) || 0;
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateNumber = () => {
                    current += step;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.textContent = target;
                    }
                };
                
                updateNumber();
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
}

// Smooth scroll pour les ancres
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Effet sticky pour le header
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('sticky', window.scrollY > 100);
        });
    }
}

// Slider témoignages
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;

    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    if (testimonials.length > 1) {
        showTestimonial(0);
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    } else {
        showTestimonial(0);
    }
}

// Animation au défilement
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item');
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
}
