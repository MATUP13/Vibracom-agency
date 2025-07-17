// Constants.js (à créer)
const SELECTORS = {
    HERO: '.hero',
    MENU_TOGGLE: '.menu-toggle',
    NAV: '.nav ul',
    STATS: '.stats',
    HEADER: '.header',
    TESTIMONIALS: '.testimonial',
    ANIMATE_ELEMS: '.service-card, .portfolio-item'
};

// Main.js (version optimisée)
class App {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initHero();
            this.initMobileMenu();
            this.initStatsAnimation();
            this.initSmoothScroll();
            this.initStickyHeader();
            this.initTestimonials();
            this.initScrollAnimations();
        });
    }

    // 1. Hero Loader (optimisé)
    initHero() {
        const hero = document.querySelector(SELECTORS.HERO);
        if (!hero) return;

        const handleLoad = () => {
            hero.classList.add('loaded');
            window.removeEventListener('load', handleLoad);
        };

        if (document.readyState === 'complete') {
            hero.classList.add('loaded');
        } else {
            window.addEventListener('load', handleLoad);
        }
    }

    // 2. Menu Mobile (version robuste)
    initMobileMenu() {
        const menuToggle = document.querySelector(SELECTORS.MENU_TOGGLE);
        const nav = document.querySelector(SELECTORS.NAV);
        if (!menuToggle || !nav) return;

        const toggleMenu = (shouldClose = false) => {
            const isActive = shouldClose ? false : !nav.classList.contains('active');
            nav.classList.toggle('active', isActive);
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
        };

        // Événements
        menuToggle.addEventListener('click', () => toggleMenu());
        
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu(true);
            }
        });
    }

    // 3. Stats Animation (version précise)
    initStatsAnimation() {
        const statsSection = document.querySelector(SELECTORS.STATS);
        if (!statsSection) return;

        const animateValue = (el, target, duration) => {
            let start = null;
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);
                el.textContent = Math.floor(percentage * target);
                if (percentage < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.stat-number').forEach(stat => {
                        animateValue(stat, parseInt(stat.dataset.count) || 0, 2000);
                    });
                }
            });
        }, { threshold: 0.5 }).observe(statsSection);
    }

    // 4. Smooth Scroll (avec polyfill)
    initSmoothScroll() {
        if (!('scrollBehavior' in document.documentElement.style)) {
            import('smoothscroll-polyfill').then(module => module.polyfill());
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = document.querySelector(SELECTORS.HEADER)?.offsetHeight || 80;
                    window.scrollTo({
                        top: target.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 5. Sticky Header (optimisé)
    initStickyHeader() {
        const header = document.querySelector(SELECTORS.HEADER);
        if (!header) return;

        const handleScroll = () => {
            header.classList.toggle('sticky', window.scrollY > 100);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init state
    }

    // 6. Testimonials (avec pause tactile)
    initTestimonials() {
        const testimonials = document.querySelectorAll(SELECTORS.TESTIMONIALS);
        if (testimonials.length < 2) return;

        let current = 0;
        let interval;

        const showTestimonial = (index) => {
            testimonials.forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
        };

        const startSlider = () => {
            interval = setInterval(() => {
                current = (current + 1) % testimonials.length;
                showTestimonial(current);
            }, 5000);
        };

        // Gestion des événements
        const handleInteraction = () => {
            clearInterval(interval);
            setTimeout(startSlider, 10000); // Reprise après 10s
        };

        testimonials.forEach(t => {
            t.addEventListener('touchstart', handleInteraction);
            t.addEventListener('mouseenter', handleInteraction);
            t.addEventListener('mouseleave', startSlider);
        });

        showTestimonial(0);
        startSlider();
    }

    // 7. Scroll Animations (optimisé)
    initScrollAnimations() {
        const elements = document.querySelectorAll(SELECTORS.ANIMATE_ELEMS);
        if (!elements.length) return;

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // observer.unobserve(entry.target); // À activer si nécessaire
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }).observe(elements);
    }
}

// Initialisation
new App();
