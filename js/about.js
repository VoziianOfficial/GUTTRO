'use strict';

(function () {
    const guttro = window.GUTTRO || {};

    const storyItems = document.querySelectorAll('.about-story__visual article');
    const modelItems = document.querySelectorAll('.about-model__path article');
    const clarityItems = document.querySelectorAll('.about-clarity__grid article');
    const processRows = document.querySelectorAll('.about-process__rows article');

    const addIndexAttributes = (items, attributeName) => {
        items.forEach((item, index) => {
            item.setAttribute(attributeName, String(index + 1));
        });
    };

    const initPointerMovement = () => {
        const elements = [
            ...storyItems,
            ...modelItems,
            ...clarityItems,
            ...processRows
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

    const initProcessImageFocus = () => {
        const imageCard = document.querySelector('.about-process__photo');

        if (!imageCard) return;

        imageCard.addEventListener('mouseenter', () => {
            imageCard.classList.add('is-hovered');
        });

        imageCard.addEventListener('mouseleave', () => {
            imageCard.classList.remove('is-hovered');
        });
    };

    const init = () => {
        addIndexAttributes(storyItems, 'data-story-item');
        addIndexAttributes(modelItems, 'data-model-item');
        addIndexAttributes(clarityItems, 'data-clarity-item');
        addIndexAttributes(processRows, 'data-process-row');

        initPointerMovement();
        initProcessImageFocus();

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