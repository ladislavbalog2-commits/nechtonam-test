
(function(){
  'use strict';

  var TABS={
    kitchen:['Běžný úklid','Spotřebiče','Podlaha'],
    bathroom:['Běžný úklid','Sanita','Podlaha'],
    toilet:['Běžný úklid','Sanita','Podlaha'],
    living:['Běžný úklid','Nábytek','Podlaha'],
    bedroom:['Běžný úklid','Postel','Podlaha'],
    kids:['Běžný úklid','Nábytek','Podlaha'],
    hallway:['Běžný úklid','Detaily','Podlaha'],
    balcony:['Běžný úklid','Detaily','Podlaha'],
    stairs:['Běžný úklid','Detaily','Podlaha'],
    extra:['Běžný úklid','Detaily','Podlaha']
  };

  function roomKey(screen){ return String(screen.dataset.screen||'').replace(/^room-/,'') || 'room'; }

  function category(room, key, title){
    var s=(String(key).replace(/^[^-]+-/,'')+' '+title).toLowerCase();
    if(/podlah|floor|mop|vytř|vysát|vacuum|koberec/.test(s)) return 'Podlaha';
    if(room==='kitchen') return /troub|oven|mikrovln|lednic|fridge|spor|varná|hob|spotřeb/.test(s) ? 'Spotřebiče' : 'Běžný úklid';
    if(room==='bathroom'||room==='toilet') return /umyvad|basin|vana|bath|sprch|shower|wc|toilet|zrcadl|mirror|obklad|tiles/.test(s) ? 'Sanita' : 'Běžný úklid';
    if(room==='bedroom') return /postel|bed|linen|povleč/.test(s) ? 'Postel' : 'Běžný úklid';
    if(room==='living'||room==='kids') return /sofa|gauč|stůl|desk|skl|glass|window|okn|hračk|toy|tidy|nábyt|komod|polic/.test(s) ? 'Nábytek' : 'Běžný úklid';
    return /rail|zábrad|mirror|zrcadl|door|dveř|shoe|bot|dust|prach|furniture|nábyt/.test(s) ? 'Detaily' : 'Běžný úklid';
  }

  var categoryBars=new WeakMap();
  var categoryLayer=null;
  var categoryOwner=null;

  function categoryBar(screen){
    return categoryBars.get(screen) || screen.querySelector('.v267-room-tabs');
  }

  function currentTaskScreen(){
    var name=document.body.dataset.screen || '';
    if(!/^room-/.test(name)){
      var match=location.hash.match(/^#(?:screen-room-|task-)([a-z0-9]+)/i);
      if(!match) return null;
      name='room-'+match[1];
    }
    var screen=document.getElementById('screen-'+name);
    return screen && screen.classList.contains('app-room-screen') && screen.getClientRects().length ? screen : null;
  }

  function showCategoryBar(screen){
    if(categoryOwner && categoryOwner!==screen){
      var previous=categoryBar(categoryOwner);
      var holder=categoryOwner.querySelector('.v277-category-holder');
      if(previous && holder){previous.classList.remove('is-pinned');holder.appendChild(previous);}
    }
    categoryOwner=screen;
    document.body.classList.toggle('ntn-task-categories-visible',!!screen);
    if(!categoryLayer){
      if(!screen) return;
      categoryLayer=document.createElement('div');
      categoryLayer.id='ntnTaskCategories';
      document.body.appendChild(categoryLayer);
    }
    categoryLayer.hidden=!screen;
    if(!screen) return;
    var tabs=categoryBar(screen);
    if(tabs && tabs.parentNode!==categoryLayer) categoryLayer.appendChild(tabs);
  }

  function setActiveCategory(screen, name){
    var tabs=categoryBar(screen);
    if(!tabs)return;
    tabs.querySelectorAll('.v267-tab').forEach(function(button){
      var active=button.dataset.category===name;
      button.classList.toggle('is-active',active);
      if(active) button.setAttribute('aria-current','true');
      else button.removeAttribute('aria-current');
    });
  }

  function organizeTasks(screen, grid, tabs, names){
    var tiles=Array.from(grid.querySelectorAll('.app-task-tile'));
    names.forEach(function(name){
      var group=tiles.filter(function(tile){return tile.dataset.category===name;});
      if(!group.length) return;
      var button=document.createElement('button');
      button.type='button';button.className='v267-tab';
      button.dataset.category=name;button.dataset.target=group[0].id;button.dataset.screen=screen.id;
      button.textContent=name;
      button.setAttribute('aria-controls',group[0].id);
      tabs.appendChild(button);
      group.forEach(function(tile,index){
        tile.classList.remove('v267-hidden');
        if(index===0) tile.dataset.categoryStart='true';
        grid.appendChild(tile);
      });
    });
    tabs.style.setProperty('--v277-category-count',tabs.children.length);
    if(tabs.firstElementChild) setActiveCategory(screen,tabs.firstElementChild.dataset.category);
  }

  function headerBottom(){
    var header=document.querySelector('#ntnSiteControls .ntn-sitebar');
    return header && header.getClientRects().length ? Math.max(0,header.getBoundingClientRect().bottom) : 0;
  }

  function updateCategoryPosition(screen){
    if(!screen.getClientRects().length) return;
    var tabs=categoryBar(screen);
    var holder=screen.querySelector('.v277-category-holder');
    if(!tabs || !holder) return;
    var height=tabs.getBoundingClientRect().height;
    document.body.style.setProperty('--v278-category-height',height+'px');
    var top=headerBottom();
    var box=holder.getBoundingClientRect();
    tabs.style.setProperty('--v277-nav-top',top+'px');
    tabs.style.setProperty('--v277-nav-left',box.left+'px');
    tabs.style.setProperty('--v277-nav-width',box.width+'px');
    tabs.classList.add('is-pinned');
    var starts=Array.from(screen.querySelectorAll('.app-task-tile[data-category-start]'));
    if(!starts.length) return;
    var current=starts[0].dataset.category;
    starts.forEach(function(tile){
      if(tile.getBoundingClientRect().top<=top+height+12) current=tile.dataset.category;
    });
    if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-2){
      current=starts[starts.length-1].dataset.category;
    }
    setActiveCategory(screen,current);
  }

  var categoryFrame=0;
  function scheduleCategoryPosition(){
    if(categoryFrame) return;
    categoryFrame=requestAnimationFrame(function(){
      categoryFrame=0;
      var screen=currentTaskScreen();
      showCategoryBar(screen);
      if(screen) updateCategoryPosition(screen);
    });
  }

  function goToCategory(button){
    var screen=button.closest('.app-room-screen') || document.getElementById(button.dataset.screen);
    var target=document.getElementById(button.dataset.target);
    var tabs=screen && categoryBar(screen);
    if(!target || !tabs) return;
    setActiveCategory(screen,button.dataset.category);
    var offset=headerBottom()+tabs.getBoundingClientRect().height+10;
    var top=Math.max(0,window.scrollY+target.getBoundingClientRect().top-offset);
    var reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:top,left:0,behavior:reduced?'auto':'smooth'});
    scheduleCategoryPosition();
  }

  function enhance(screen){
    screen.querySelectorAll(':scope > .ntn-v142-decor').forEach(function(decor){decor.remove();});
    if(screen.classList.contains('v267-room-screen')) return;
    screen.classList.add('v267-room-screen');
    if(!screen.querySelector(':scope > .v274-task-background')){var bg=document.createElement('div');bg.className='v274-task-background';bg.setAttribute('aria-hidden','true');screen.prepend(bg);}
    screen.querySelectorAll(':scope > .progress,.topbar-title > span').forEach(function(n){n.remove();});
    var key=roomKey(screen);
    var titleNode=screen.querySelector('.topbar-title strong');
    var originalName=(titleNode && titleNode.textContent || 'Místnost').trim();
    screen.dataset.v267RoomName=originalName;
    if(titleNode) titleNode.textContent='Výběr prací';

    var page=screen.querySelector(':scope > .page');
    var grid=screen.querySelector('.app-task-grid');
    if(!page || !grid) return;

    var hero=document.createElement('section');
    hero.className='v267-room-hero';
    hero.innerHTML='<div class="v267-room-hero-copy"><span class="v267-room-eyebrow">'+originalName.toUpperCase()+'</span><h2>Vyber práci,<br><span>kterou uděláme za tebe.</span></h2></div>';

    var tabs=document.createElement('nav');
    tabs.className='v267-room-tabs';
    tabs.setAttribute('aria-label','Kategorie prací');
    categoryBars.set(screen,tabs);
    page.insertBefore(hero,grid);
    var holder=document.createElement('div');holder.className='v277-category-holder';holder.appendChild(tabs);
    page.insertBefore(holder,grid);

    grid.querySelectorAll('.app-task-tile').forEach(function(tile){
      var task=tile.dataset.task||'';
      var name=(tile.querySelector(':scope > strong')?.textContent||'').trim();
      tile.dataset.category=category(key,task,name);
      tile.querySelectorAll('.app-task-info-link').forEach(function(a){a.textContent='i';});
    });

    organizeTasks(screen,grid,tabs,TABS[key]||TABS.extra);

    var sel=screen.querySelector('.room-confirm-selection');
    if(sel) sel.innerHTML='<span class="room-local-count"></span> práce • <b class="room-local-price"></b>';
    var label=screen.querySelector('.room-confirm-label');
    if(label) label.textContent='Potvrdit místnost';
    var disabled=screen.querySelector('.room-confirm-disabled');
    if(disabled) disabled.textContent='Nejdřív vyberte práci';
  }

  function checkedForTile(tile){
    var hit=tile.querySelector('.app-task-open');
    var id=(hit && hit.getAttribute('for')) || 'add-'+tile.dataset.task;
    var input=id && document.getElementById(id);
    return !!(input && input.checked);
  }

  function sync(screen){
    var selected=[];
    screen.querySelectorAll('.app-task-tile').forEach(function(tile){
      var on=checkedForTile(tile);
      tile.classList.toggle('v267-selected',on);
      if(on) selected.push(tile);
    });
    screen.classList.toggle('v267-has-selection',selected.length>0);

    scheduleCategoryPosition();
  }

  function syncAll(){document.querySelectorAll('.app-room-screen.v267-room-screen').forEach(sync);}


  // A quiet, one-time invitation to details; only one visible tile at a time.
  var infoPulseObserver=null, infoPulseQueue=[], infoPulseSeen=new WeakSet();
  var infoPulseVisible=new Set(), infoPulseActive=null, infoPulseTimer=null;
  function stopInfoPulse(){
    if(infoPulseActive) infoPulseActive.classList.remove('v279-info-pulse');
    infoPulseActive=null;
    if(infoPulseTimer!==null) clearTimeout(infoPulseTimer);
    infoPulseTimer=null;
  }
  function nextInfoPulse(){
    if(infoPulseActive || document.hidden) return;
    while(infoPulseQueue.length){
      var tile=infoPulseQueue.shift();
      if(!infoPulseVisible.has(tile) || infoPulseSeen.has(tile)) continue;
      infoPulseSeen.add(tile);
      infoPulseActive=tile;tile.classList.add('v279-info-pulse');
      infoPulseTimer=setTimeout(function(){stopInfoPulse();nextInfoPulse();},3600);
      return;
    }
  }
  function observeInfoPulses(screen){
    if(!infoPulseObserver) return;
    screen.querySelectorAll('.app-task-tile').forEach(function(tile){infoPulseObserver.observe(tile);});
  }
  function initInfoPulses(){
    if(!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    infoPulseObserver=new window.IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var tile=entry.target;
        if(entry.isIntersecting && entry.intersectionRatio>=0.55){
          infoPulseVisible.add(tile);
          if(!infoPulseSeen.has(tile) && infoPulseQueue.indexOf(tile)<0) infoPulseQueue.push(tile);
        }else{
          infoPulseVisible.delete(tile);
          infoPulseQueue=infoPulseQueue.filter(function(n){return n!==tile;});
          if(infoPulseActive===tile) stopInfoPulse();
        }
      });
      nextInfoPulse();
    },{threshold:[0,0.55]});
    document.querySelectorAll('.app-room-screen').forEach(observeInfoPulses);
    document.addEventListener('visibilitychange',function(){
      if(document.hidden) stopInfoPulse();else nextInfoPulse();
    });
    document.addEventListener('click',function(e){
      var icon=e.target.closest && e.target.closest('.app-task-info-link,.quick-info-btn');
      if(icon){
        var tile=icon.closest('.app-task-tile');
        if(tile){infoPulseSeen.add(tile);infoPulseQueue=infoPulseQueue.filter(function(n){return n!==tile;});}
        if(tile===infoPulseActive){stopInfoPulse();nextInfoPulse();}
      }
    },true);
  }

  function init(){
    initInfoPulses();
    document.querySelectorAll('.app-room-screen').forEach(enhance);
    syncAll();
    new MutationObserver(function(records){var added=false;records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1 && n.matches('.app-room-screen')){enhance(n);observeInfoPulses(n);added=true;}});});if(added)syncAll();}).observe(document.getElementById('app'),{childList:true});
    document.addEventListener('click',function(e){
      var tab=e.target.closest && e.target.closest('.v267-tab');
      if(tab){
        e.preventDefault();
        goToCategory(tab);
        return;
      }
      var hit=e.target.closest && e.target.closest('.app-task-open,.app-task-review');
      if(hit) setTimeout(syncAll,0);
    },true);
    document.addEventListener('keydown',function(e){var hit=e.target.closest && e.target.closest('label.app-task-hit');if(hit && (e.key==='Enter'||e.key===' ')){e.preventDefault();hit.click();}});
    document.addEventListener('change',function(e){
      if(e.target && e.target.classList && e.target.classList.contains('app-add-toggle')) setTimeout(syncAll,0);
    },true);
    new MutationObserver(scheduleCategoryPosition).observe(document.body,{attributes:true,attributeFilter:['data-screen']});
    window.addEventListener('scroll',scheduleCategoryPosition,{passive:true});
    window.addEventListener('resize',scheduleCategoryPosition,{passive:true});
    window.addEventListener('hashchange',scheduleCategoryPosition);
    window.addEventListener('pageshow',scheduleCategoryPosition);
    if(window.visualViewport) window.visualViewport.addEventListener('resize',scheduleCategoryPosition,{passive:true});
    setTimeout(syncAll,80);setTimeout(syncAll,300);setTimeout(syncAll,900);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
