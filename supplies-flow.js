(function () {
  'use strict';

  var answers = Object.create(null);
  var suppliesConfirmed = false;
  var onSuppliesScreen = false;

  function selectedTaskIds() {
    return Array.prototype.map.call(
      document.querySelectorAll('.app-add-toggle:checked'),
      function (input) { return input.id || ''; }
    );
  }

  function equipmentFor(taskIds, wholePackage) {
    var needsVacuum = !!wholePackage;
    var needsMop = !!wholePackage;
    var needsBroom = !!wholePackage;

    taskIds.forEach(function (id) {
      if (/-vacuum$/.test(id) || /-sofa$/.test(id)) needsVacuum = true;
      if (/-mop$/.test(id) || /-floor$/.test(id)) {
        needsMop = true;
        needsBroom = true;
      }
      if (/-sweep$/.test(id)) needsBroom = true;
    });

    var equipment = [];
    if (needsVacuum) equipment.push({ id: 'vacuum', label: 'Vysavač' });
    if (needsMop) equipment.push({ id: 'mop', label: 'Mop a kýbl' });
    if (needsBroom) equipment.push({ id: 'broom', label: 'Koště a lopatka' });
    return equipment;
  }

  function currentEquipment() {
    return equipmentFor(
      selectedTaskIds(),
      document.body.classList.contains('ntn-whole-package-active')
    );
  }

  function elements() {
    return {
      panel: document.getElementById('ntnEquipmentPanel'),
      list: document.getElementById('ntnEquipmentList'),
      empty: document.getElementById('ntnEquipmentEmpty'),
      validation: document.getElementById('ntnEquipmentValidation'),
      continueButton: document.getElementById('confirmSuppliesChoice'),
      summaryRecap: document.getElementById('summaryEquipmentRecap'),
      modal: document.getElementById('ntnSuppliesModal'),
      modalConfirm: document.getElementById('ntnSuppliesModalConfirm')
    };
  }

  function renderSummaryRecap(ui, equipment) {
    if (!ui.summaryRecap) return;
    var heading = document.createElement('strong');
    heading.className = 'ntn-v106-equipment-recap-title';
    heading.textContent = 'Vybavení doma';
    ui.summaryRecap.replaceChildren(heading);

    if (!equipment.length) {
      var emptyRow = document.createElement('div');
      var emptyLabel = document.createElement('span');
      var emptyStatus = document.createElement('b');
      emptyRow.className = 'ntn-v106-equipment-recap-row';
      emptyLabel.textContent = 'Pro vybrané práce';
      emptyStatus.className = 'is-ready';
      emptyStatus.textContent = 'NENÍ POTŘEBA';
      emptyRow.appendChild(emptyLabel);
      emptyRow.appendChild(emptyStatus);
      ui.summaryRecap.appendChild(emptyRow);
      return;
    }

    equipment.forEach(function (item) {
      var row = document.createElement('div');
      var label = document.createElement('span');
      var status = document.createElement('b');
      var answer = answers[item.id];
      row.className = 'ntn-v106-equipment-recap-row';
      label.textContent = item.label;
      status.className = answer === 'missing' ? 'is-missing' : (answer === 'have' ? 'is-ready' : 'is-unanswered');
      status.textContent = answer === 'missing' ? 'NEMÁM' : (answer === 'have' ? 'MÁM' : 'NEVYPLNĚNO');
      row.appendChild(label);
      row.appendChild(status);
      ui.summaryRecap.appendChild(row);
    });
  }

  function makeAnswerButton(item, status, label, symbol) {
    var selected = answers[item.id] === status;
    var button = document.createElement('button');
    var mark = document.createElement('span');
    var text = document.createElement('span');

    button.type = 'button';
    button.className = 'ntn-equipment-answer ntn-equipment-answer-' + status;
    button.dataset.equipmentId = item.id;
    button.dataset.equipmentAnswer = status;
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    button.setAttribute('aria-label', item.label + ': ' + label);
    button.classList.toggle('selected', selected);

    mark.className = 'ntn-equipment-answer-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = symbol;
    text.textContent = label;
    button.appendChild(mark);
    button.appendChild(text);
    return button;
  }

  function makeEquipmentRow(item) {
    var row = document.createElement('li');
    var name = document.createElement('strong');
    var choices = document.createElement('div');

    row.className = 'ntn-equipment-row';
    row.dataset.equipmentRow = item.id;
    name.className = 'ntn-equipment-name';
    name.textContent = item.label;
    choices.className = 'ntn-equipment-choices';
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-label', item.label);
    choices.appendChild(makeAnswerButton(item, 'have', 'MÁM', '✓'));
    choices.appendChild(makeAnswerButton(item, 'missing', 'NEMÁM', '!'));
    row.appendChild(name);
    row.appendChild(choices);
    return row;
  }

  function setContinueState(ui, allowed) {
    if (!ui.continueButton) return;
    ui.continueButton.classList.toggle('ntn-equipment-blocked', !allowed);
    ui.continueButton.setAttribute('aria-disabled', allowed ? 'false' : 'true');
  }

  function renderEquipment() {
    var ui = elements();
    if (!ui.panel || !ui.list || !ui.empty || !ui.validation) return;

    var equipment = currentEquipment();
    var required = Object.create(null);
    equipment.forEach(function (item) { required[item.id] = true; });
    Object.keys(answers).forEach(function (id) {
      if (!required[id]) delete answers[id];
    });

    ui.list.replaceChildren();
    equipment.forEach(function (item) {
      ui.list.appendChild(makeEquipmentRow(item));
    });

    var unanswered = equipment.filter(function (item) { return !answers[item.id]; });
    var hasEquipment = equipment.length > 0;
    ui.list.hidden = !hasEquipment;
    ui.empty.hidden = hasEquipment;
    if (!hasEquipment || unanswered.length === 0) ui.validation.hidden = true;
    setContinueState(ui, !hasEquipment || unanswered.length === 0);
    renderSummaryRecap(ui, equipment);
  }

  function chooseAnswer(button) {
    var id = button.dataset.equipmentId || '';
    var status = button.dataset.equipmentAnswer || '';
    if (!id || (status !== 'have' && status !== 'missing')) return;
    answers[id] = status;
    var ui = elements();
    if (ui.validation) ui.validation.hidden = true;
    renderEquipment();
  }

  function openSuppliesModal() {
    var ui = elements();
    if (!ui.modal || !ui.modalConfirm || !ui.modal.hidden) return;
    ui.modal.hidden = false;
    document.body.classList.add('ntn-supplies-modal-open');
    requestAnimationFrame(function () {
      ui.modalConfirm.focus({ preventScroll: true });
    });
  }

  function closeSuppliesModal(moveFocus) {
    var ui = elements();
    if (!ui.modal || ui.modal.hidden) return;
    ui.modal.hidden = true;
    document.body.classList.remove('ntn-supplies-modal-open');
    if (!moveFocus) return;
    requestAnimationFrame(function () {
      var firstAnswer = ui.list && ui.list.querySelector('.ntn-equipment-answer');
      var target = firstAnswer || ui.continueButton;
      if (target) target.focus({ preventScroll: true });
    });
  }

  function currentScreenName() {
    return String(document.body.dataset.screen || '').replace(/^screen-/, '');
  }

  function isSuppliesScreen() {
    var screenName = currentScreenName();
    if (screenName) return screenName === 'supplies-choice';
    return location.hash === '#screen-supplies-choice';
  }

  function syncSuppliesModal() {
    var isCurrent = isSuppliesScreen();
    var screenName = currentScreenName();

    if (isCurrent && !onSuppliesScreen) {
      /* v300: Volba čisticích prostředků se zobrazí vždy.
         Stránka s mopem/koštětem/vysavačem se řeší až PO potvrzení této volby. */
      onSuppliesScreen = true;
      if (!suppliesConfirmed) openSuppliesModal();
      return;
    }

    if (!isCurrent && onSuppliesScreen) {
      onSuppliesScreen = false;
      closeSuppliesModal(false);
    }

    if (!isCurrent && (screenName === 'intro' || screenName === 'city' || screenName === 'order-method')) {
      suppliesConfirmed = false;
    }
  }

  function goToScreen(name) {
    if (typeof window.__ntnForceVisible === 'function') window.__ntnForceVisible(name);
    else if (typeof window.__ntnShowScreen === 'function') window.__ntnShowScreen(name);
    else location.hash = '#screen-' + name;
  }

  function confirmSupplies() {
    suppliesConfirmed = true;
    var needsEquipment = currentEquipment().length > 0;
    closeSuppliesModal(!needsEquipment);

    /* v300:
       - jen čisticí prostředky, žádný mop/koště/vysavač -> rovnou termín
       - vybavení je potřeba -> zůstane stránka "Co připravit doma" a MÁM/NEMÁM */
    if (!needsEquipment) {
      onSuppliesScreen = false;
      goToScreen('schedule');
    } else {
      renderEquipment();
      var ui = elements();
      if (ui.panel) ui.panel.scrollIntoView({ block: 'start' });
    }
  }

  function guardContinue(event) {
    var button = event.target.closest && event.target.closest('#confirmSuppliesChoice');
    if (!button) return;

    var unanswered = currentEquipment().filter(function (item) { return !answers[item.id]; });
    if (!unanswered.length) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();

    var ui = elements();
    ui.validation.hidden = false;
    ui.panel.classList.remove('ntn-equipment-needs-attention');
    void ui.panel.offsetWidth;
    ui.panel.classList.add('ntn-equipment-needs-attention');
    ui.panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var firstChoice = ui.list.querySelector('[data-equipment-row="' + unanswered[0].id + '"] .ntn-equipment-answer');
    if (firstChoice) firstChoice.focus({ preventScroll: true });
  }

  function trapModalKeyboard(event) {
    var ui = elements();
    if (!ui.modal || ui.modal.hidden) return;

    var card = event.target.closest && event.target.closest('.ntn-supplies-modal .supplies-choice-card');
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      card.click();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      return;
    }
    if (event.key !== 'Tab') return;

    var focusable = Array.prototype.slice.call(
      ui.modal.querySelectorAll('.supplies-choice-card, .ntn-supplies-modal-confirm')
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  window.__ntnEquipmentStatusForOrder = function () {
    return currentEquipment().map(function (item) {
      return {
        id: item.id,
        label: item.label,
        status: answers[item.id] === 'missing' ? 'missing' : 'have'
      };
    }).filter(function (item) { return !!answers[item.id]; });
  };



  document.addEventListener('click', guardContinue, true);
  document.addEventListener('click', function (event) {
    var answer = event.target.closest && event.target.closest('[data-equipment-answer]');
    if (answer) chooseAnswer(answer);
    if (event.target.closest && event.target.closest('#ntnSuppliesModalConfirm')) confirmSupplies();
  });
  document.addEventListener('click', function (event) {
    var ui = elements();
    if (ui.modal && !ui.modal.hidden && event.target === ui.modal) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  document.addEventListener('keydown', trapModalKeyboard);
  document.addEventListener('change', function (event) {
    if (event.target.classList && event.target.classList.contains('app-add-toggle')) renderEquipment();
  });
  window.addEventListener('hashchange', function () {
    renderEquipment();
    syncSuppliesModal();
  });

  if (typeof MutationObserver === 'function') {
    new MutationObserver(function () {
      renderEquipment();
      syncSuppliesModal();
    }).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-screen'] });
  }

  function start() {
    renderEquipment();
    syncSuppliesModal();
    var summaryGroups = document.getElementById('summaryGroups');
    if (summaryGroups && typeof MutationObserver === 'function') {
      new MutationObserver(function () { renderEquipment(); })
        .observe(summaryGroups, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
