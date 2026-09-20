(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app || document.documentElement.classList.contains('ntn-v142-scenes-ready')) return;

  var sceneCopy = {
    roses: 'Váš domov v dobrých rukou',
    towel: 'Profesionální péče pro váš domov',
    notebook: 'Váš čas je cenný',
    'single-rose': 'Péče, která potěší',
    bouquet: 'Krásnější domov začíná tady'
  };

  function pickScene(id, choices) {
    var score = 0;
    for (var i = 0; i < id.length; i += 1) score += id.charCodeAt(i);
    return choices[score % choices.length];
  }

  function sceneFor(screen) {
    var id = screen.id || '';

    if (id === 'screen-city') return 'roses';
    if (id === 'screen-property') return 'bouquet';
    if (id === 'screen-supplies-choice') return 'towel';
    if (id === 'screen-summary') return 'roses';
    if (id === 'screen-schedule') return 'notebook';
    if (id === 'screen-details') return 'bouquet';
    if (id === 'screen-payment') return 'roses';
    if (id === 'screen-confirmation') return 'roses';
    if (screen.classList.contains('room-selection-screen')) return 'bouquet';
    if (screen.classList.contains('order-method-screen')) return 'single-rose';
    if (screen.classList.contains('room-package-menu-screen')) return 'towel';
    if (screen.classList.contains('whole-property-screen')) return 'bouquet';
    if (screen.classList.contains('app-room-screen')) {
      return pickScene(id, ['roses', 'towel', 'single-rose', 'notebook']);
    }
    if (screen.classList.contains('app-info-screen')) {
      return pickScene(id, ['single-rose', 'bouquet', 'notebook', 'roses']);
    }
    if (screen.classList.contains('account-screen')) return 'notebook';
    if (screen.classList.contains('ntn-corporate-screen')) {
      return pickScene(id, ['single-rose', 'bouquet']);
    }
    return pickScene(id, ['roses', 'single-rose', 'bouquet']);
  }

  function copyFor(screen, scene) {
    var id = screen.id || '';
    if (id === 'screen-property') return 'Každý domov si zaslouží péči';
    if (screen.classList.contains('room-selection-screen')) return 'Čistý domov, klidná mysl';
    if (screen.classList.contains('app-room-screen')) return 'Drobnosti, které dělají velký rozdíl';
    if (id === 'screen-supplies-choice') return 'Profesionální péče pro váš domov';
    if (id === 'screen-summary') return 'Všechno přehledně na jednom místě';
    if (id === 'screen-details') return 'Blíž k vám';
    if (id === 'screen-payment') return 'Jednoduše a bezpečně';
    if (id === 'screen-confirmation') return 'Odpočinek začíná právě teď';
    return sceneCopy[scene];
  }

  app.querySelectorAll('.screen:not(#screen-intro)').forEach(function (screen) {
    /* Tyto stránky již mají vlastní aktuální podklad. Starou dekoraci nevytvářet. */
    if (screen.classList.contains('app-room-screen') ||
        screen.classList.contains('room-selection-screen') ||
        screen.id === 'screen-city' || screen.id === 'screen-property') return;
    if (screen.querySelector(':scope > .ntn-v142-decor')) return;

    var scene = sceneFor(screen);
    var decor = document.createElement('div');
    decor.className = 'ntn-v142-decor ntn-v142-decor--' + scene;
    decor.setAttribute('aria-hidden', 'true');

    var copy = document.createElement('span');
    copy.className = 'ntn-v142-decor__copy';
    copy.textContent = copyFor(screen, scene);
    decor.appendChild(copy);

    screen.insertBefore(decor, screen.firstChild);
    screen.classList.add('ntn-v142-screen');
  });

  /* Immediate visual feedback for equipment buttons; the original ordering
     state and validation continue to be owned by supplies-flow.js. */
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('#screen-supplies-choice .ntn-equipment-answer');
    if (!button) return;
    var group = button.closest('.ntn-equipment-choices');
    if (!group) return;
    group.querySelectorAll('.ntn-equipment-answer').forEach(function (item) {
      var selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }, true);

  document.documentElement.classList.add('ntn-v142-scenes-ready');
})();
