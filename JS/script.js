class VibracomApp {
    constructor() {
        this.selectors = {
            HERO: '.hero',
            MENU_TOGGLE: '.menu-toggle',
            NAV: '.nav',
            STATS: '.stats',
            STAT_NUMBERS: '.stat-number',
            HEADER: '.header',
            TESTIMONIALS: '.testimonial',
            ANIMATE_ELEMS: '.service-card, .portfolio-item, .about-feature',
            NAV_LINKS: '.nav a',
            FLOATING_CTA: '.floating-cta',
            LOADER: '.page-loader'
        };
        this.init();
    }

    init() {
        // Initialisation différée pour meilleures performances
        if (document.readyState === 'complete') {
            this.setupApp();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        }
    }

    setupApp() {
        this.initLoader();
        this.initHero();
        this.initMobileMenu();
        this.initStatsAnimation();
        this.initSmoothScroll();
        this.initStickyHeader();
        this.initTestimonials();
        this.initScrollAnimations();
        this.initFloatingCTA();
    }

    initLoader() {
        const loader = document.querySelector(this.selectors.LOADER);
        if (loader) {
            // Cache le loader après le chargement complet
            window.addEventListener('load', () => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            });
        }
    }

    initHero() {
        const hero = document.querySelector(this.selectors.HERO);
        if (hero) hero.classList.add('loaded');
    }

    initMobileMenu() {
        const toggle = document.querySelector(this.selectors.MENU_TOGGLE);
        const nav = document.querySelector(this.selectors.NAV);
        if (!toggle || !nav) return;

        const toggleMenu = (state) => {
            const isActive = typeof state === 'boolean' ? state : !nav.classList.contains('active');
            
            nav.classList.toggle('active', isActive);
            toggle.classList.toggle('active', isActive);
            toggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Animation des icônes
            const menuIcon = toggle.querySelector('.menu-icon');
            const closeIcon = toggle.querySelector('.close-icon');
            if (menuIcon && closeIcon) {
                menuIcon.style.display = isActive ? 'none' : 'block';
                closeIcon.style.display = isActive ? 'block' : 'none';
            }
        };

        // Gestion des événements
        toggle.addEventListener('click', () => toggleMenu());
        
        document.querySelectorAll(this.selectors.NAV_LINKS).forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Fermeture en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Fermeture avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    initStatsAnimation() {
        const statsSection = document.querySelector(this.selectors.STATS);
        if (!statsSection) return;

        const animateValue = (el, target, duration) => {
            const start = performance.now();
            const initial = parseInt(el.textContent) || 0;
            
            const step = (timestamp) => {
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);
                const current = Math.floor(initial + (target - initial) * percentage);
                
                el.textContent = current.toLocaleString();
                
                if (percentage < 1) {
                    requestAnimationFrame(step);
                }
            };
            
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll(this.selectors.STAT_NUMBERS)
                        .forEach(el => animateValue(el, parseInt(el.dataset.count) || 0, 1500));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    initSmoothScroll() {
        // Polyfill conditionnel
        if (!('scrollBehavior' in document.documentElement.style)) {
            import('smoothscroll-polyfill').then(m => m.polyfill());
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (!target) return;
                
                e.preventDefault();
                
                const header = document.querySelector(this.selectors.HEADER);
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Mise à jour de l'URL sans rechargement
                history.pushState(null, null, targetId);
            });
        });
    }

    initStickyHeader() {
        const header = document.querySelector(this.selectors.HEADER);
        if (!header) return;

        const handler = () => {
            const scrollY = window.scrollY;
            header.classList.toggle('sticky', scrollY > 100);
            header.style.transition = scrollY > 100 ? 'all 0.3s ease' : 'none';
        };

        // Utilisation de requestAnimationFrame pour de meilleures performances
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handler();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initialisation
        handler();
    }

    initTestimonials() {
        const testimonials = document.querySelectorAll(this.selectors.TESTIMONIALS);
        if (testimonials.length < 2) return;

        let currentIndex = 0;
        let intervalId;
        const transitionDuration = 5000;

        const showTestimonial = (index) => {
            testimonials.forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
        };

        const nextTestimonial = () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        };

        const startSlider = () => {
            clearInterval(intervalId);
            intervalId = setInterval(nextTestimonial, transitionDuration);
        };

        const pauseSlider = () => {
            clearInterval(intervalId);
        };

        // Contrôles interactifs
        testimonials.forEach(t => {
            t.addEventListener('mouseenter', pauseSlider);
            t.addEventListener('mouseleave', startSlider);
            t.addEventListener('touchstart', pauseSlider);
            t.addEventListener('touchend', startSlider);
        });

        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
                pauseSlider();
            } else if (e.key === 'ArrowRight') {
                nextTestimonial();
                pauseSlider();
            }
        });

        // Initialisation
        showTestimonial(0);
        startSlider();
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll(this.selectors.ANIMATE_ELEMS);
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }

    initFloatingCTA() {
        const cta = document.querySelector(this.selectors.FLOATING_CTA);
        if (!cta) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll <= 0) {
                cta.style.transform = 'translateY(0)';
                return;
            }

            if (currentScroll > lastScroll) {
                // Scroll vers le bas
                cta.style.transform = 'translateY(100px)';
            } else {
                // Scroll vers le haut
                cta.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }
}

// Initialisation avec vérification de la prise en charge des classes
if ('classList' in document.documentElement) {
    new VibracomApp();
} else {
    // Fallback pour les vieux navigateurs
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('.header')?.classList.add('loaded');
        document.querySelector('.hero')?.classList.add('loaded');
    });
}
