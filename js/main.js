'use strict';

(function () {
    const config = window.SITE_CONFIG || {};

    const selectors = {
        header: '[data-header]',
        menuToggle: '[data-menu-toggle]',
        mobileMenu: '[data-mobile-menu]',
        menuClose: '[data-menu-close]',
        dropdown: '[data-dropdown]',
        dropdownToggle: '[data-dropdown-toggle]',
        dropdownMenu: '[data-dropdown-menu]',
        accordion: '[data-accordion]',
        accordionButton: '[data-accordion-button]',
        pipeNav: '[data-pipe-nav]',
        cookieBanner: '[data-cookie-banner]'
    };

    const classes = {
        headerScrolled: 'is-scrolled',
        menuOpen: 'is-menu-open',
        dropdownOpen: 'is-dropdown-open',
        accordionOpen: 'is-open',
        active: 'is-active',
        reducedMotion: 'prefers-reduced-motion'
    };

    const storageKeys = {
        cookieConsent: 'guttroCookieConsent'
    };

    const getConfigValue = (path) => {
        if (!path || typeof path !== 'string') return '';

        return path.split('.').reduce((current, key) => {
            if (current && Object.prototype.hasOwnProperty.call(current, key)) {
                return current[key];
            }

            return '';
        }, config);
    };

    const getImagePath = (key) => {
        if (!key || !config.images) return '';
        return config.images[key] || '';
    };

    const setText = (element, value) => {
        if (!element || value === undefined || value === null) return;
        element.textContent = value;
    };

    const setAttribute = (element, attribute, value) => {
        if (!element || !attribute || !value) return;
        element.setAttribute(attribute, value);
    };

    const lockBodyScroll = () => {
        document.documentElement.classList.add(classes.menuOpen);
        document.body.classList.add(classes.menuOpen);
    };

    const unlockBodyScroll = () => {
        document.documentElement.classList.remove(classes.menuOpen);
        document.body.classList.remove(classes.menuOpen);
    };

    const refreshIcons = () => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    };

    const hydrateConfigText = () => {
        document.querySelectorAll('[data-config]').forEach((element) => {
            const path = element.getAttribute('data-config');
            const value = getConfigValue(path);

            if (value) {
                setText(element, value);
            }
        });
    };

    const hydratePhoneLinks = () => {
        const phoneRaw = config.contact?.phoneRaw || '';
        const phoneDisplay = config.contact?.phoneDisplay || '';
        const phoneButtonText = config.contact?.phoneButtonText || phoneDisplay;

        document.querySelectorAll('[data-phone-link]').forEach((element) => {
            if (phoneRaw) {
                element.setAttribute('href', `tel:${phoneRaw}`);
            }

            const mode = element.getAttribute('data-phone-link');

            if (mode === 'display') {
                setText(element, phoneDisplay);
            }

            if (mode === 'button') {
                setText(element, phoneButtonText);
            }
        });
    };

    const hydrateEmailLinks = () => {
        const email = config.contact?.email || '';

        document.querySelectorAll('[data-email-link]').forEach((element) => {
            if (email) {
                element.setAttribute('href', `mailto:${email}`);
            }

            const mode = element.getAttribute('data-email-link');

            if (mode === 'display') {
                setText(element, email);
            }
        });
    };

    const hydrateCurrentYear = () => {
        document.querySelectorAll('[data-current-year]').forEach((element) => {
            setText(element, String(new Date().getFullYear()));
        });
    };

    const hydrateImages = () => {
        document.querySelectorAll('[data-image-key]').forEach((element) => {
            const key = element.getAttribute('data-image-key');
            const path = getImagePath(key);

            if (!path) return;

            if (element.tagName.toLowerCase() === 'img') {
                element.setAttribute('src', path);

                if (!element.getAttribute('alt')) {
                    element.setAttribute('alt', 'Gutter provider comparison visual');
                }

                return;
            }

            element.style.backgroundImage = `url("${path}")`;
        });

        document.querySelectorAll('[data-bg-image-key]').forEach((element) => {
            const key = element.getAttribute('data-bg-image-key');
            const path = getImagePath(key);

            if (path) {
                element.style.backgroundImage = `url("${path}")`;
            }
        });
    };

    const hydrateDocumentMeta = () => {
        const companyName = config.company?.name;

        if (!companyName) return;

        document.querySelectorAll('[data-page-title]').forEach((element) => {
            const pageTitle = element.getAttribute('data-page-title');

            if (pageTitle) {
                document.title = `${pageTitle} | ${companyName}`;
            }
        });
    };

    const hydrateGlobalSiteData = () => {
        const companyName = config.company?.name || '';
        const companyId = config.company?.companyId || '';
        const companyAddress = config.company?.address || '';
        const serviceArea = config.company?.serviceArea || '';

        const phoneRaw = config.contact?.phoneRaw || '';
        const phoneDisplay = config.contact?.phoneDisplay || '';
        const phoneButtonText = config.contact?.phoneButtonText || phoneDisplay;
        const email = config.contact?.email || '';
        const supportHours = config.contact?.supportHours || '';

        const replacements = [
            ['GUTTRO', companyName],
            ['GUT-US-4827', companyId],
            ['1846 Rainline Avenue, Austin, TX 78701, USA', companyAddress],
            ['USA gutter provider comparison platform', serviceArea],
            ['+18885550148', phoneRaw],
            ['(888) 555-0148', phoneDisplay],
            ['hello@guttrocompare.com', email],
            ['Mon–Fri, 8:00 AM–7:00 PM', supportHours],

            /* placeholders, если захочешь писать их в html */
            ['{{company.name}}', companyName],
            ['{{company.id}}', companyId],
            ['{{company.address}}', companyAddress],
            ['{{company.serviceArea}}', serviceArea],
            ['{{contact.phoneRaw}}', phoneRaw],
            ['{{contact.phoneDisplay}}', phoneDisplay],
            ['{{contact.phoneButtonText}}', phoneButtonText],
            ['{{contact.email}}', email],
            ['{{contact.supportHours}}', supportHours]
        ].filter(([, value]) => value);

        const replaceValue = (value) => {
            if (!value || typeof value !== 'string') return value;

            return replacements.reduce((result, [from, to]) => {
                return result.split(from).join(to);
            }, value);
        };

        /* 1. Точный data-config */
        document.querySelectorAll('[data-config]').forEach((element) => {
            const path = element.getAttribute('data-config');
            const value = getConfigValue(path);

            if (value) {
                element.textContent = value;
            }
        });

        /* 2. Телефонные ссылки */
        document.querySelectorAll('[data-phone-link]').forEach((element) => {
            if (phoneRaw) {
                element.setAttribute('href', `tel:${phoneRaw}`);
            }

            const mode = element.getAttribute('data-phone-link');

            if (mode === 'display') {
                element.textContent = phoneDisplay;
            }

            if (mode === 'button') {
                element.textContent = phoneButtonText;
            }
        });

        /* 3. Email ссылки */
        document.querySelectorAll('[data-email-link]').forEach((element) => {
            if (email) {
                element.setAttribute('href', `mailto:${email}`);
            }

            const mode = element.getAttribute('data-email-link');

            if (mode === 'display') {
                element.textContent = email;
            }
        });

        /* 4. Заголовок вкладки */
        if (document.title) {
            document.title = replaceValue(document.title);
        }

        /* 5. Meta description и другие атрибуты */
        const attributeNames = [
            'href',
            'aria-label',
            'title',
            'alt',
            'placeholder',
            'content',
            'value'
        ];

        document
            .querySelectorAll('a, img, input, textarea, meta, button, [aria-label], [title], [placeholder]')
            .forEach((element) => {
                attributeNames.forEach((attribute) => {
                    if (!element.hasAttribute(attribute)) return;

                    const currentValue = element.getAttribute(attribute);
                    const nextValue = replaceValue(currentValue);

                    if (nextValue !== currentValue) {
                        element.setAttribute(attribute, nextValue);
                    }
                });
            });

        /* 6. Обычный текст на странице */
        const ignoredTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'];

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;

                    if (!parent || ignoredTags.includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (!node.nodeValue || !node.nodeValue.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach((node) => {
            const currentValue = node.nodeValue;
            const nextValue = replaceValue(currentValue);

            if (nextValue !== currentValue) {
                node.nodeValue = nextValue;
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector(selectors.header);

        if (!header) return;

        const updateHeaderState = () => {
            if (window.scrollY > 10) {
                header.classList.add(classes.headerScrolled);
            } else {
                header.classList.remove(classes.headerScrolled);
            }
        };

        updateHeaderState();

        window.addEventListener('scroll', updateHeaderState, {
            passive: true
        });
    };

    const initMobileMenu = () => {
        const menu = document.querySelector(selectors.mobileMenu);
        const toggles = document.querySelectorAll(selectors.menuToggle);
        const closeButtons = document.querySelectorAll(selectors.menuClose);

        if (!menu || !toggles.length) return;

        const openMenu = () => {
            menu.classList.add(classes.active);
            menu.setAttribute('aria-hidden', 'false');
            lockBodyScroll();

            toggles.forEach((toggle) => {
                toggle.setAttribute('aria-expanded', 'true');
            });

            const firstLink = menu.querySelector('a, button');

            if (firstLink) {
                setTimeout(() => firstLink.focus(), 80);
            }
        };

        const closeMenu = () => {
            menu.classList.remove(classes.active);
            menu.setAttribute('aria-hidden', 'true');
            unlockBodyScroll();

            toggles.forEach((toggle) => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        };

        toggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                const isOpen = menu.classList.contains(classes.active);

                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
        });

        closeButtons.forEach((button) => {
            button.addEventListener('click', closeMenu);
        });

        menu.addEventListener('click', (event) => {
            const target = event.target;

            if (!(target instanceof Element)) return;

            const isBackdrop = target.matches(selectors.mobileMenu);
            const isMenuLink = target.closest('a');

            if (isBackdrop || isMenuLink) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains(classes.active)) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && menu.classList.contains(classes.active)) {
                closeMenu();
            }
        });
    };

    const initDropdowns = () => {
        document.querySelectorAll(selectors.dropdown).forEach((dropdown) => {
            const toggle = dropdown.querySelector(selectors.dropdownToggle);
            const menu = dropdown.querySelector(selectors.dropdownMenu);

            if (!toggle || !menu) return;

            let closeTimer = null;

            const openDropdown = () => {
                window.clearTimeout(closeTimer);
                dropdown.classList.add(classes.dropdownOpen);
                toggle.setAttribute('aria-expanded', 'true');
                menu.setAttribute('aria-hidden', 'false');
            };

            const closeDropdown = () => {
                closeTimer = window.setTimeout(() => {
                    dropdown.classList.remove(classes.dropdownOpen);
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.setAttribute('aria-hidden', 'true');
                }, 180);
            };

            dropdown.addEventListener('mouseenter', openDropdown);
            dropdown.addEventListener('mouseleave', closeDropdown);
            dropdown.addEventListener('focusin', openDropdown);
            dropdown.addEventListener('focusout', (event) => {
                if (!dropdown.contains(event.relatedTarget)) {
                    closeDropdown();
                }
            });

            toggle.addEventListener('click', (event) => {
                const isTouchSize = window.innerWidth < 1024;

                if (!isTouchSize) return;

                const isOpen = dropdown.classList.contains(classes.dropdownOpen);

                if (!isOpen) {
                    event.preventDefault();
                    openDropdown();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    dropdown.classList.remove(classes.dropdownOpen);
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.setAttribute('aria-hidden', 'true');
                }
            });
        });
    };

    const initAccordions = () => {
        document.querySelectorAll(selectors.accordion).forEach((accordion) => {
            const buttons = accordion.querySelectorAll(selectors.accordionButton);
            const isSingle = accordion.hasAttribute('data-accordion-single');

            buttons.forEach((button, index) => {
                const panelId =
                    button.getAttribute('aria-controls') ||
                    `accordion-panel-${Date.now()}-${index}`;

                const panel =
                    document.getElementById(panelId) ||
                    button.closest('[data-accordion-item]')?.querySelector('[data-accordion-panel]');

                if (!panel) return;

                button.setAttribute('aria-controls', panelId);
                button.setAttribute('aria-expanded', 'false');
                panel.setAttribute('id', panelId);
                panel.setAttribute('hidden', '');

                button.addEventListener('click', () => {
                    const item = button.closest('[data-accordion-item]');
                    const isOpen = button.getAttribute('aria-expanded') === 'true';

                    if (isSingle) {
                        buttons.forEach((otherButton) => {
                            const otherPanelId = otherButton.getAttribute('aria-controls');
                            const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
                            const otherItem = otherButton.closest('[data-accordion-item]');

                            otherButton.setAttribute('aria-expanded', 'false');
                            otherPanel?.setAttribute('hidden', '');
                            otherItem?.classList.remove(classes.accordionOpen);
                        });
                    }

                    button.setAttribute('aria-expanded', String(!isOpen));

                    if (isOpen) {
                        panel.setAttribute('hidden', '');
                        item?.classList.remove(classes.accordionOpen);
                    } else {
                        panel.removeAttribute('hidden');
                        item?.classList.add(classes.accordionOpen);
                    }
                });
            });
        });
    };

    const initSmoothAnchors = () => {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');

                if (!href || href === '#') return;

                const target = document.querySelector(href);

                if (!target) return;

                event.preventDefault();

                const header = document.querySelector(selectors.header);
                const headerHeight = header ? header.offsetHeight : 0;
                const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

                window.scrollTo({
                    top: targetTop,
                    behavior: document.documentElement.classList.contains(classes.reducedMotion)
                        ? 'auto'
                        : 'smooth'
                });

                history.pushState(null, '', href);
            });
        });
    };

    const initActivePageLinks = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('[data-nav-link]').forEach((link) => {
            const href = link.getAttribute('href');

            if (!href) return;

            const linkPath = href.split('#')[0];

            if (linkPath === currentPath) {
                link.classList.add(classes.active);
                link.setAttribute('aria-current', 'page');
            }
        });
    };

    const initPipeNavigation = () => {
        const nav = document.querySelector(selectors.pipeNav);

        if (!nav) return;

        const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
        const sections = links
            .map((link) => {
                const id = link.getAttribute('href');
                return id ? document.querySelector(id) : null;
            })
            .filter(Boolean);

        if (!links.length || !sections.length) return;

        const activateLink = (id) => {
            links.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle(classes.active, isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visibleEntries.length) {
                    activateLink(visibleEntries[0].target.id);
                }
            },
            {
                rootMargin: '-35% 0px -50% 0px',
                threshold: [0.15, 0.3, 0.6]
            }
        );

        sections.forEach((section) => observer.observe(section));
    };

    const createCookieBanner = () => {
        const existingBanner = document.querySelector(selectors.cookieBanner);

        if (existingBanner) return existingBanner;

        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('data-cookie-banner', '');
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Cookie consent');

        banner.innerHTML = `
            <div class="cookie-banner__content">
                <p>
                    We use cookies to improve site experience and understand how visitors use GUTTRO.
                    Review our
                    <a href="privacy-policy.html">Privacy Policy</a>,
                    <a href="cookie-policy.html">Cookie Policy</a>, and
                    <a href="terms-of-service.html">Terms of Service</a>.
                </p>

                <div class="cookie-banner__actions">
                    <button class="cookie-banner__button cookie-banner__button--ghost" type="button" data-cookie-decline>
                        Decline
                    </button>

                    <button class="cookie-banner__button cookie-banner__button--primary" type="button" data-cookie-accept>
                        Accept
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        return banner;
    };

    const initCookieBanner = () => {
        const savedConsent = localStorage.getItem(storageKeys.cookieConsent);

        if (savedConsent) return;

        const banner = createCookieBanner();
        const acceptButton = banner.querySelector('[data-cookie-accept]');
        const declineButton = banner.querySelector('[data-cookie-decline]');

        const saveConsent = (value) => {
            localStorage.setItem(storageKeys.cookieConsent, value);
            banner.classList.add('is-hidden');

            window.setTimeout(() => {
                banner.remove();
            }, 260);
        };

        acceptButton?.addEventListener('click', () => saveConsent('accepted'));
        declineButton?.addEventListener('click', () => saveConsent('declined'));

        window.setTimeout(() => {
            banner.classList.add(classes.active);
        }, 300);
    };

    const initReducedMotion = () => {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const updateMotionClass = () => {
            document.documentElement.classList.toggle(classes.reducedMotion, motionQuery.matches);
        };

        updateMotionClass();

        if (typeof motionQuery.addEventListener === 'function') {
            motionQuery.addEventListener('change', updateMotionClass);
        }
    };

    const initExternalLinkSafety = () => {
        document.querySelectorAll('a[target="_blank"]').forEach((link) => {
            const rel = link.getAttribute('rel') || '';
            const relValues = new Set(rel.split(' ').filter(Boolean));

            relValues.add('noopener');
            relValues.add('noreferrer');

            link.setAttribute('rel', Array.from(relValues).join(' '));
        });
    };

    const init = () => {
        initReducedMotion();

        hydrateGlobalSiteData();
        hydrateConfigText();
        hydratePhoneLinks();
        hydrateEmailLinks();
        hydrateCurrentYear();
        hydrateImages();
        hydrateDocumentMeta();

        initStickyHeader();
        initMobileMenu();
        initDropdowns();
        initAccordions();
        initSmoothAnchors();
        initActivePageLinks();
        initPipeNavigation();
        initCookieBanner();
        initExternalLinkSafety();

        refreshIcons();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.GUTTRO = {
        config,
        getConfigValue,
        getImagePath,
        hydrateConfigText,
        hydrateImages,
        refreshIcons
    };
})();