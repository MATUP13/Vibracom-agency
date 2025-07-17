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

function cleanupOnExit() {
    // À implémenter si nécessaire pour le nettoyage
}

// Chargement hero image
function initHero() {
    const heroLoader = function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('loaded');
            window.removeEventListener('load', heroLoader);
        }
    };
    window.addEventListener('load', heroLoader);
}

// Menu mobile - Version corrigée
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav ul');
    
    if (!menuToggle || !nav) return;

    const toggleMenu = function() {
        const isActive = nav.classList.toggle('active');
        menuToggle.classList.toggle('active', isActive);
        menuToggle.setAttribute('aria-expanded', isActive);
    };

    // Gestion du clic
    menuToggle.addEventListener('click', toggleMenu);

    // Fermeture au clic sur lien
    const navLinks = document.querySelectorAll('.nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fermeture en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Animation des statistiques (optimisée)
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.count) || 0;
                    const duration = 2000;
                    let start = null;

                    const animate = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        stat.textContent = Math.floor(percentage * target);
                        
                        if (percentage < 1) {
                            window.requestAnimationFrame(animate);
                        }
                    };
                    
                    window.requestAnimationFrame(animate);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Smooth scroll amélioré
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    if (links.length === 0) return;

    links.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const header = document.querySelector('.header');
                const offset = header ? header.offsetHeight : 80;
                
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });

                // Fermer le menu si mobile
                const menuToggle = document.querySelector('.menu-toggle');
                if (menuToggle && menuToggle.classList.contains('active')) {
                    menuToggle.click();
                }
            }
        });
    });
}

// Sticky header (inchangé mais validé)
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const scrollHandler = function() {
        header.classList.toggle('sticky', window.scrollY > 100);
    };
    window.addEventListener('scroll', scrollHandler);
}

// Slider témoignages (optimisé)
function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length < 2) return;

    let current = 0;
    let interval;
    
    const showTestimonial = (index) => {
        testimonials.forEach((t, i) => {
            t.style.opacity = i === index ? '1' : '0';
            t.style.pointerEvents = i === index ? 'auto' : 'none';
        });
    };

    const startSlider = () => {
        interval = setInterval(() => {
            current = (current + 1) % testimonials.length;
            showTestimonial(current);
        }, 5000);
    };

    showTestimonial(0);
    startSlider();

    // Pause au survol
    testimonials.forEach(t => {
        t.addEventListener('mouseenter', () => clearInterval(interval));
        t.addEventListener('mouseleave', startSlider);
    });
}

// Animations au scroll (optimisées)
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
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}
