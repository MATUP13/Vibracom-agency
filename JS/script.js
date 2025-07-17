class VibracomApp {
    constructor() {
        this.selectors = {
            HERO: '.hero',
            MENU_TOGGLE: '.menu-toggle',
            NAV: '.nav ul',
            STATS: '.stats',
            STAT_NUMBERS: '.stat-number',
            HEADER: '.header',
            TESTIMONIALS: '.testimonial',
            ANIMATE_ELEMS: '.service-card, .portfolio-item',
            NAV_LINKS: '.nav a'
        };
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

    initHero() {
        const hero = document.querySelector(this.selectors.HERO);
        if (!hero) return;

        const handleLoad = () => {
            hero.classList.add('loaded');
            window.removeEventListener('load', handleLoad);
        };

        document.readyState === 'complete' 
            ? hero.classList.add('loaded')
            : window.addEventListener('load', handleLoad);
    }

    initMobileMenu() {
        const { MENU_TOGGLE, NAV, NAV_LINKS } = this.selectors;
        const menuToggle = document.querySelector(MENU_TOGGLE);
        const nav = document.querySelector(NAV);
        if (!menuToggle || !nav) return;

        const toggleMenu = (shouldClose = false) => {
            const isActive = shouldClose ? false : !nav.classList.contains('active');
            nav.classList.toggle('active', isActive);
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        document.querySelectorAll(NAV_LINKS).forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu(true);
            }
        });
    }

    initStatsAnimation() {
        const statsSection = document.querySelector(this.selectors.STATS);
        if (!statsSection) return;

        const animateValue = (el, target, duration) => {
            let start = null;
            const step = (timestamp) => {
                start = start || timestamp;
                const progress = timestamp - start;
                el.textContent = Math.floor(Math.min(progress/duration, 1) * target);
                if (progress < duration) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll(this.selectors.STAT_NUMBERS)
                        .forEach(el => animateValue(el, +el.dataset.count || 0, 2000));
                }
            });
        }, { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }).observe(statsSection);
    }

    initSmoothScroll() {
        if (!('scrollBehavior' in document.documentElement.style)) {
            import('smoothscroll-polyfill').then(m => m.polyfill());
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const header = document.querySelector(this.selectors.HEADER);
                    window.scrollTo({
                        top: target.offsetTop - (header?.offsetHeight || 80),
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initStickyHeader() {
        const header = document.querySelector(this.selectors.HEADER);
        if (!header) return;

        const handler = () => header.classList.toggle('sticky', window.scrollY > 100);
        window.addEventListener('scroll', handler, { passive: true });
        handler();
    }

    initTestimonials() {
        const testimonials = document.querySelectorAll(this.selectors.TESTIMONIALS);
        if (testimonials.length < 2) return;

        let current = 0;
        let interval;

        const showTestimonial = (index) => {
            testimonials.forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
        };

        const startSlider = () => {
            clearInterval(interval);
            interval = setInterval(() => {
                current = (current + 1) % testimonials.length;
                showTestimonial(current);
            }, 5000);
        };

        const pauseSlider = () => {
            clearInterval(interval);
            setTimeout(startSlider, 10000);
        };

        testimonials.forEach(t => {
            t.addEventListener('mouseenter', pauseSlider);
            t.addEventListener('touchstart', pauseSlider);
            t.addEventListener('mouseleave', startSlider);
        });

        showTestimonial(0);
        startSlider();
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll(this.selectors.ANIMATE_ELEMS);
        if (!elements.length) return;

        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }).observe(elements);
    }
}

new VibracomApp();
