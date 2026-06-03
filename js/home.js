'use strict';

(function () {
    const config = window.SITE_CONFIG || {};
    const guttro = window.GUTTRO || {};

    const hero = document.querySelector('[data-home-hero]');

    if (!hero) return;

    const bg = hero.querySelector('[data-home-hero-bg]');
    const label = hero.querySelector('[data-home-hero-label]');
    const title = hero.querySelector('[data-home-hero-title]');
    const text = hero.querySelector('[data-home-hero-text]');
    const prevButton = hero.querySelector('[data-home-hero-prev]');
    const nextButton = hero.querySelector('[data-home-hero-next]');
    const dotsContainer = hero.querySelector('[data-home-hero-dots]');

    const slides = Array.isArray(config.heroSlides) ? config.heroSlides : [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;

    const getImagePath = (key) => {
        if (typeof guttro.getImagePath === 'function') {
            return guttro.getImagePath(key);
        }

        return config.images?.[key] || '';
    };

    const setContent = (slide) => {
        if (!slide) return;

        const imagePath = getImagePath(slide.imageKey);

        if (bg && imagePath) {
            bg.classList.add('is-changing');

            window.setTimeout(() => {
                bg.style.backgroundImage = `url("${imagePath}")`;
                bg.classList.remove('is-changing');
            }, reducedMotion ? 0 : 180);
        }

        if (label) {
            label.textContent = slide.label || '';
        }

        if (title) {
            title.textContent = slide.title || '';
        }

        if (text) {
            text.textContent = slide.text || '';
        }
    };

    const updateDots = () => {
        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll('[data-home-hero-dot]');

        dots.forEach((dot, index) => {
            const isActive = index === currentIndex;

            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', String(isActive));
            dot.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    };

    const goToSlide = (index) => {
        if (!slides.length) return;

        currentIndex = (index + slides.length) % slides.length;

        setContent(slides[currentIndex]);
        updateDots();
    };

    const goToNextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    const goToPrevSlide = () => {
        goToSlide(currentIndex - 1);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const startAutoplay = () => {
        stopAutoplay();

        if (reducedMotion || slides.length <= 1) return;

        autoplayTimer = window.setInterval(() => {
            if (!isPaused) {
                goToNextSlide();
            }
        }, 6500);
    };

    const buildDots = () => {
        if (!dotsContainer || !slides.length) return;

        dotsContainer.innerHTML = '';

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');

            dot.className = 'home-hero__dot';
            dot.type = 'button';
            dot.setAttribute('data-home-hero-dot', '');
            dot.setAttribute('aria-label', `Show slide ${index + 1}: ${slide.label || 'GUTTRO slide'}`);
            dot.setAttribute('aria-selected', String(index === currentIndex));
            dot.setAttribute('tabindex', index === currentIndex ? '0' : '-1');

            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoplay();
            });

            dotsContainer.appendChild(dot);
        });

        dotsContainer.setAttribute('role', 'tablist');
    };

    const bindControls = () => {
        prevButton?.addEventListener('click', () => {
            goToPrevSlide();
            startAutoplay();
        });

        nextButton?.addEventListener('click', () => {
            goToNextSlide();
            startAutoplay();
        });

        hero.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        hero.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        hero.addEventListener('focusin', () => {
            isPaused = true;
        });

        hero.addEventListener('focusout', () => {
            isPaused = false;
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        hero.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                goToNextSlide();
                startAutoplay();
            }

            if (event.key === 'ArrowLeft') {
                goToPrevSlide();
                startAutoplay();
            }
        });
    };

    const init = () => {
        if (!slides.length) return;

        buildDots();
        bindControls();
        goToSlide(0);
        startAutoplay();

        if (typeof guttro.refreshIcons === 'function') {
            guttro.refreshIcons();
        }
    };

    init();
})();