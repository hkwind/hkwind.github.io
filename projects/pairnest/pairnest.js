'use strict';

const app = document.querySelector('[data-pairnest-app]');

if (app) {
  const viewButtons = app.querySelectorAll('[data-view-button]');
  const panels = app.querySelectorAll('[data-view-panel]');
  const viewLabel = app.querySelector('[data-view-label]');
  const viewHeading = app.querySelector('[data-view-heading]');
  const status = app.querySelector('[data-app-status]');
  const views = {
    home: ['Home · Alex & Jamie', 'Your world, together.'],
    wishlist: ['Wishlist · shared ideas', 'Little things worth saving.'],
    goals: ['Future goals · shared plans', 'The plans you are building.'],
    calendar: ['Calendar · shared context', 'See the overlap.'],
    memories: ['Memories · photos & thoughts', 'Keep the good parts close.'],
    settings: ['Settings · make it yours', 'Make the space feel like yours.'],
  };

  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  const openView = (view) => {
    if (!views[view]) return;
    viewButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.viewButton === view));
    panels.forEach((panel) => {
      const active = panel.dataset.viewPanel === view;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    [viewLabel.textContent, viewHeading.textContent] = views[view];
    setStatus(`${views[view][1]} Sample data only — nothing is stored.`);
  };

  viewButtons.forEach((button) => button.addEventListener('click', () => openView(button.dataset.viewButton)));
  app.querySelectorAll('[data-jump-view]').forEach((button) => button.addEventListener('click', () => openView(button.dataset.jumpView)));

  app.querySelectorAll('[data-complete-wish]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.wish-card');
      const complete = card.classList.toggle('is-complete');
      button.textContent = complete ? 'Saved ✓' : 'Mark done';
      const title = card.querySelector('h4').textContent;
      setStatus(complete ? `${title} marked done in this sample session.` : `${title} is active again.`);
    });
  });

  app.querySelectorAll('[data-goal-range]').forEach((input) => {
    input.addEventListener('input', () => {
      const output = app.querySelector(`[data-goal-value="${input.dataset.goalRange}"]`);
      if (output) output.textContent = `${input.value}%`;
      setStatus(`Progress changed to ${input.value}% in this sample session.`);
    });
  });

  app.querySelector('[data-add-wish]').addEventListener('click', () => setStatus('A full PairNest workspace can add and organise wishes. This demo keeps data in memory only.'));
  app.querySelector('[data-add-goal]').addEventListener('click', () => setStatus('A full PairNest workspace can add future goals with owners, dates, and progress.'));
  app.querySelector('[data-add-event]').addEventListener('click', () => setStatus('A full PairNest workspace can add custom events and connect calendars.'));

  const calendarCaption = app.querySelector('[data-calendar-caption]');
  app.querySelectorAll('[data-calendar-view]').forEach((button) => {
    button.addEventListener('click', () => {
      app.querySelectorAll('[data-calendar-view]').forEach((item) => item.classList.toggle('is-active', item === button));
      const copy = {
        month: 'Month view · colour makes the shared context easy to scan.',
        week: 'Week view · a closer look at what is coming up together.',
        agenda: 'Agenda view · one simple list of upcoming events.',
      };
      calendarCaption.textContent = copy[button.dataset.calendarView];
      setStatus(`${button.textContent} calendar view selected for this walkthrough.`);
    });
  });

  app.querySelector('[data-memory-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const note = event.currentTarget.elements['memory-thought'].value.trim();
    if (!note) {
      event.currentTarget.elements['memory-thought'].focus();
      setStatus('Write a small thought first — it will only exist in this demo session.');
      return;
    }
    event.currentTarget.reset();
    setStatus('Sample memory saved for this session. Reset the page to clear it.');
  });

  app.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      app.querySelectorAll('[data-language]').forEach((item) => item.classList.toggle('is-active', item === button));
      app.querySelector('[data-language-label]').textContent = `${button.dataset.language} is selected for this walkthrough.`;
      setStatus(`${button.dataset.language} selected in this sample session.`);
    });
  });
}

const resetButton = document.querySelector('[data-reset-demo]');
if (resetButton) resetButton.addEventListener('click', () => window.location.reload());

const infoPopover = document.querySelector('[data-info-popover]');
const infoTrigger = document.querySelector('[data-show-note]');
const closeInfo = () => {
  if (!infoPopover) return;
  infoPopover.hidden = true;
  infoTrigger?.focus();
};

if (infoPopover && infoTrigger) {
  infoTrigger.addEventListener('click', () => {
    infoPopover.hidden = false;
    infoPopover.querySelector('[data-close-note]').focus();
  });
  infoPopover.querySelectorAll('[data-close-note]').forEach((button) => button.addEventListener('click', closeInfo));
  infoPopover.addEventListener('click', (event) => {
    if (event.target === infoPopover) closeInfo();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !infoPopover.hidden) closeInfo();
  });
}
