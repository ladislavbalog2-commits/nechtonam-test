(function () {
  'use strict';

  if (document.getElementById('ntnSiteControls')) return;

  var isApp = !!document.getElementById('app');
  var ntnUa = navigator.userAgent || '';
  var ntnIsIOS = /iPhone|iPad|iPod/i.test(ntnUa) || (navigator.platform === 'MacIntel' && Number(navigator.maxTouchPoints || 0) > 1);
  var ntnStandalone = !!navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  document.documentElement.classList.toggle('ntn-ios-browser', ntnIsIOS && !ntnStandalone);
  document.documentElement.classList.toggle('ntn-ios-standalone', ntnIsIOS && ntnStandalone);
  var appScreens = ['about', 'how', 'pricing', 'faq', 'contact', 'helpers', 'rules'];
  var root = document.createElement('div');
  root.id = 'ntnSiteControls';
  root.innerHTML = [
    '<div class="ntn-sitebar" role="banner">',
      '<button class="ntn-menu-trigger" id="ntnMenuTrigger" type="button" aria-label="Otevřít hlavní menu" aria-controls="ntnMenuPanel" aria-expanded="false">',
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
        '<span>Menu</span>',
      '</button>',
      '<a class="ntn-sitebar-brand" href="' + (isApp ? '#screen-intro' : '/') + '" aria-label="Nech to nám – úvod">',
        '<img src="assets/images/ntn-logo-clean-v122.png" alt="" width="1081" height="830">',
      '</a>',
      '<a class="ntn-account-trigger" id="ntnGlobalAccount" href="' + (isApp ? '#screen-account' : '/#screen-account') + '" aria-label="Můj účet">',
        '<span class="ntn-account-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 20c.7-4 3-6.1 6.5-6.1s5.8 2.1 6.5 6.1"/></svg></span>',
        '<span class="ntn-account-label" id="ntnGlobalAccountLabel">Můj účet</span>',
      '</a>',
    '</div>',
    '<div class="ntn-menu-backdrop" id="ntnMenuBackdrop" hidden></div>',
    '<aside class="ntn-menu-panel" id="ntnMenuPanel" aria-label="Hlavní menu" aria-hidden="true" tabindex="-1">',
      '<div class="ntn-menu-head">',
        '<a class="ntn-menu-brand" href="' + (isApp ? '#screen-intro' : '/') + '" data-menu-link>',
          '<img src="assets/images/ntn-logo-clean-v122.png" alt="" width="1081" height="830">',
          '<span><strong>Nech to nám</strong><small>Domácí pomoc na pár kliknutí</small></span>',
        '</a>',
        '<button class="ntn-menu-close" id="ntnMenuClose" type="button" aria-label="Zavřít menu">×</button>',
      '</div>',
      '<div class="ntn-menu-scroll">',
        '<a class="ntn-menu-order" href="' + (isApp ? '#screen-city' : '/#screen-city') + '" data-menu-link>',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.2 12 4l8 7.2V20h-5v-6H9v6H4Z"/></svg>',
          '<span><strong>Začít objednávku</strong><small>Vyberte si konkrétní domácí práce</small></span><b aria-hidden="true">›</b>',
        '</a>',
        '<nav class="ntn-menu-links" aria-label="Informace o službě">',
          '<p>Informace</p>',
          menuLink('how', 'Jak to funguje', 'Objednávka krok za krokem', iconSteps()),
          menuLink('pricing', 'Ceník', 'Ceny, minimum a prostředky', iconPrice()),
          menuLink('faq', 'Časté otázky', 'Rychlé odpovědi před objednáním', iconQuestion()),
          '<p>Kontakt a dokumenty</p>',
          menuLink('contact', 'Kontakt', 'Dotazy a kontaktní údaje', iconMail()),
          menuLink('helpers', 'Žádost o spolupráci', 'Staňte se naším pomocníkem', iconHelper()),
          '<a class="ntn-menu-link" href="/obchodni-podminky.php" data-menu-link><span class="ntn-menu-link-icon">' + iconDocument() + '</span><span><strong>Obchodní podmínky</strong><small>Úplná smluvní pravidla</small></span><b aria-hidden="true">›</b></a>',
          '<a class="ntn-menu-link" href="/reklamace-storno.php" data-menu-link><span class="ntn-menu-link-icon">' + iconShield() + '</span><span><strong>Reklamace a storno</strong><small>Řešení problémů a zrušení</small></span><b aria-hidden="true">›</b></a>',
          '<a class="ntn-menu-link" href="/ochrana-osobnich-udaju.php" data-menu-link><span class="ntn-menu-link-icon">' + iconLock() + '</span><span><strong>Ochrana osobních údajů</strong><small>Jak chráníme vaše údaje</small></span><b aria-hidden="true">›</b></a>',
        '</nav>',
        '<div class="ntn-menu-foot"><span class="ntn-menu-dot" aria-hidden="true"></span><span><strong>Klášterec nad Ohří</strong><small>Aktuálně dostupná oblast služby</small></span></div>',
      '</div>',
    '</aside>'
  ].join('');

  var style = document.createElement('style');
  style.id = 'ntnSiteControlsStyles';
  style.textContent = [
    ':root{--ntn-sitebar-h:calc(60px + env(safe-area-inset-top));--ntn-nav-gold:#d3a052;--ntn-nav-gold-light:#e2bf79;--ntn-nav-gold-deep:#8a5724;--ntn-nav-gold-ink:#000000;--ntn-nav-panel:#24252a;--ntn-nav-panel-low:#1d1e22;}',
    '#ntnSiteControls,#ntnSiteControls *{box-sizing:border-box;}',
    '#ntnSiteControls{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;}',
    '#ntnSiteControls .ntn-sitebar{position:fixed;z-index:1200;top:0;left:50%;transform:translateX(-50%);width:min(100%,820px);height:var(--ntn-sitebar-h);padding:calc(7px + env(safe-area-inset-top)) max(10px,env(safe-area-inset-right)) 7px max(10px,env(safe-area-inset-left));display:flex;align-items:center;justify-content:space-between;pointer-events:none;isolation:isolate;}',
    '#ntnSiteControls .ntn-sitebar::before{content:"";position:absolute;z-index:-1;inset:0;border-bottom:1px solid rgba(211,160,82,.22);background:linear-gradient(180deg,rgba(255,255,255,.022),transparent 48%),linear-gradient(180deg,rgba(36,37,42,.99),rgba(29,30,34,.98));box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 9px 25px rgba(0,0,0,.25);opacity:1;transition:opacity .18s ease;}',
    'body.ntn-global-intro #ntnSiteControls .ntn-sitebar::before{opacity:0;box-shadow:none;border-color:transparent;}',
    '#ntnSiteControls .ntn-menu-trigger,#ntnSiteControls .ntn-account-trigger{pointer-events:auto;min-height:46px;border:1px solid rgba(211,160,82,.62);color:#f5f1ea;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.01)),#1d1e22;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 -1px 0 rgba(0,0,0,.25),0 2px 0 rgba(72,47,25,.28),0 8px 20px rgba(0,0,0,.32);-webkit-tap-highlight-color:transparent;touch-action:manipulation;}',
    '#ntnSiteControls .ntn-menu-trigger{min-width:82px;padding:0 13px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:999px;font:850 14px/1 inherit;letter-spacing:.01em;cursor:pointer;flex:0 0 auto;}',
    '#ntnSiteControls .ntn-menu-trigger svg{width:21px;height:21px;fill:none;stroke:#e2bf79;stroke-width:2;stroke-linecap:round;filter:drop-shadow(0 2px 5px rgba(110,66,24,.18));}',
    '#ntnSiteControls .ntn-sitebar-brand{pointer-events:auto;position:absolute;z-index:1;left:50%;top:calc(7px + env(safe-area-inset-top));transform:translateX(-50%);width:76px;height:46px;display:grid;place-items:center;text-decoration:none;overflow:visible;}',
    '#ntnSiteControls .ntn-sitebar-brand img{display:block;width:72px;height:46px;max-width:72px;max-height:46px;object-fit:contain;object-position:center;}',
    '#ntnSiteControls .ntn-account-trigger{min-width:132px;max-width:158px;padding:4px 10px 4px 4px;display:inline-flex;align-items:center;gap:8px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:850;white-space:nowrap;overflow:hidden;flex:0 0 auto;justify-content:flex-start;}',
    '#ntnSiteControls .ntn-account-icon{width:36px;height:36px;min-width:36px;display:grid;place-items:center;border:2px solid #d3a052;border-radius:50%;color:#e2bf79;background:radial-gradient(circle at 34% 25%,rgba(226,191,121,.15),transparent 38%),linear-gradient(145deg,#2b2c31,#17181c 74%);box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 0 0 2px rgba(15,16,19,.78),0 4px 10px rgba(0,0,0,.28),0 0 12px rgba(196,134,56,.10);}',
    '#ntnSiteControls .ntn-account-icon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2.15;stroke-linecap:round;stroke-linejoin:round;}',
    '#ntnSiteControls .ntn-account-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '#ntnSiteControls .ntn-account-trigger.is-signed-in{border-color:rgba(79,214,143,.9);color:#f1fff7;background:linear-gradient(145deg,#1a6748,#124a35);box-shadow:inset 0 1px 0 rgba(255,255,255,.15),0 8px 22px rgba(0,0,0,.35),0 0 15px rgba(49,190,118,.18);}',
    '#ntnSiteControls .ntn-account-trigger.is-signed-in .ntn-account-icon{border-color:#7ae5ad;color:#fff;background:linear-gradient(145deg,#1fa56d,#0d7450);box-shadow:0 0 0 2px rgba(9,54,38,.55),0 0 14px rgba(67,220,142,.25);}',
    '#ntnSiteControls .ntn-menu-trigger:active,#ntnSiteControls .ntn-account-trigger:active{transform:scale(.975);}',
    '#ntnSiteControls .ntn-menu-trigger:focus-visible,#ntnSiteControls .ntn-account-trigger:focus-visible,#ntnSiteControls .ntn-menu-close:focus-visible,#ntnSiteControls .ntn-menu-link:focus-visible,#ntnSiteControls .ntn-menu-order:focus-visible{outline:3px solid rgba(234,190,124,.55);outline-offset:2px;}',
    '#introAccountButton{display:none!important;}',
    'html body #app .screen:not(#screen-intro){padding-top:var(--ntn-sitebar-h)!important;}',
    'html body #app .screen:not(#screen-intro)>.topbar,html body #app #screen-city>.city-premium-topbar{position:relative!important;top:auto!important;}',
    'html body #app .account-screen>.topbar{height:auto!important;min-height:136px!important;padding:8px 14px!important;grid-template-columns:44px minmax(0,1fr) 44px!important;overflow:visible!important;}',
    'html body #app .account-screen>.topbar .topbar-title{height:auto!important;min-height:106px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;overflow:visible!important;}',
    'html body #app .account-screen>.topbar .topbar-title::before{width:126px!important;height:97px!important;min-width:126px!important;min-height:97px!important;max-width:126px!important;max-height:97px!important;margin:0 auto 4px!important;border-radius:0!important;box-shadow:none!important;}',
    'html body #app .account-screen>.topbar .topbar-title strong{font-size:15px!important;line-height:1.05!important;}',
    'html body #app .account-screen>.topbar .topbar-title span{font-size:13px!important;line-height:1.05!important;}',
    'html body #app #screen-account>.account-topbar{height:auto!important;min-height:160px!important;padding:10px 14px!important;overflow:visible!important;}',
    'html body #app #screen-account>.account-topbar .topbar-title{height:auto!important;min-height:126px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;overflow:visible!important;}',
    'html body #app #screen-account>.account-topbar .topbar-title::before{width:158px!important;height:121px!important;min-width:158px!important;min-height:121px!important;max-width:158px!important;max-height:121px!important;margin:0 auto!important;border-radius:0!important;box-shadow:none!important;}',
    'html body #app #screen-account>.account-topbar .topbar-title strong,html body #app #screen-account>.account-topbar .topbar-title span{display:none!important;}',
    'html body #app #screen-account>.account-clean-page{padding-top:18px!important;}',
    'html body.ntn-info-active .cart-bar,html body.ntn-info-active .minimum-order-dock,html body.ntn-info-active .app-room-action,html body.ntn-info-active .account-bottom-nav{display:none!important;}',
    '#ntnSiteControls .ntn-menu-backdrop{position:fixed;z-index:1290;inset:0;background:rgba(0,0,0,.68);opacity:0;transition:opacity .2s ease;}',
    '#ntnSiteControls .ntn-menu-backdrop[hidden]{display:none!important;}',
    '#ntnSiteControls .ntn-menu-panel{position:fixed;z-index:1300;top:0;left:max(0px,calc((100vw - 820px)/2));width:min(390px,calc(100vw - 12px));height:100vh;height:100dvh;display:flex;flex-direction:column;color:#f5f1ea;background:radial-gradient(circle at 20% 0,rgba(211,160,82,.075),transparent 27%),linear-gradient(160deg,#292a30,#1b1c20 68%,#141519);border-right:1px solid rgba(211,160,82,.28);box-shadow:inset -1px 0 0 rgba(255,255,255,.02),22px 0 60px rgba(0,0,0,.46);transform:translateX(-105%);transition:transform .24s cubic-bezier(.2,.75,.25,1);overflow:hidden;visibility:hidden;}',
    '#ntnSiteControls .ntn-menu-panel[aria-hidden="false"]{transform:translateX(0);visibility:visible;}',
    '#ntnSiteControls .ntn-menu-head{min-height:calc(78px + env(safe-area-inset-top));padding:calc(12px + env(safe-area-inset-top)) 14px 12px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(222,178,112,.18);}',
    '#ntnSiteControls .ntn-menu-brand{min-width:0;flex:1;display:flex;align-items:center;gap:11px;color:#f6efe5;text-decoration:none;}',
    '#ntnSiteControls .ntn-menu-brand img{width:52px;height:52px;flex:0 0 52px;object-fit:contain;filter:brightness(1.06);}',
    '#ntnSiteControls .ntn-menu-brand span{min-width:0;}',
    '#ntnSiteControls .ntn-menu-brand strong{display:block;font:700 19px/1.1 Georgia,"Times New Roman",serif;}',
    '#ntnSiteControls .ntn-menu-brand small{display:block;margin-top:4px;color:#aaa49c;font-size:13px;line-height:1.2;}',
    '#ntnSiteControls .ntn-menu-close{width:46px;height:46px;flex:0 0 46px;border:1px solid rgba(222,178,112,.38);border-radius:50%;color:#f4d9b3;background:#202126;font:400 30px/1 Arial;cursor:pointer;}',
    '#ntnSiteControls .ntn-menu-scroll{min-height:0;flex:1;padding:14px 12px calc(24px + env(safe-area-inset-bottom));overflow-y:auto;overscroll-behavior:contain;}',
    '#ntnSiteControls .ntn-menu-order{min-height:72px;margin:0 0 18px;padding:11px 12px;display:grid;grid-template-columns:44px minmax(0,1fr) 20px;align-items:center;gap:11px;border:1px solid rgba(240,217,164,.58);border-radius:19px;color:var(--ntn-nav-gold-ink)!important;-webkit-text-fill-color:var(--ntn-nav-gold-ink)!important;text-shadow:none!important;background:linear-gradient(180deg,rgba(255,255,255,.22),transparent 39%),linear-gradient(135deg,#a56527 0%,#cd9344 36%,#e5c27d 52%,#b6722b 75%,#d2a052 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.34),inset 0 -2px 0 rgba(86,51,20,.34),0 3px 0 rgba(91,57,25,.66),0 11px 26px rgba(0,0,0,.28);text-decoration:none;}',
    '#ntnSiteControls .ntn-menu-order svg{width:31px;height:31px;justify-self:center;color:var(--ntn-nav-gold-ink)!important;fill:none;stroke:var(--ntn-nav-gold-ink)!important;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;}',
    '#ntnSiteControls .ntn-menu-order strong{display:block;color:var(--ntn-nav-gold-ink)!important;-webkit-text-fill-color:var(--ntn-nav-gold-ink)!important;text-shadow:none!important;font-size:19px;line-height:1.15;}',
    '#ntnSiteControls .ntn-menu-order small{display:block;margin-top:4px;color:var(--ntn-nav-gold-ink)!important;-webkit-text-fill-color:var(--ntn-nav-gold-ink)!important;text-shadow:none!important;opacity:1!important;font-size:13px;line-height:1.25;}',
    '#ntnSiteControls .ntn-menu-order b{color:var(--ntn-nav-gold-ink)!important;-webkit-text-fill-color:var(--ntn-nav-gold-ink)!important;text-shadow:none!important;font-size:30px;font-weight:400;}',
    '#ntnSiteControls .ntn-menu-links>p{margin:18px 8px 8px;color:#d3a052;font-size:13px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;}',
    '#ntnSiteControls .ntn-menu-link{min-height:62px;padding:8px 9px;display:grid;grid-template-columns:42px minmax(0,1fr) 18px;align-items:center;gap:10px;border-radius:15px;color:#f3efe8;text-decoration:none;-webkit-tap-highlight-color:transparent;}',
    '#ntnSiteControls .ntn-menu-link:hover,#ntnSiteControls .ntn-menu-link:active{background:rgba(255,255,255,.055);}',
    '#ntnSiteControls .ntn-menu-link-icon{width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(211,160,82,.27);border-radius:13px;color:#e2bf79;background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.01)),#24252a;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 5px 12px rgba(0,0,0,.16);}',
    '#ntnSiteControls .ntn-menu-link-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;}',
    '#ntnSiteControls .ntn-menu-link span:nth-child(2){min-width:0;}',
    '#ntnSiteControls .ntn-menu-link strong{display:block;font-size:17px;line-height:1.2;}',
    '#ntnSiteControls .ntn-menu-link small{display:block;margin-top:3px;color:#aaa49c;font-size:13px;line-height:1.25;}',
    '#ntnSiteControls .ntn-menu-link b{color:#d3a052;font-size:22px;font-weight:400;}',
    '#ntnSiteControls .ntn-menu-foot{margin:20px 6px 0;padding:14px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.09);border-radius:15px;background:rgba(0,0,0,.14);}',
    '#ntnSiteControls .ntn-menu-dot{width:11px;height:11px;flex:0 0 11px;border-radius:50%;background:#33c77a;box-shadow:0 0 0 5px rgba(51,199,122,.1),0 0 12px rgba(51,199,122,.5);}',
    '#ntnSiteControls .ntn-menu-foot strong{display:block;font-size:15px;}',
    '#ntnSiteControls .ntn-menu-foot small{display:block;margin-top:2px;color:#9f9b95;font-size:13px;}',
    'html.ntn-menu-open,html.ntn-menu-open body{overflow:hidden!important;}',
    'html.ntn-menu-open #ntnSiteControls .ntn-menu-backdrop{opacity:1;}',
    'body.ntn-standalone-page{padding-top:var(--ntn-sitebar-h)!important;}',
    'body.ntn-standalone-page .legal-shell{padding-top:24px!important;}',
    '@media(max-width:430px){#ntnSiteControls .ntn-sitebar{padding-left:max(9px,env(safe-area-inset-left));padding-right:max(9px,env(safe-area-inset-right));}#ntnSiteControls .ntn-menu-trigger{min-width:74px;padding-inline:10px;gap:7px;font-size:14px;}#ntnSiteControls .ntn-account-trigger{min-width:118px;max-width:126px;padding:3px 9px 3px 3px;gap:6px;font-size:13.5px;overflow:hidden;}#ntnSiteControls .ntn-account-label{min-width:0;overflow:hidden;text-overflow:ellipsis;}#ntnSiteControls .ntn-account-icon{width:32px;height:32px;min-width:32px;}#ntnSiteControls .ntn-account-icon svg{width:20px;height:20px;}#ntnSiteControls .ntn-sitebar-brand{width:64px;height:44px;}#ntnSiteControls .ntn-sitebar-brand img{width:62px;height:44px;max-width:62px;max-height:44px;}}',
    '@media(max-width:350px){#ntnSiteControls .ntn-menu-trigger{min-width:68px;padding-inline:8px;font-size:13px;}#ntnSiteControls .ntn-account-trigger{min-width:112px;max-width:116px;font-size:13px;}#ntnSiteControls .ntn-sitebar-brand{width:56px;}#ntnSiteControls .ntn-sitebar-brand img{width:54px;max-width:54px;}}',
    '@media(prefers-reduced-motion:reduce){#ntnSiteControls .ntn-sitebar::before,#ntnSiteControls .ntn-menu-backdrop,#ntnSiteControls .ntn-menu-panel{transition:none!important;}}',
    '@media print{#ntnSiteControls{display:none!important;}body.ntn-standalone-page{padding-top:0!important;}}',
    'html.ntn-android-device #ntnSiteControls .ntn-sitebar::before,html.ntn-android-device #ntnSiteControls .ntn-menu-trigger,html.ntn-android-device #ntnSiteControls .ntn-account-trigger{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}',
    'html.ntn-android-wide-viewport:not(.ntn-tablet-device) #ntnSiteControls .ntn-sitebar{left:0;right:auto;transform:none;width:var(--ntn-android-device-width);zoom:var(--ntn-android-layout-scale,1);}',
    'html.ntn-android-wide-viewport:not(.ntn-tablet-device) #ntnSiteControls .ntn-menu-backdrop{width:var(--ntn-android-device-width);height:var(--ntn-menu-device-height,100dvh);zoom:var(--ntn-android-layout-scale,1);}',
    'html.ntn-android-wide-viewport:not(.ntn-tablet-device) #ntnSiteControls .ntn-menu-panel{left:0;width:min(360px,var(--ntn-android-device-width));height:var(--ntn-menu-device-height,100dvh);zoom:var(--ntn-android-layout-scale,1);}',
    'html.ntn-android-wide-viewport:not(.ntn-tablet-device) body #app .ntn-corporate-screen{width:var(--ntn-android-device-width)!important;max-width:var(--ntn-android-device-width)!important;zoom:var(--ntn-android-layout-scale,1);transform-origin:top left!important;}'
  ].join('');

  document.head.appendChild(style);
  document.body.appendChild(root);

  var trigger = document.getElementById('ntnMenuTrigger');
  var close = document.getElementById('ntnMenuClose');
  var panel = document.getElementById('ntnMenuPanel');
  var backdrop = document.getElementById('ntnMenuBackdrop');
  var account = document.getElementById('ntnGlobalAccount');
  var accountLabel = document.getElementById('ntnGlobalAccountLabel');
  var lastFocus = null;
  var closeTimer = 0;

  function targetFor(screen) {
    return isApp ? '#screen-' + screen : '/#screen-' + screen;
  }

  function menuLink(screen, title, description, icon) {
    return '<a class="ntn-menu-link" href="' + targetFor(screen) + '" data-menu-link><span class="ntn-menu-link-icon">' + icon + '</span><span><strong>' + title + '</strong><small>' + description + '</small></span><b aria-hidden="true">›</b></a>';
  }

  function iconPeople() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.8 19c.5-3.5 2.3-5.4 5.2-5.4s4.7 1.9 5.2 5.4M15 6.5a2.6 2.6 0 0 1 0 5.1M16 14c2.3.4 3.7 2.1 4.2 5"/></svg>'; }
  function iconSteps() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="8" cy="19" r="2"/><path d="m8 6 6.1 4.2M16.4 13.5l-5.8 4"/></svg>'; }
  function iconPrice() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5 10.5 3H20v9.5L13.5 19 4 9.5Z"/><circle cx="15.7" cy="7.3" r="1.2"/><path d="m8 12 4 4"/></svg>'; }
  function iconQuestion() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 1 1 3.6 2.25c-.8.4-1.3.9-1.3 1.75M12 17h.01"/></svg>'; }
  function iconMail() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>'; }
  function iconHelper() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3"/><path d="M3.5 20c.5-4 2.5-6.2 5.5-6.2 1.6 0 2.9.6 3.8 1.7M17 11v8M13 15h8"/></svg>'; }
  function iconShield() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5.2-3.1 8.4-8 10-4.9-1.6-8-4.8-8-10V6Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>'; }
  function iconDocument() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></svg>'; }
  function iconLock() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>'; }

  function syncDeviceHeight() {
    var ua = navigator.userAgent || '';
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && Number(navigator.maxTouchPoints || 0) > 1);
    var editableFocused = document.activeElement && document.activeElement.matches && document.activeElement.matches('input, select, textarea, [contenteditable="true"]');
    if (isIOS && editableFocused) return;
    var scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ntn-android-layout-scale')) || 1;
    var height = Math.max(320, (window.innerHeight || document.documentElement.clientHeight || 640) / scale);
    document.documentElement.style.setProperty('--ntn-menu-device-height', height.toFixed(2) + 'px');
  }

  function currentScreen() {
    var name = document.body.dataset.screen || '';
    if (!name && isApp) {
      var active = document.querySelector('.screen.active[data-screen]');
      name = active ? active.dataset.screen : 'intro';
    }
    return name;
  }

  function syncScreenClasses() {
    var name = currentScreen();
    document.body.classList.toggle('ntn-global-intro', isApp && name === 'intro');
    document.body.classList.toggle('ntn-info-active', appScreens.indexOf(name) !== -1);
    if (!isApp) document.body.classList.add('ntn-standalone-page');
  }

  function openMenu() {
    window.clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('ntn-menu-open');
    requestAnimationFrame(function () {
      try { panel.focus({ preventScroll: true }); } catch (_) { panel.focus(); }
    });
  }

  function closeMenu(restoreFocus) {
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('ntn-menu-open');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () { backdrop.hidden = true; }, 220);
    if (restoreFocus !== false && lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus({ preventScroll: true }); } catch (_) { lastFocus.focus(); }
    }
  }

  function displayName(user) {
    var fullName = String(user && user.fullName || '').trim();
    if (fullName) return fullName;
    var email = String(user && user.email || '');
    return email.indexOf('@') > 0 ? email.split('@')[0] : 'Můj účet';
  }

  function updateAuth(payload) {
    var signedIn = !!(payload && payload.authenticated && payload.user);
    if (signedIn) {
      var fullName = displayName(payload.user);
      var firstName = fullName.split(/\s+/)[0] || 'Účet';
      account.classList.add('is-signed-in');
      accountLabel.textContent = firstName;
      account.setAttribute('aria-label', 'Můj účet – přihlášený uživatel ' + fullName);
      account.title = 'Přihlášen: ' + fullName;
    } else {
      account.classList.remove('is-signed-in');
      accountLabel.textContent = 'Můj účet';
      account.setAttribute('aria-label', 'Můj účet');
      account.removeAttribute('title');
    }
  }

  function refreshStandaloneAuth() {
    if (isApp) return;
    fetch('/api/account.php?action=me', { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (payload) { if (payload) updateAuth(payload); })
      .catch(function () {});
  }

  window.NTNGlobalNav = { updateAuth: updateAuth, close: closeMenu };
  window.addEventListener('ntn:auth-changed', function (event) { updateAuth(event.detail || {}); });
  if (window.NTNAuthSnapshot) updateAuth(window.NTNAuthSnapshot);

  trigger.addEventListener('click', openMenu);
  close.addEventListener('click', function () { closeMenu(true); });
  backdrop.addEventListener('click', function () { closeMenu(true); });
  panel.addEventListener('click', function (event) {
    if (event.target.closest('[data-menu-link]')) closeMenu(false);
  });
  document.addEventListener('keydown', function (event) {
    if (panel.getAttribute('aria-hidden') !== 'false') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = Array.prototype.slice.call(panel.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  if (isApp) {
    var observer = new MutationObserver(syncScreenClasses);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-screen'] });
  }
  window.addEventListener('resize', syncDeviceHeight, { passive: true });
  window.addEventListener('orientationchange', function () { window.setTimeout(syncDeviceHeight, 140); }, { passive: true });
  window.addEventListener('pageshow', function (event) {
    syncDeviceHeight();
    syncScreenClasses();
    if (event.persisted) refreshStandaloneAuth();
  }, { passive: true });

  syncDeviceHeight();
  syncScreenClasses();
  refreshStandaloneAuth();
})();
