// Controls the sliding navigation menu shared across pages.
document.addEventListener('DOMContentLoaded', () => {
    const menuToggleButton = document.getElementById('menuToggle');
    const menuCloseButtons = document.querySelectorAll('[data-close-menu]');
    const slidingMenu = document.getElementById('mainMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = slidingMenu?.querySelectorAll('.SlidingMenuNav a');

    if (!menuToggleButton || !slidingMenu || !menuOverlay) {
        return;
    }

    const toggleMenu = (shouldOpen) => {
        const open = shouldOpen ?? !slidingMenu.classList.contains('open');

        slidingMenu.classList.toggle('open', open);
        menuOverlay.toggleAttribute('hidden', !open);
        menuOverlay.classList.toggle('visible', open);
        document.body.classList.toggle('menu-open', open);
        slidingMenu.setAttribute('aria-hidden', (!open).toString());
        menuToggleButton.setAttribute('aria-expanded', open.toString());
    };

    menuToggleButton.addEventListener('click', () => toggleMenu(true));
    menuCloseButtons.forEach((button) => {
        button.addEventListener('click', () => toggleMenu(false));
    });
    menuOverlay.addEventListener('click', () => toggleMenu(false));

    menuLinks?.forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && slidingMenu.classList.contains('open')) {
            toggleMenu(false);
        }
    });
});