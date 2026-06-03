'use strict';

(function () {
    const guttro = window.GUTTRO || {};

    const relevanceRows = document.querySelectorAll('.service-relevance__row');
    const evaluationItems = document.querySelectorAll('.provider-evaluation__item');
    const visualChips = document.querySelectorAll('.service-visual__chips span');
    const relatedCards = document.querySelectorAll('.related-service-card');
    const introNotices = document.querySelectorAll('.service-intro__notice');

    const addIndexAttributes = (items, attributeName) => {
        items.forEach((item, index) => {
            item.setAttribute(attributeName, String(index + 1));
        });
    };

    const initPointerMovement = () => {
        const elements = [
            ...relevanceRows,
            ...evaluationItems,
            ...visualChips,
            ...relatedCards,
            ...introNotices
        ];

        elements.forEach((element) => {
            element.addEventListener('pointermove', (event) => {
                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                element.style.setProperty('--pointer-x', `${x}px`);
                element.style.setProperty('--pointer-y', `${y}px`);
            });

            element.addEventListener('pointerleave', () => {
                element.style.removeProperty('--pointer-x');
                element.style.removeProperty('--pointer-y');
            });
        });
    };

    const initKeyboardFocus = () => {
        relatedCards.forEach((card) => {
            card.addEventListener('focus', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('is-focused');
            });
        });
    };

    const initServiceHeroState = () => {
        const hero = document.querySelector('.service-hero');

        if (!hero) return;

        window.setTimeout(() => {
            hero.classList.add('is-ready');
        }, 80);
    };

    const initScrollHint = () => {
        const hero = document.querySelector('.service-hero');
        const intro = document.querySelector('#service-intro');

        if (!hero || !intro) return;

        const hint = document.createElement('a');
        hint.className = 'service-scroll-hint';
        hint.href = '#service-intro';
        hint.setAttribute('aria-label', 'Scroll to service introduction');
        hint.innerHTML = `
            <span>Explore category</span>
            <i data-lucide="arrow-down" aria-hidden="true"></i>
        `;

        hero.appendChild(hint);

        if (typeof guttro.refreshIcons === 'function') {
            guttro.refreshIcons();
        }
    };

    const initRelatedCardLabels = () => {
        relatedCards.forEach((card) => {
            const title = card.querySelector('strong')?.textContent?.trim();

            if (title && !card.getAttribute('aria-label')) {
                card.setAttribute('aria-label', `View ${title} comparison category`);
            }
        });
    };

    const init = () => {
        addIndexAttributes(relevanceRows, 'data-relevance-row');
        addIndexAttributes(evaluationItems, 'data-evaluation-item');
        addIndexAttributes(visualChips, 'data-visual-chip');
        addIndexAttributes(relatedCards, 'data-related-card');

        initPointerMovement();
        initKeyboardFocus();
        initServiceHeroState();
        initScrollHint();
        initRelatedCardLabels();

        if (typeof guttro.refreshIcons === 'function') {
            guttro.refreshIcons();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();