(() => {
  'use strict';

  const modal = document.getElementById('ntnMinimumModal');
  const closeButton = modal?.querySelector('.ntn-minimum-modal-close');
  if (!modal || !closeButton) return;

  let openingButton = null;

  const openModal = button => {
    if (!modal.hidden) return;
    openingButton = button;
    modal.hidden = false;
    document.body.classList.add('ntn-minimum-modal-open');
    requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
  };

  const closeModal = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('ntn-minimum-modal-open');
    try { openingButton?.focus({ preventScroll: true }); } catch (_) { openingButton?.focus(); }
    openingButton = null;
  };

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.minimum-gate-disabled');
    if (!button) return;
    event.preventDefault();
    openModal(button);
  }, true);

  closeButton.addEventListener('click', event => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    event.preventDefault();
    event.stopPropagation();
  });

  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });
})();
