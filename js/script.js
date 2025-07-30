class VibracomApp {
    constructor() {
        this.selectors = {
            HERO: '.hero',
            MENU_TOGGLE: '.menu-toggle',
            NAV: '.nav',
            NAV_LINKS: '.nav a',
            HEADER: '.header',
            TESTIMONIALS: '.testimonial',
            ANIMATE_ELEMS: '[class*="animate"]',
            FLOATING_CTA: '.floating-cta',
            BTN_PULSE: '.btn-pulse',
            CONTACT_FORM: '#contact-form'
        };
        this.init();
    }

    init() {
        if (document.readyState === 'complete') {
            this.setupApp();
        } else {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        }
    }

    setupApp() {
        this.initHeroAnimation();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initStickyHeader();
        this.initScrollAnimations();
        this.initFloatingCTA();
        this.initContactForm();
    }

    initHeroAnimation() {
        const hero = document.querySelector(this.selectors.HERO);
        if (hero) {
            hero.classList.add('loaded');
        }
    }

    initMobileMenu() {
        const toggle = document.querySelector(this.selectors.MENU_TOGGLE);
        const nav = document.querySelector(this.selectors.NAV);
        if (!toggle || !nav) return;

        const toggleMenu = (state) => {
            const isActive = state ?? !nav.classList.contains('active');
            
            nav.classList.toggle('active', isActive);
            toggle.classList.toggle('active', isActive);
            toggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        // Événements
        toggle.addEventListener('click', () => toggleMenu());
        
        document.querySelectorAll(this.selectors.NAV_LINKS).forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#' || targetId === '#!') return;
                
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

                history.replaceState(null, null, targetId);
            });
        });
    }

    initStickyHeader() {
        const header = document.querySelector(this.selectors.HEADER);
        if (!header) return;

        const handler = () => {
            header.classList.toggle('sticky', window.scrollY > 50);
        };

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(handler);
        }, { passive: true });

        handler();
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
        }, { threshold: 0.15 });

        elements.forEach(el => observer.observe(el));
    }

    initFloatingCTA() {
        const cta = document.querySelector(this.selectors.FLOATING_CTA);
        if (!cta) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll <= 0) return;

            cta.style.transform = currentScroll > lastScroll 
                ? 'translateY(100px)' 
                : 'translateY(0)';
            lastScroll = currentScroll;
        }, { passive: true });
    }

    initContactForm() {
        const form = document.querySelector(this.selectors.CONTACT_FORM);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';
                
                // Simulation d'envoi - À remplacer par un vrai fetch()
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                form.reset();
                submitBtn.textContent = 'Envoyé !';
                setTimeout(() => submitBtn.textContent = originalText, 2000);
            } catch (error) {
                submitBtn.textContent = 'Erreur';
                console.error('Erreur:', error);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }
}

// Initialisation
if ('IntersectionObserver' in window && 'classList' in document.documentElement) {
    new VibracomApp();
} else {
    // Fallback pour vieux navigateurs
    document.querySelector('.header')?.classList.add('loaded');
    document.querySelector('.hero')?.classList.add('loaded');
}
