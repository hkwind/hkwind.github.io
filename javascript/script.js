'use strict';

document.documentElement.classList.add('has-js');

const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const header = document.querySelector('[data-header]');

const closeMenu = () => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-is-open');
};

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    navigation.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-is-open', willOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const setHeaderState = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const demoRoot = document.querySelector('[data-pairnest-demo]');
if (demoRoot) {
  const viewButtons = demoRoot.querySelectorAll('[data-pairnest-view]');
  const panels = demoRoot.querySelectorAll('[data-pairnest-panel]');
  const status = demoRoot.querySelector('[data-demo-status]');

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const requestedView = button.dataset.pairnestView;
      viewButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      panels.forEach((panel) => {
        const isRequested = panel.dataset.pairnestPanel === requestedView;
        panel.classList.toggle('is-active', isRequested);
        panel.hidden = !isRequested;
      });
      if (status) status.textContent = `${button.textContent.trim()} view shown — sample data only.`;
    });
  });

  demoRoot.querySelectorAll('[data-demo-task]').forEach((task) => {
    task.addEventListener('click', () => {
      const isDone = task.classList.toggle('is-complete');
      const taskName = task.querySelector('span:nth-child(2)')?.textContent || 'Task';
      if (status) status.textContent = isDone ? `${taskName} marked complete for this demo.` : `${taskName} returned to the list.`;
    });
  });
}

const currentYear = document.querySelector('[data-current-year]');
if (currentYear) currentYear.textContent = new Date().getFullYear();
