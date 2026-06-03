'use strict';

(function () {
    const guttro = window.GUTTRO || {};

    const sidebarLinks = document.querySelectorAll('.legal-sidebar__links a');
    const legalSections = document.querySelectorAll('.legal-section[id]');

    if (!sidebarLinks.length || !legalSections.length) {
        if (typeof guttro.refreshIcons === 'function') {
            guttro.refreshIcons();
        }

        return;
    }

    const clearActiveLinks = () => {
        sidebarLinks.forEach((link) => {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
        });
    };

    const setActiveLink = (id) => {
        const activeLink = document.querySelector(`.legal-sidebar__links a[href="#${id}"]`);

        if (!activeLink) return;

        clearActiveLinks();

        activeLink.classList.add('is-active');
        activeLink.setAttribute('aria-current', 'true');
    };

    const getCurrentSectionId = () => {
        const offset = 170;
        let currentId = legalSections[0].id;

        legalSections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop <= offset) {
                currentId = section.id;
            }
        });

        return currentId;
    };

    const updateActiveSection = () => {
        const currentId = getCurrentSectionId();

        if (currentId) {
            setActiveLink(currentId);
        }
    };

    const initSmoothScroll = () => {
        sidebarLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');

                if (!targetId || !targetId.startsWith('#')) return;

                const target = document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const headerOffset = 110;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                setActiveLink(target.id);

                window.history.pushState(null, '', targetId);
            });
        });
    };

    const initObserver = () => {
        if (!('IntersectionObserver' in window)) {
            window.addEventListener('scroll', updateActiveSection, { passive: true });
            updateActiveSection();
            return;
        }

        const observer = new IntersectionObserver(
            () => {
                updateActiveSection();
            },
            {
                root: null,
                threshold: 0,
                rootMargin: '-18% 0px -70% 0px'
            }
        );

        legalSections.forEach((section) => observer.observe(section));
    };

    const init = () => {
        initSmoothScroll();
        initObserver();
        updateActiveSection();

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