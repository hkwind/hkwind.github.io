'use strict';

const app = document.querySelector('[data-pairnest-app]');

if (app) {
  const viewButtons = app.querySelectorAll('[data-view-button]');
  const panels = app.querySelectorAll('[data-view-panel]');
  const viewLabel = app.querySelector('[data-view-label]');
  const viewHeading = app.querySelector('[data-view-heading]');
  const status = app.querySelector('[data-app-status]');
  const viewCopy = {
    today: ['Today · Thursday, 7 August', 'Good evening, James.'],
    shared: ['Shared · August', 'Fair, at a glance.'],
    plans: ['Plans · 9–10 August', 'A weekend with room in it.'],
  };

  const setStatus = (message) => {
    if (status) status.textContent = message;
  };

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.viewButton;
      viewButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      panels.forEach((panel) => {
        const isActive = panel.dataset.viewPanel === view;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
      [viewLabel.textContent, viewHeading.textContent] = viewCopy[view];
      setStatus(`${viewCopy[view][1]} This is still sample data only.`);
    });
  });

  const taskList = app.querySelector('[data-task-list]');
  const taskCount = app.querySelector('[data-task-count]');

  const updateTaskCount = () => {
    const incomplete = taskList.querySelectorAll('.task-row:not(.is-complete)').length;
    taskCount.textContent = `${incomplete} ${incomplete === 1 ? 'thing' : 'things'} waiting`;
  };

  const createTask = (name, when = 'Just added') => {
    const task = document.createElement('button');
    task.className = 'task-row';
    task.type = 'button';
    task.dataset.task = name;
    task.innerHTML = `<span class="task-check" aria-hidden="true"></span><span class="task-row__name"></span><span class="task-row__when"></span>`;
    task.querySelector('.task-row__name').textContent = name;
    task.querySelector('.task-row__when').textContent = when;
    return task;
  };

  taskList.addEventListener('click', (event) => {
    const task = event.target.closest('.task-row');
    if (!task) return;
    const nowComplete = task.classList.toggle('is-complete');
    updateTaskCount();
    setStatus(nowComplete ? `${task.dataset.task} marked complete in this sample session.` : `${task.dataset.task} brought back to the list.`);
  });

  app.querySelector('[data-task-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.currentTarget.elements.task;
    const name = input.value.trim();
    if (!name) {
      input.focus();
      setStatus('Type a small task first — it only exists in this browser session.');
      return;
    }
    taskList.append(createTask(name));
    input.value = '';
    updateTaskCount();
    setStatus(`${name} added to the sample list. It will disappear if you reset the demo.`);
  });

  app.querySelector('[data-focus-task]').addEventListener('click', () => {
    const input = app.querySelector('#task-input');
    input.focus();
    setStatus('Add a small task to try the browser-only interaction.');
  });

  const expenseList = app.querySelector('[data-expense-list]');
  const expenseTotal = app.querySelector('[data-expense-total]');
  let runningExpenseTotal = 884;

  const formatHkd = (amount) => `HK$ ${amount.toLocaleString('en-HK')}`;

  app.querySelector('[data-expense-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const { expenseName, expenseAmount } = event.currentTarget.elements;
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    if (!name || !Number.isFinite(amount) || amount <= 0) {
      setStatus('Add both a short expense name and an amount to try this sample interaction.');
      (!name ? expenseName : expenseAmount).focus();
      return;
    }
    const row = document.createElement('article');
    row.className = 'expense-row';
    row.innerHTML = '<span class="expense-icon" aria-hidden="true">+</span><div><strong></strong><small>Sample entry · split equally</small></div><b></b>';
    row.querySelector('strong').textContent = name;
    row.querySelector('b').textContent = formatHkd(amount);
    expenseList.append(row);
    runningExpenseTotal += amount;
    expenseTotal.textContent = formatHkd(runningExpenseTotal);
    expenseName.value = '';
    expenseAmount.value = '';
    setStatus(`${name} added to this sample session. No expense was saved.`);
  });

  app.querySelector('[data-focus-expense]').addEventListener('click', () => {
    app.querySelector('#expense-name').focus();
    setStatus('Try a made-up shared expense — it will not be stored.');
  });

  app.querySelector('[data-plan-list]').addEventListener('click', (event) => {
    const plan = event.target.closest('.plan-row');
    if (!plan) return;
    const ready = plan.classList.toggle('is-ready');
    app.querySelector('[data-plan-callout]').textContent = ready ? `${plan.dataset.plan} is ready in this sample view.` : `Tap a plan to mark it ready together.`;
    setStatus(ready ? `${plan.dataset.plan} marked ready for this session.` : `${plan.dataset.plan} returned to the plans list.`);
  });
}

const resetButton = document.querySelector('[data-reset-demo]');
if (resetButton) {
  resetButton.addEventListener('click', () => window.location.reload());
}

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
