'use strict';

(function () {
    const guttro = window.GUTTRO || {};

    const serviceCards = document.querySelectorAll('.services-card');
    const serviceRows = document.querySelectorAll('.service-fit__row');
    const comparisonRows = document.querySelectorAll('.comparison-factors__list article');

    const setInteractiveIndex = (items, attributeName) => {
        items.forEach((item, index) => {
            item.setAttribute(attributeName, String(index + 1));
        });
    };

    const initKeyboardCardFocus = () => {
        serviceCards.forEach((card) => {
            card.addEventListener('focus', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('is-focused');
            });
        });
    };

    const initPointerGlow = () => {
        const interactiveItems = [
            ...serviceCards,
            ...serviceRows,
            ...comparisonRows
        ];

        interactiveItems.forEach((item) => {
            item.addEventListener('pointermove', (event) => {
                const rect = item.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                item.style.setProperty('--pointer-x', `${x}px`);
                item.style.setProperty('--pointer-y', `${y}px`);
            });

            item.addEventListener('pointerleave', () => {
                item.style.removeProperty('--pointer-x');
                item.style.removeProperty('--pointer-y');
            });
        });
    };

    const init = () => {
        setInteractiveIndex(serviceCards, 'data-service-card-index');
        setInteractiveIndex(serviceRows, 'data-service-fit-index');
        setInteractiveIndex(comparisonRows, 'data-comparison-row-index');

        initKeyboardCardFocus();
        initPointerGlow();

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