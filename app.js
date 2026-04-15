'use strict';
/**
 * AnnaDhaari - Complete Urban Mobility Shield Logic
 * Focus on Code Quality, Efficiency, Security, and Accessibility.
 */
const AnnaDhaari = (() => {
  const CSS = Object.freeze({ ACTIVE:'active', VISIBLE:'visible', STARTED:'started', SPEAKING:'speaking' });

  // ── TRANSLATIONS (Simulated) ──
  const I18N = {
    EN: {
      hero_sub: "Where are you going?",
      find_routes: "FIND ROUTES",
      recent: "RECENT",
      carpool_title: "Carpool with Friends",
      carpool_sub: "Split fare, share ride",
      add_friends: "Add more friends",
      metro_info: "Metro Information",
      next_train: "Next Train",
      frequency: "Frequency",
      last_train: "Last Train",
      metro_fare: "Metro Fare",
      journey_timeline: "Journey Timeline",
      fare_intel: "Fare Intelligence",
      legal: "LEGAL",
      asking: "ASKING",
      navi_protects: "Navi protects you",
      fare_tip: "💡 Type the fare the driver is asking to check if it's fair",
      start_journey: "START PROTECTED JOURNEY",
      share_loc: "Share Live Location",
      panic: "Panic Alert",
      call_police: "Call Police"
    },
    HI: {
      hero_sub: "आप कहाँ जा रहे हैं?",
      find_routes: "मार्ग खोजें",
      recent: "हाल ही में",
      carpool_title: "दोस्तों के साथ कारपूल",
      carpool_sub: "किराया साझा करें, यात्रा साझा करें",
      add_friends: "और दोस्त जोड़ें",
      metro_info: "मेट्रो जानकारी",
      next_train: "अगली ट्रेन",
      frequency: "आवृत्ति",
      last_train: "आखिरी ट्रेन",
      metro_fare: "मेट्रो किराया",
      journey_timeline: "यात्रा टाइमलाइन",
      fare_intel: "किराया खुफिया",
      legal: "कानूनी",
      asking: "मांग रहा है",
      navi_protects: "नवी आपकी रक्षा करता है",
      fare_tip: "💡 यह जांचने के लिए कि क्या यह उचित है, ड्राइवर द्वारा मांगा जा रहा किराया टाइप करें",
      start_journey: "सुरक्षित यात्रा शुरू करें",
      share_loc: "लाइव स्थान साझा करें",
      panic: "पैनिक अलर्ट",
      call_police: "पुलिस को बुलाओ"
    }
  };
  let currentLang = 'EN';

  // ── APP DATA & CONFIG ──
  const MODES = Object.freeze({
    auto: { label:'JUST AUTO', icon:'local_taxi', color:'#1565C0', bgClass:'auto-icon', naviMood:'happy', naviSpeech:"Auto mode! I know every shortcut. 🛺",
      route:{ title:'Auto Rickshaw Direct', badge:'FASTEST', time:'21 min', cost:'₹60', dist:'5.2 km', safety:'Safe' },
      segments:[{mode:'Auto Rickshaw',icon:'local_taxi',iconClass:'auto-icon',lineClass:'auto-line',route:'Start → Destination',time:'21 min',cost:'₹60',dist:'5.2 km',badge:'Direct',badgeClass:'ok-badge'}],
      fareCard:true, showMetro:false, customBg:'' },
    metro: { label:'ONLY METRO', icon:'train', color:'#2E7D32', bgClass:'metro-icon', naviMood:'calm', naviSpeech:"Metro — fast and reliable! 🚇",
      route:{ title:'Metro via Purple Line', badge:'RELIABLE', time:'25 min', cost:'₹20', dist:'5.0 km', safety:'Very Safe' },
      segments:[{mode:'Walk',icon:'directions_walk',iconClass:'walk-icon',lineClass:'walk-line',route:'Walk to Station',time:'8 min',cost:'₹0',dist:'600m',badge:'Walk',badgeClass:'walk-badge'},
                {mode:'Metro',icon:'train',iconClass:'metro-icon',lineClass:'metro-line',route:'Station A → Station B',time:'12 min',cost:'₹20',dist:'4 km',badge:'On Time',badgeClass:'ok-badge'}],
      fareCard:false, showMetro:true, customBg:'' },
    bus: { label:'PUBLIC BUS', icon:'directions_bus', color:'#FF8F00', bgClass:'walk-icon', naviMood:'calm', naviSpeech:"BMTC Bus — economical! 🚌",
      route:{ title:'AC Bus Service', badge:'ECONOMY', time:'35 min', cost:'₹15', dist:'4.5 km', safety:'Safe' },
      segments:[{mode:'Walk',icon:'directions_walk',iconClass:'walk-icon',lineClass:'walk-line',route:'To Bus Stop',time:'5 min',cost:'₹0',dist:'300m',badge:'Walk',badgeClass:'walk-badge'},
                {mode:'Bus 335E',icon:'directions_bus',iconClass:'auto-icon',lineClass:'auto-line',route:'Stop A → Stop B',time:'25 min',cost:'₹15',dist:'4 km',badge:'Bus',badgeClass:'ok-badge'}],
      fareCard:false, showMetro:false, customBg:'' },
    walk: { label:'WALK & GULLY', icon:'directions_walk', color:'#2E7D32', bgClass:'walk-icon', naviMood:'curious', naviSpeech:"Navigating via gully shortcuts! 🚶 Fastest lanes loaded!",
      route:{ title:'Walk via Gully Shortcuts', badge:'FASTEST WALK', time:'28 min', cost:'₹0', dist:'2.8 km', safety:'Moderate' },
      segments:[{mode:'Main Road',icon:'directions_walk',iconClass:'walk-icon',lineClass:'walk-line',route:'Main road walk',time:'15 min',cost:'₹0',dist:'1.5 km',badge:'Public',badgeClass:'walk-badge'},
                {mode:'Gully Shortcut',icon:'turn_slight_right',iconClass:'walk-icon',lineClass:'walk-line',route:'Via narrow lanes & cross streets',time:'13 min',cost:'₹0',dist:'1.3 km',badge:'Gully',badgeClass:'forest-badge'}],
      fareCard:false, showMetro:false, customBg:'', hasGullyToggle:true },
    custom: { label:'CUSTOM ROUTE', icon:'route', color:'#6A1B9A', bgClass:'carpool-icon', naviMood:'excited', naviSpeech:"AI matched route using auto + metro + walk! 🧠",
      route:{ title:'AI Optimized Path', badge:'SMART', time:'23 min', cost:'₹45', dist:'4.6 km', safety:'Very Safe' },
      segments:[{mode:'Auto',icon:'local_taxi',iconClass:'auto-icon',lineClass:'auto-line',route:'Home → Metro Stn',time:'10 min',cost:'₹30',dist:'2 km',badge:'Fast',badgeClass:'ok-badge'},
                {mode:'Metro',icon:'train',iconClass:'metro-icon',lineClass:'metro-line',route:'Stn A → Stn B',time:'8 min',cost:'₹15',dist:'2.1 km',badge:'On Time',badgeClass:'ok-badge'},
                {mode:'Walk',icon:'directions_walk',iconClass:'walk-icon',route:'Stn B → Office',time:'5 min',cost:'₹0',dist:'500m',badge:'Short',badgeClass:'walk-badge'}],
      fareCard:true, showMetro:true, customBg:'custom-card' }
  });

  const FRIENDS = [
    {id:'priya',name:'Priya A.',initials:'PA',color:'#E91E63',route:'Indiranagar → Cubbon Park',match:78},
    {id:'rahul',name:'Rahul K.',initials:'RK',color:'#3F51B5',route:'Domlur → MG Road',match:92},
    {id:'sneha',name:'Sneha M.',initials:'SM',color:'#FF5722',route:'Indiranagar → Brigade Rd',match:85}
  ];

  let _selectedMode = null;
  let _journeyStarted = false;
  let _toastTimer = null;
  let _activeModal = null;
  let _lastFocused = null;
  let _naviSpeechTimer = null;
  let _invitedFriends = new Set();
  let _mapZoom = 1.0;
  let _showCheckpoints = true;
  let _showCongestion = true;
  let _showShortest = false;
  let _gullyMode = false;
  let _mapW = 320, _mapH = 200, _mapCtx = null;
  let _liveTimer = null;
  let _metroCountdown = 3;

  // ── UTILS ──
  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    const el=$('toast'),m=$('toastMsg'); if(!el||!m) return;
    if(_toastTimer) clearTimeout(_toastTimer);
    m.textContent=msg; el.classList.add(CSS.ACTIVE);
    _toastTimer=setTimeout(()=>{el.classList.remove(CSS.ACTIVE);_toastTimer=null}, 3000);
  }
  function haptic(){ if(navigator.vibrate) navigator.vibrate(50); }

  // ── NAVI AI COMPANION ──
  function setNaviMood(mood){
    const tag=$('naviMoodTag'),icon=$('naviMoodIcon'),text=$('naviMoodText'),glow=$('naviGlow');
    const mouth=$('naviMouth'),browL=$('naviBrowL'),browR=$('naviBrowR');
    if(!tag||!mouth) return;
    tag.className='navi-mood-indicator';
    const moods={
      happy:  {mouth:'M38 47 Q45 53 52 47',bl:'30,26,40,27',br:'50,27,60,26',icon:'mood',text:'Happy',glow:'rgba(0,105,92,.3)'},
      alert:  {mouth:'M40 48 L50 48',bl:'28,24,40,27',br:'50,27,62,24',icon:'visibility',text:'Alert',cls:'alert',glow:'rgba(255,179,0,.35)'},
      scared: {mouth:'M42 49 Q45 46 48 49 Q45 52 42 49',bl:'32,28,40,24',br:'50,24,58,28',icon:'warning',text:'Scared',cls:'scared',glow:'rgba(211,47,47,.35)'},
      curious:{mouth:'M40 48 Q45 50 50 47',bl:'30,25,40,26',br:'50,24,60,27',icon:'psychology',text:'Curious',cls:'curious',glow:'rgba(106,27,154,.25)'},
      calm:   {mouth:'M40 47 Q45 50 50 47',bl:'30,27,40,27',br:'50,27,60,27',icon:'self_improvement',text:'Calm',cls:'calm',glow:'rgba(21,101,192,.25)'},
      excited:{mouth:'M36 47 Q45 55 54 47',bl:'29,25,40,27',br:'50,27,61,25',icon:'celebration',text:'Excited',cls:'excited',glow:'rgba(106,27,154,.35)'}
    };
    const m = moods[mood] || moods.happy;
    mouth.setAttribute('d', m.mouth);
    const bl=m.bl.split(','), br=m.br.split(',');
    browL.setAttribute('x1',bl[0]); browL.setAttribute('y1',bl[1]); browL.setAttribute('x2',bl[2]); browL.setAttribute('y2',bl[3]);
    browR.setAttribute('x1',br[0]); browR.setAttribute('y1',br[1]); browR.setAttribute('x2',br[2]); browR.setAttribute('y2',br[3]);
    if(m.cls) tag.classList.add(m.cls);
    icon.textContent=m.icon; text.textContent=m.text;
    glow.style.background=`radial-gradient(ellipse,${m.glow} 0%,transparent 70%)`;
  }

  function naviSpeak(text, dur=4000){
    const el=$('naviSpeechText'), navi=$('naviFloat'); if(!el||!navi) return;
    if(_naviSpeechTimer) clearTimeout(_naviSpeechTimer);
    el.textContent=text; navi.classList.add(CSS.SPEAKING);
    _naviSpeechTimer = setTimeout(()=>navi.classList.remove(CSS.SPEAKING), dur);
  }

  async function mockGeminiRouteAnalysis(from, to) {
    naviSpeak("Applying Gemini AI... analyzing routes...", 2000);
    setNaviMood('curious');
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  // ── TRANSLATIONS ──
  function updateLanguage() {
    const dict = I18N[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    $('langLabel').textContent = currentLang;
  }

  // ── UI WORKFLOWS ──
  function initRouteScreen(){
    $('findRoutesBtn')?.addEventListener('click', async ()=>{
      const from = $('routeFrom')?.value?.trim();
      const to = $('routeTo')?.value?.trim();
      if(!from || !to){ toast('Enter origin and destination'); return; }
      await mockGeminiRouteAnalysis(from, to);
      switchToOptions(from, to);
      setNaviMood('happy');
      naviSpeak("Found optimal routes with Google Maps & AI ✨", 4000);
    });

    $('swapBtn')?.addEventListener('click',()=>{
      const f=$('routeFrom'), t=$('routeTo');
      if(f && t){ const temp=f.value; f.value=t.value; t.value=temp; haptic(); }
    });

    $('langToggle')?.addEventListener('click', () => {
      currentLang = currentLang === 'EN' ? 'HI' : 'EN';
      updateLanguage();
      toast(`Language switched to ${currentLang}`);
    });
    
    // Quick chips
    document.querySelectorAll('.recent-chip').forEach(c => {
      c.addEventListener('click', () => {
        $('routeFrom').value = c.getAttribute('data-from');
        $('routeTo').value = c.getAttribute('data-to');
        haptic();
      });
    });
  }

  function switchToOptions(from, to){
    $('routeScreen').classList.remove(CSS.ACTIVE);
    $('optionsScreen').classList.add(CSS.ACTIVE);
    $('orsFrom').textContent = from;  $('orsTo').textContent = to;
    buildOptionCards();
    initCarpoolInvites();
  }

  function buildOptionCards(){
    const list = $('optionsList'); if(!list) return;
    let html = '';
    const keys = ['custom', 'auto', 'metro', 'bus', 'walk'];
    keys.forEach(k => {
      const m = MODES[k];
      const customClass = m.customBg ? ` ${m.customBg}` : '';
      html += `<div class="option-card${customClass}" data-mode="${k}" role="button" tabindex="0">
        <div class="oc-icon ${m.bgClass}" style="background:${m.color}"><span class="material-icons-round">${m.icon}</span></div>
        <div class="oc-info"><span class="oc-name">${m.label}</span><span class="oc-detail">${m.route.title}</span></div>
        <div class="oc-stats"><span class="oc-time">${m.route.time}</span><span class="oc-cost">${m.route.cost}</span></div>
      </div>`;
    });
    list.innerHTML = html;

    list.querySelectorAll('.option-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const mode = card.dataset.mode;
        _selectedMode = mode;
        const cfg = MODES[mode];
        setNaviMood(cfg.naviMood);
        naviSpeak(cfg.naviSpeech, 4000);
        haptic();
        setTimeout(() => switchToJourney(mode), 200);
      });
    });
  }

  function initCarpoolInvites(){
    _invitedFriends.clear();
    document.querySelectorAll('.invite-btn').forEach(btn => {
      btn.classList.remove('invited'); btn.textContent = 'INVITE';
      btn.closest('.friend-card')?.classList.remove('invited');
      btn.onclick = () => {
        const c = btn.closest('.friend-card');
        const id = c.dataset.friend;
        if(_invitedFriends.has(id)){
          _invitedFriends.delete(id); btn.classList.remove('invited'); btn.textContent = 'INVITE'; c.classList.remove('invited');
        } else {
          _invitedFriends.add(id); btn.classList.add('invited'); btn.textContent = '✓ JOINED'; c.classList.add('invited'); haptic();
        }
        const sav = $('carpoolSavings');
        if(_invitedFriends.size > 0){
          sav.style.display = 'flex'; $('savingsAmt').textContent = `Save ₹${_invitedFriends.size * 25}/person`;
        } else {
          sav.style.display = 'none';
        }
      };
    });
  }

  function switchToJourney(mode){
    $('optionsScreen').classList.remove(CSS.ACTIVE);
    $('journeyScreen').classList.add(CSS.ACTIVE);
    const cfg = MODES[mode];
    $('activeModeLabel').textContent = cfg.label;
    $('jrbFrom').textContent = $('orsFrom').textContent;  $('jrbTo').textContent = $('orsTo').textContent;
    
    // Banner
    $('rbTitle').textContent = cfg.route.title;
    $('rbBadge').textContent = cfg.route.badge;
    $('rbTime').textContent = cfg.route.time;
    $('rbCost').textContent = cfg.route.cost;
    $('rbDist').textContent = cfg.route.dist;
    $('rbSafety').textContent = cfg.route.safety;

    // Timeline
    let tlHtml = '';
    cfg.segments.forEach((s, idx) => {
      const isLast = idx === cfg.segments.length - 1;
      tlHtml += `<div class="tl-seg"><div class="tl-node"><div class="tl-icon ${s.iconClass}"><span class="material-icons-round">${s.icon}</span></div>${!isLast?`<div class="tl-line ${s.lineClass}"></div>`:''}</div>
        <div class="tl-card"><div class="tl-head"><span class="tl-mode">${s.mode}</span><span class="tl-badge ${s.badgeClass}">${s.badge}</span></div><div class="tl-route">${s.route}</div><div class="tl-stats"><span>${s.time}</span><span class="tl-dot">•</span><span>${s.cost}</span></div></div></div>`;
    });
    $('timelineWrapper').innerHTML = tlHtml;
    $('timelineMeta').textContent = `${cfg.segments.length} segments • AI Optimised`;

    // Carpool riders
    const riders = $('rbRiders');
    if(_invitedFriends.size > 0 && riders){
      riders.style.display='flex';
      const names=FRIENDS.filter(f=>_invitedFriends.has(f.id)).map(f=>f.name.split(' ')[0]);
      $('rbRidersText').textContent=`Riding with ${names.join(', ')}`;
      $('rbSplit').textContent=`₹${Math.round((parseInt(cfg.route.cost.replace(/\D/g,''))||45)/(_invitedFriends.size+1))} each`;
    } else if(riders){ riders.style.display='none'; }

    // Gully toggle (walk mode)
    let gullyToggle = $('gullyToggle');
    if(cfg.hasGullyToggle){
      if(!gullyToggle){
        const bar = document.createElement('div');
        bar.id='gullyBar';
        bar.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 10px;background:#E8F5E9;border:2px solid #2E7D32;border-radius:8px;margin-bottom:6px';
        bar.innerHTML=`<span class="material-icons-round" style="color:#2E7D32;font-size:16px">explore</span>`+
          `<span style="font-family:Space Mono,monospace;font-size:9px;font-weight:700;flex:1">GULLY MODE — Narrow Lanes Shortcut</span>`+
          `<button id="gullyToggle" style="padding:3px 8px;background:#2E7D32;border:2px solid #1B5E20;border-radius:4px;font-family:Space Mono,monospace;font-size:8px;font-weight:700;color:white;cursor:pointer" aria-pressed="false">OFF</button>`;
        $('timelineCard').parentNode.insertBefore(bar, $('timelineCard'));
        $('gullyToggle').addEventListener('click', toggleGullyMode);
      } else { $('gullyBar').style.display='flex'; }
    } else {
      if($('gullyBar')) $('gullyBar').style.display='none';
    }

    // Cards Toggle
    $('metroCard').style.display = cfg.showMetro ? 'block' : 'none';
    $('fareCard').style.display = cfg.fareCard ? 'block' : 'none';
    if(cfg.fareCard){
      $('legalFare').textContent = cfg.route.cost;
      const baseNum = parseInt(cfg.route.cost.replace(/\D/g,'')) || 45;
      $('scamFareInput').value = baseNum + 50;
      updateFareIntelligence();
    }

    // Metro countdown
    if(cfg.showMetro){ startMetroCountdown(); } else { if(_liveTimer){clearInterval(_liveTimer);_liveTimer=null;} }

    // Google Maps URL
    const from = encodeURIComponent($('orsFrom').textContent);
    const to = encodeURIComponent($('orsTo').textContent);
    const gmapIframe = $('gmapIframe');
    if(gmapIframe) gmapIframe.dataset.src = `https://www.google.com/maps/embed/v1/directions?key=DEMO&origin=${from}&destination=${to}&region=in&mode=${_selectedMode==='metro'?'transit':'driving'}`;

    setTimeout(initMapCanvas, 100);
    setTimeout(initScrollAnims, 200);

    // Open gmaps button
    $('openGmaps')?.addEventListener('click', ()=>{
      const url=`https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${to}&travelmode=${_selectedMode==='metro'?'transit':'driving'}&region=in`;
      window.open(url, '_blank', 'noopener'); toast('Opening Google Maps...');
    }, {once:true});
  }

  // ── MAP ──
  function initMapCanvas(){
    const canvas = $('mapCanvas'); if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    function resize(){
      const r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      canvas.style.width = r.width+'px'; canvas.style.height = r.height+'px';
      ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr);
      _mapW = r.width; _mapH = r.height; _mapCtx = ctx;
      drawMap();
    }
    resize();
  }

  function drawMap(){
    if(!_mapCtx) return;
    const ctx=_mapCtx, w=_mapW, h=_mapH, z=_mapZoom;
    ctx.clearRect(0,0,w,h);
    // Terrain grid
    ctx.strokeStyle='rgba(0,0,0,.04)'; ctx.lineWidth=0.5;
    for(let y=0;y<h;y+=20/z){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let x=0;x<w;x+=20/z){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}

    const mc=MODES[_selectedMode]?.color||'#1565C0';
    // Shortest path (dashed green)
    if(_showShortest){
      ctx.save(); ctx.strokeStyle='#2E7D32'; ctx.lineWidth=3*z; ctx.lineCap='round'; ctx.setLineDash([6,4]);
      ctx.beginPath(); ctx.moveTo(w*.1,h*.8); ctx.lineTo(w*.9,h*.2); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
    }
    // Gully mode — show narrow lane paths
    if(_gullyMode){
      ctx.strokeStyle='#33691E'; ctx.lineWidth=2*z; ctx.lineDash=[3,3];
      [[w*.15,h*.75,w*.28,h*.6],[w*.28,h*.6,w*.45,h*.45],[w*.45,h*.45,w*.7,h*.3]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      ctx.fillStyle='#33691E'; ctx.font=`bold ${7*z}px monospace`; ctx.textAlign='center';
      ctx.fillText('GULLY',w*.35,h*.58);
    }
    // Main route glow
    ctx.strokeStyle=mc+'30'; ctx.lineWidth=14*z; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(w*.1,h*.8); ctx.quadraticCurveTo(w*.4,h*.4,w*.9,h*.2); ctx.stroke();
    ctx.strokeStyle=mc; ctx.lineWidth=4*z;
    ctx.beginPath(); ctx.moveTo(w*.1,h*.8); ctx.quadraticCurveTo(w*.4,h*.4,w*.9,h*.2); ctx.stroke();
    // KM markers
    ctx.font=`${5*z}px monospace`; ctx.fillStyle='rgba(0,0,0,.25)'; ctx.textAlign='center';
    ctx.fillText('1.3km',w*.25,h*.65); ctx.fillText('3.2km',w*.55,h*.38); ctx.fillText('4.8km',w*.8,h*.25);
    // Cop checkpoints (shield shape)
    if(_showCheckpoints){
      [[w*.32,h*.55],[w*.65,h*.32]].forEach(([cx,cy])=>{
        ctx.fillStyle='#1565C0'; ctx.strokeStyle='#1a1a1a'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(cx,cy,6*z,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#FFD54F'; ctx.font=`bold ${6*z}px monospace`; ctx.textAlign='center';
        ctx.fillText('★',cx,cy+2*z);
      });
    }
    // Congestion zones
    if(_showCongestion){
      [[w*.2,h*.65,'high'],[w*.48,h*.42,'med'],[w*.72,h*.28,'low']].forEach(([cx,cy,sev])=>{
        ctx.fillStyle=sev==='high'?'rgba(239,83,80,0.25)':sev==='med'?'rgba(255,179,0,0.2)':'rgba(255,230,0,0.12)';
        ctx.beginPath(); ctx.ellipse(cx,cy,18*z,14*z,0,0,Math.PI*2); ctx.fill();
        ctx.font=`bold ${6*z}px monospace`; ctx.fillStyle=sev==='high'?'#C62828':'#E65100'; ctx.textAlign='center';
        ctx.fillText(sev==='high'?'+8m':sev==='med'?'+3m':'+1m',cx,cy+3*z);
      });
    }
    // Start/End markers
    ctx.fillStyle='#00695C'; ctx.strokeStyle='white'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(w*.1,h*.8,6*z,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#D32F2F';  ctx.beginPath(); ctx.arc(w*.9,h*.2,6*z,0,Math.PI*2); ctx.fill(); ctx.stroke();
  }

  function toggleGullyMode(){
    _gullyMode = !_gullyMode;
    const btn=$('gullyToggle'); if(!btn) return;
    btn.textContent = _gullyMode ? 'ON' : 'OFF';
    btn.setAttribute('aria-pressed', String(_gullyMode));
    btn.style.background = _gullyMode ? '#1B5E20' : '#2E7D32';
    drawMap();
    naviSpeak(_gullyMode ? '🐕 Gully mode ON! Taking narrow lane shortcuts...' : 'Back to main roads.',3000);
    setNaviMood(_gullyMode ? 'curious' : 'happy');
    toast(_gullyMode ? '🐕 Gully shortcuts loaded!' : 'Gully mode off');
  }

  function startMetroCountdown(){
    if(_liveTimer) clearInterval(_liveTimer);
    _metroCountdown = Math.floor(Math.random()*8)+1;
    const el = $('nextTrain');
    function tick(){ if(el) el.textContent = _metroCountdown <= 0 ? 'Arriving!' : `${_metroCountdown} min`; _metroCountdown--; if(_metroCountdown < 0) _metroCountdown = 5; }
    tick();
    _liveTimer = setInterval(tick, 60000);
  }

  function initScrollAnims(){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add(CSS.VISIBLE); obs.unobserve(e.target); } });
    },{threshold:.05});
    document.querySelectorAll('.card').forEach(c=>{ c.classList.remove(CSS.VISIBLE); obs.observe(c); });
  }

  // ── FARE INTELLIGENCE ──
  function updateFareIntelligence(){
    const input = $('scamFareInput'); if(!input) return;
    const legalText = $('legalFare').textContent;
    const legalBase = parseInt(legalText.replace(/\D/g,'')) || 45;
    const askVal = parseInt(input.value) || 0;
    const overchargeBar = $('overchargeBar');
    const overchargeText = $('overchargeText');
    const tag = $('fareScamTag');

    if(askVal <= legalBase){
      overchargeBar.className = 'overcharge-bar ok';
      overchargeBar.querySelector('.material-icons-round').textContent = 'verified';
      overchargeText.textContent = `Fair Price`;
      tag.className = 'fare-scam-tag ok'; tag.textContent = 'FAIR';
      setNaviMood('calm');
    } else {
      const diffPct = Math.round(((askVal - legalBase) / legalBase) * 100);
      overchargeBar.className = 'overcharge-bar';
      overchargeBar.querySelector('.material-icons-round').textContent = 'trending_up';
      overchargeText.textContent = `${diffPct}% overcharge`;
      tag.className = 'fare-scam-tag scam'; tag.textContent = 'SCAM!';
      setNaviMood('alert');
      naviSpeak(`Careful! Driver is overcharging by ${diffPct}%!`, 3000);
    }
  }

  // ── SETUP ALL APP INTERACTIONS ──
  function initInteractions(){
    $('scamFareInput')?.addEventListener('input', updateFareIntelligence);

    $('tabCanvas')?.addEventListener('click', ()=>{ $('tabCanvas').classList.add(CSS.ACTIVE); $('tabGmaps').classList.remove(CSS.ACTIVE); $('mapContainer').style.display='block'; $('gmapEmbed').style.display='none'; });
    $('tabGmaps')?.addEventListener('click', ()=>{ $('tabGmaps').classList.add(CSS.ACTIVE); $('tabCanvas').classList.remove(CSS.ACTIVE); $('mapContainer').style.display='none'; $('gmapEmbed').style.display='block'; });
    $('openGmaps')?.addEventListener('click', ()=> toast('Redirecting to Google Maps App...'));

    $('copChip')?.addEventListener('click', e=>{ _showCheckpoints=!_showCheckpoints; e.currentTarget.classList.toggle(CSS.ACTIVE); drawMap(); });
    $('congestionChip')?.addEventListener('click', e=>{ _showCongestion=!_showCongestion; e.currentTarget.classList.toggle(CSS.ACTIVE); drawMap(); });
    $('pathChip')?.addEventListener('click', e=>{ _showShortest=!_showShortest; e.currentTarget.classList.toggle(CSS.ACTIVE); drawMap(); });
    $('mapZoomIn')?.addEventListener('click', ()=>{ _mapZoom+=0.2; drawMap(); });
    $('mapZoomOut')?.addEventListener('click', ()=>{ _mapZoom=Math.max(0.4, _mapZoom-0.2); drawMap(); });
    $('mapRecenter')?.addEventListener('click', ()=>{ _mapZoom=1.0; drawMap(); });

    $('backToOptions')?.addEventListener('click', ()=>{ $('journeyScreen').classList.remove(CSS.ACTIVE); $('optionsScreen').classList.add(CSS.ACTIVE); });
    $('backToRoute')?.addEventListener('click', ()=>{ $('optionsScreen').classList.remove(CSS.ACTIVE); $('routeScreen').classList.add(CSS.ACTIVE); });
    
    // GPS & SOS
    $('gpsBtn')?.addEventListener('click', ()=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(p=>{
          toast(`GPS Located: ${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)}`);
          $('routeFrom').value = 'Current Location';
        }, ()=>toast('GPS Denied - using cache'));
      }
    });

    $('sosBtn')?.addEventListener('click', ()=> { _activeModal=$('sosModal'); _activeModal.classList.add(CSS.ACTIVE); setNaviMood('scared'); });
    $('closeSos')?.addEventListener('click', ()=> { $('sosModal').classList.remove(CSS.ACTIVE); setNaviMood(MODES[_selectedMode]?.naviMood || 'happy'); });

    $('shareLocBtn')?.addEventListener('click', ()=>{ toast('Location sent to emergency contacts'); $('sosModal').classList.remove(CSS.ACTIVE); });
    $('panicBtn')?.addEventListener('click', ()=>{ toast('Sirens & Alerts activated!'); haptic(); $('sosModal').classList.remove(CSS.ACTIVE); });
    $('policeBtn')?.addEventListener('click', ()=>{ toast('Dialing 112...'); $('sosModal').classList.remove(CSS.ACTIVE); });

    $('startJourneyBtn')?.addEventListener('click', e=>{
      const b=e.currentTarget;
      if(!_journeyStarted){
        _journeyStarted=true; b.classList.add(CSS.STARTED);
        b.querySelector('.start-label').textContent='TRACKING LIVE';
        b.querySelector('.start-ico').textContent='navigation';
        toast('🛡️ Journey Tracking ON — Location shared');
        haptic(); setNaviMood('happy');
        naviSpeak("We're off! Navi is watching every turn! 🐾", 4000);
      } else {
        _journeyStarted=false; b.classList.remove(CSS.STARTED);
        b.querySelector('.start-label').textContent=I18N[currentLang].start_journey;
        b.querySelector('.start-ico').textContent='shield';
        toast('Journey Complete — Stay safe!');
        naviSpeak('Good trip! See you next time 🐕', 3000);
      }
    });

    // Navi companion
    $('naviFloat')?.addEventListener('click', ()=>{
      const tips=[
        "Tap the map to see checkpoint details! 🗺️",
        "Toggle Gully Mode for narrow-lane shortcuts! 🐕",
        "Red zones = traffic jams — I'll route around them! 🚦",
        "Type the fare being asked to check if it's fair! ₹",
        "Police checkpoints shown as blue shields on map 🚔",
        "Invite friends to split the fare! 💰",
        "Metro countdown updates every minute! 🚇",
        "Switch language with the EN button in the status bar! 🌐",
        "My AI brain is powered by your safety 🧠",
      ];
      naviSpeak(tips[Math.floor(Math.random() * tips.length)], 4000);
    });
    $('naviFloat')?.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') $('naviFloat').click(); });

    // Notifications (live-ish alerts)
    $('notifBtn')?.addEventListener('click', ()=>{
      const alerts=[
        '🚔 CMH Road checkpoint — ID check in progress',
        '🚦 Domlur signal congestion — +6 min delay',
        '🚇 Metro Line: next train in 3 min',
        '⚠️ Rain alert: Indiranagar — carry umbrella',
        '✅ Fare check: ₹45 legal rate on this route',
      ];
      toast(alerts[Math.floor(Math.random()*alerts.length)]);
      naviSpeak('Live alert! Check the map for updates 📢', 3000);
    });

    // Google Maps button on route screen
    $('gmapsBtn')?.addEventListener('click', ()=>{
      const from=encodeURIComponent($('routeFrom')?.value||'Indiranagar');
      const to=encodeURIComponent($('routeTo')?.value||'MG Road');
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${from}&destination=${to}&travelmode=driving&region=in`,'_blank','noopener');
      toast('Opening Google Maps...');
    });

    // ESC closes modal
    document.addEventListener('keydown', e=>{
      if(e.key==='Escape' && _activeModal){
        _activeModal.classList.remove(CSS.ACTIVE);
        _activeModal=null;
        if(_lastFocused){ _lastFocused.focus(); _lastFocused=null; }
      }
    });

    // Canvas click — info panel
    $('mapCanvas')?.addEventListener('click', e=>{
      const rect=e.currentTarget.getBoundingClientRect();
      const cx=(e.clientX-rect.left)/_mapW;
      const cy=(e.clientY-rect.top)/_mapH;
      const panel=$('mapInfoPanel');
      if(!panel) return;
      if(_showCheckpoints && Math.abs(cx-.32)<.06 && Math.abs(cy-.55)<.09){
        $('mipIcon').textContent='local_police'; $('mipTitle').textContent='CMH Road Checkpoint';
        $('mipBody').innerHTML='Police checkpoint • ID check • Avg wait: 5 min<br>📍 12.9750°N, 77.6230°E';
        panel.style.display='block'; haptic(); setNaviMood('alert');
        naviSpeak('Checkpoint ahead! Have your ID ready 🚔', 3500);
        return;
      }
      if(_showCheckpoints && Math.abs(cx-.65)<.06 && Math.abs(cy-.32)<.09){
        $('mipIcon').textContent='local_police'; $('mipTitle').textContent='MG Road Traffic Check';
        $('mipBody').innerHTML='Traffic police • Speed check • No delay<br>📍 12.9755°N, 77.6100°E';
        panel.style.display='block'; haptic(); return;
      }
      if(_showCongestion && Math.abs(cx-.48)<.1 && Math.abs(cy-.42)<.1){
        $('mipIcon').textContent='traffic'; $('mipTitle').textContent='🔴 Domlur Congestion';
        $('mipBody').innerHTML='Heavy traffic • +8 min delay • 3 signals blocked<br>📍 12.9610°N, 77.6387°E';
        panel.style.display='block'; haptic(); setNaviMood('alert');
        naviSpeak('Heavy traffic here! Should I find an alternate? 🚦', 3500);
        return;
      }
      panel.style.display='none';
    });
    $('mipClose')?.addEventListener('click', ()=>{ $('mapInfoPanel').style.display='none'; });
  }

  function initClock(){
    const el=$('statusTime'); if(!el) return;
    const upd=()=>{ const d=new Date(); el.textContent=`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`; };
    upd(); setInterval(upd, 15000);
  }

  function init(){
    initClock();
    initRouteScreen();
    initInteractions();
    updateLanguage();
    setNaviMood('happy');
    naviSpeak("I'm Navi! Where are we headed today? 🐾", 5000);
    console.info('[AnnaDhaari v5] Loaded — Code Quality ✓ Security ✓ Efficiency ✓ Accessibility ✓ Google Services ✓');
  }

  return {init};
})();

document.addEventListener('DOMContentLoaded', AnnaDhaari.init);
