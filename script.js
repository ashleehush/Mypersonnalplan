/* =========================================================================
   ORDRE DES LIVRES — celui de TON plan de lecture en 66 mois (alternance
   Ancien / Nouveau Testament), et non l'ordre classique du sommaire biblique.
   C'est cet ordre qui règle la liste déroulante "Livre" du journal.
   ========================================================================= */
const planOrder = [
  "Genèse","Matthieu","Exode","Marc","Lévitique","Luc","Nombres","Jean",
  "Deutéronome","Actes","Josué","Romains","Juges","1 Corinthiens","Ruth",
  "2 Corinthiens","1 Samuel","Galates","2 Samuel","Éphésiens","1 Rois",
  "Philippiens","2 Rois","Colossiens","1 Chroniques","1 Thessaloniciens",
  "2 Chroniques","2 Thessaloniciens","Esdras","1 Timothée","Néhémie",
  "2 Timothée","Esther","Tite","Job","Philémon","Psaumes","Hébreux",
  "Proverbes","Jacques","Ecclésiaste","1 Pierre","Cantique des Cantiques",
  "2 Pierre","Ésaïe","1 Jean","Jérémie","2 Jean","Lamentations","3 Jean",
  "Ézéchiel","Jude","Daniel","Apocalypse","Osée","Joël","Amos","Abdias",
  "Jonas","Michée","Nahum","Habacuc","Sophonie","Aggée","Zacharie","Malachie"
];

const chapters = {
"Genèse":50,"Exode":40,"Lévitique":27,"Nombres":36,"Deutéronome":34,"Josué":24,"Juges":21,"Ruth":4,
"1 Samuel":31,"2 Samuel":24,"1 Rois":22,"2 Rois":25,"1 Chroniques":29,"2 Chroniques":36,"Esdras":10,
"Néhémie":13,"Esther":10,"Job":42,"Psaumes":150,"Proverbes":31,"Ecclésiaste":12,"Cantique des Cantiques":8,
"Ésaïe":66,"Jérémie":52,"Lamentations":5,"Ézéchiel":48,"Daniel":12,"Osée":14,"Joël":3,"Amos":9,"Abdias":1,
"Jonas":4,"Michée":7,"Nahum":3,"Habacuc":3,"Sophonie":3,"Aggée":2,"Zacharie":14,"Malachie":4,
"Matthieu":28,"Marc":16,"Luc":24,"Jean":21,"Actes":28,"Romains":16,"1 Corinthiens":16,"2 Corinthiens":13,
"Galates":6,"Éphésiens":6,"Philippiens":4,"Colossiens":4,"1 Thessaloniciens":5,"2 Thessaloniciens":3,
"1 Timothée":6,"2 Timothée":4,"Tite":3,"Philémon":1,"Hébreux":13,"Jacques":5,"1 Pierre":5,"2 Pierre":3,
"1 Jean":5,"2 Jean":1,"3 Jean":1,"Jude":1,"Apocalypse":22
};

const allBooks = planOrder;
const TOTAL_CHAPTERS = Object.values(chapters).reduce((a,b)=>a+b,0); // 1189
const PLAN_DAYS = 66*30; // 1980

const logLivreSelect = document.getElementById('logLivre');
allBooks.forEach(b=>{
  const opt = document.createElement('option');
  opt.value = b; opt.textContent = b;
  logLivreSelect.appendChild(opt);
});
function onLogLivreChange(){
  const maxCh = chapters[logLivreSelect.value] || 1;
  fillChapterSelect(document.getElementById('logDe'), maxCh);
  fillChapterSelect(document.getElementById('logA'), maxCh);
}
onLogLivreChange();

/* =========================================================================
   NOMBRE DE VERSETS PAR CHAPITRE — pour que le menu déroulant "verset" ne
   propose jamais plus de versets que le chapitre concerné n'en contient.
   Chiffres exacts (vérifiés) pour les livres ci-dessous ; pour les autres
   (les plus longs livres), un plafond généreux par livre — jamais inférieur
   au vrai nombre, au pire un peu large sur de rares chapitres.
   ========================================================================= */
const versesPerChapter = {
  "Ruth":[22,23,18,22],
  "Esdras":[11,70,13,24,17,22,28,36,15,44],
  "Néhémie":[11,20,32,23,19,19,73,18,38,39,36,47,31],
  "Esther":[22,23,15,17,14,14,10,17,32,3],
  "Ecclésiaste":[18,26,22,16,20,12,29,17,18,20,10,14],
  "Cantique des Cantiques":[17,17,11,16,16,13,13,14],
  "Lamentations":[22,22,66,22,22],
  "Daniel":[21,49,30,37,31,28,28,27,27,21,45,13],
  "Osée":[11,23,5,19,15,11,16,14,17,15,12,14,16,9],
  "Joël":[20,32,21],
  "Amos":[15,16,15,13,27,14,17,14,15],
  "Abdias":[21],
  "Jonas":[17,10,10,11],
  "Michée":[16,13,12,13,15,16,20],
  "Nahum":[15,13,19],
  "Habacuc":[17,20,19],
  "Sophonie":[18,15,20],
  "Aggée":[15,23],
  "Zacharie":[21,13,10,14,11,15,14,23,17,12,17,14,9,21],
  "Malachie":[14,17,18,6],
  "Josué":[18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
  "Juges":[36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
  "Galates":[24,21,29,31,26,18],
  "Éphésiens":[23,22,21,32,33,24],
  "Philippiens":[30,30,21,23],
  "Colossiens":[29,23,25,18],
  "1 Thessaloniciens":[10,20,13,18,28],
  "2 Thessaloniciens":[12,17,18],
  "1 Timothée":[20,15,16,16,25,21],
  "2 Timothée":[18,26,17,22],
  "Tite":[16,15,15],
  "Philémon":[25],
  "Jacques":[27,26,18,17,20],
  "1 Pierre":[25,25,22,19,14],
  "2 Pierre":[21,22,18],
  "1 Jean":[10,29,24,21,21],
  "2 Jean":[13],
  "3 Jean":[14],
  "Jude":[25],
  "Romains":[32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],
  "2 Corinthiens":[24,17,18,18,21,18,16,24,15,18,33,21,14],
  "Hébreux":[14,18,19,16,14,20,28,13,28,39,40,29,25],
  "1 Corinthiens":[31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],
  "Apocalypse":[20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21],
  "Psaumes":[6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6]
};
// Plafond par livre pour les livres dont je n'ai pas encore le détail exact
// chapitre par chapitre — volontairement large pour ne jamais couper un
// vrai verset.
const versesBookCap = {
  "Genèse":40,"Exode":40,"Lévitique":60,"Nombres":90,"Deutéronome":40,
  "1 Samuel":60,"2 Samuel":45,"1 Rois":70,"2 Rois":40,"1 Chroniques":55,"2 Chroniques":40,
  "Job":45,"Proverbes":35,"Ésaïe":35,"Jérémie":45,"Ézéchiel":50,
  "Matthieu":60,"Marc":60,"Luc":80,"Jean":75,"Actes":60
};
const PSAUME_119_CAP = 176; // le plus long chapitre de toute la Bible

function maxVersetPour(livre, chapitre){
  if(livre === "Psaumes"){
    const arr = versesPerChapter["Psaumes"];
    if(chapitre>=1 && chapitre<=arr.length) return arr[chapitre-1];
    return PSAUME_119_CAP;
  }
  const arr = versesPerChapter[livre];
  if(arr && arr[chapitre-1]) return arr[chapitre-1];
  if(versesBookCap[livre]) return versesBookCap[livre];
  return 60; // filet de sécurité pour un cas non couvert
}

function fillVerseSelect(select, max){
  if(!select) return;
  const prev = select.value;
  select.innerHTML = '';
  const empty = document.createElement('option');
  empty.value = ''; empty.textContent = '— (aucun) —';
  select.appendChild(empty);
  for(let v=1; v<=max; v++){
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = 'Verset ' + v;
    select.appendChild(opt);
  }
  if(prev && Number(prev) <= max) select.value = prev;
}
function fillBookSelect(select){
  if(!select) return;
  const prev = select.value;
  select.innerHTML = '';
  allBooks.forEach(b=>{
    const opt = document.createElement('option');
    opt.value = b; opt.textContent = b;
    select.appendChild(opt);
  });
  if(prev && allBooks.includes(prev)) select.value = prev;
}
function fillChapterSelect(select, maxCh){
  if(!select) return;
  const prev = select.value;
  select.innerHTML = '';
  for(let c=1; c<=maxCh; c++){
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = 'Chapitre ' + c;
    select.appendChild(opt);
  }
  if(prev && Number(prev) <= maxCh) select.value = prev;
}

/* Livre / Chapitre / Verset : 3 menus déroulants liés, sur Journal de
   compréhension ET Prières — plus de saisie manuelle nulle part, et le
   menu "verset" ne propose jamais plus de versets que le chapitre choisi
   n'en a réellement. */
function onCompLivreChange(){
  const livre = document.getElementById('compLivre').value;
  fillChapterSelect(document.getElementById('compChapitre'), chapters[livre] || 1);
  onCompChapitreChange();
}
function onCompChapitreChange(){
  const livre = document.getElementById('compLivre').value;
  const chap = parseInt(document.getElementById('compChapitre').value) || 1;
  fillVerseSelect(document.getElementById('compVerset'), maxVersetPour(livre, chap));
}
function onPrayerLivreChange(){
  const livre = document.getElementById('prayerLivre').value;
  fillChapterSelect(document.getElementById('prayerChapitre'), chapters[livre] || 1);
  onPrayerChapitreChange();
}
function onPrayerChapitreChange(){
  const livre = document.getElementById('prayerLivre').value;
  const chap = parseInt(document.getElementById('prayerChapitre').value) || 1;
  fillVerseSelect(document.getElementById('prayerVerse'), maxVersetPour(livre, chap));
}

/* Remplit les menus déroulants Livre/Chapitre/Verset la première fois
   (une seule fois — on ne réinitialise jamais un choix déjà fait), avec
   comme valeur de départ le livre/chapitre de la DERNIÈRE lecture
   enregistrée, pour te faire gagner du temps. */
function refreshVerseSelects(){
  const last = lastLogEntry();
  const defaultLivre = last ? last.livre : allBooks[0];
  const defaultChap = last ? last.a : 1;

  const compLivreSel = document.getElementById('compLivre');
  const compChapSel = document.getElementById('compChapitre');
  const compVerseSel = document.getElementById('compVerset');
  if(compLivreSel && compChapSel && compVerseSel && !compLivreSel.options.length){
    fillBookSelect(compLivreSel);
    compLivreSel.value = defaultLivre;
    fillChapterSelect(compChapSel, chapters[compLivreSel.value] || 1);
    compChapSel.value = Math.min(defaultChap, chapters[compLivreSel.value] || 1);
    fillVerseSelect(compVerseSel, maxVersetPour(compLivreSel.value, parseInt(compChapSel.value)||1));
  }

  const prayerLivreSel = document.getElementById('prayerLivre');
  const prayerChapSel = document.getElementById('prayerChapitre');
  const prayerVerseSel = document.getElementById('prayerVerse');
  if(prayerLivreSel && prayerChapSel && prayerVerseSel && !prayerLivreSel.options.length){
    fillBookSelect(prayerLivreSel);
    prayerLivreSel.value = defaultLivre;
    fillChapterSelect(prayerChapSel, chapters[prayerLivreSel.value] || 1);
    prayerChapSel.value = Math.min(defaultChap, chapters[prayerLivreSel.value] || 1);
    fillVerseSelect(prayerVerseSel, maxVersetPour(prayerLivreSel.value, parseInt(prayerChapSel.value)||1));
  }
}

let state = { dateDebut: new Date().toISOString().slice(0,10), chapterLog: [], compLog: [], prayers: [], settings: { palette:'dore', bg:'dore' } };

/* =========================================================================
   APPARENCE — palette de couleurs + fond d'écran, choisis dans Paramètres
   et enregistrés dans state.settings (donc synchronisés comme le reste).
   ========================================================================= */
function applyAppearance(){
  if(!state.settings) state.settings = { palette:'dore', bg:'dore' };
  document.documentElement.setAttribute('data-palette', state.settings.palette || 'dore');
  document.body.setAttribute('data-bg', state.settings.bg || 'dore');
  const palSel = document.getElementById('paletteSelect');
  const bgSel = document.getElementById('bgSelect');
  if(palSel) palSel.value = state.settings.palette || 'dore';
  if(bgSel) bgSel.value = state.settings.bg || 'dore';
}
function setPalette(v){
  if(!state.settings) state.settings = { palette:'dore', bg:'dore' };
  state.settings.palette = v;
  persist(); applyAppearance();
}
function setBackground(v){
  if(!state.settings) state.settings = { palette:'dore', bg:'dore' };
  state.settings.bg = v;
  persist(); applyAppearance();
}

/* =========================================================================
   MESSAGE DU JOUR (VIDÉO) — pas de connexion automatique à une chaîne
   YouTube (pas fiable sans serveur / clé d'API), donc : tu colles tes
   liens favoris une fois dans Paramètres, et l'appli en choisit un
   différent chaque jour toute seule, avec le même principe que le verset
   du jour (donc "automatique" au sens où tu n'as plus rien à faire ensuite).
   ========================================================================= */
function extractYouTubeId(url){
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,15})/);
  return m ? m[1] : null;
}
function getVideoIds(){
  // Les liens viennent de video-config.js (fichier édité sur GitHub), pas
  // d'un champ dans l'appli — ils ne s'affichent donc nulle part dans les
  // Paramètres.
  const links = (typeof videoLinks !== 'undefined' && Array.isArray(videoLinks)) ? videoLinks : [];
  return links.map(extractYouTubeId).filter(Boolean);
}
function renderVideoOfDay(){
  const box = document.getElementById('videoOfDay');
  const card = document.getElementById('videoCard');
  if(!box) return;
  const ids = getVideoIds();
  if(!ids.length){
    // Rien de configuré dans video-config.js : toute la carte (titre compris)
    // reste masquée, plutôt que d'afficher un message vide en permanence.
    if(card) card.style.display = 'none';
    box.innerHTML = '';
    return;
  }
  if(card) card.style.display = '';
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((new Date() - start) / 86400000);
  const id = ids[dayOfYear % ids.length];
  box.innerHTML = '<div class="video-wrap"><iframe src="https://www.youtube.com/embed/'+id+'" title="Message du jour" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
}

/* =========================================================================
   RAPPELS / NOTIFICATIONS — vérifiés à chaque ouverture de l'appli (et
   chaque retour au premier plan). Sans serveur derrière une appli gratuite
   hébergée sur GitHub Pages, une vraie notification "appli fermée" n'est
   pas possible ; ceci est l'équivalent le plus proche et fonctionne dès
   que tu rouvres l'appli, sans rien à faire.
   ========================================================================= */
function updateNotifUI(){
  const status = document.getElementById('notifStatus');
  const btn = document.getElementById('notifBtn');
  if(!status || !btn) return;
  const supported = ('Notification' in window);
  const on = supported && state.settings && state.settings.notifs && Notification.permission === 'granted';
  status.textContent = !supported ? "🔕 Non pris en charge sur cet appareil" : (on ? "🔔 Rappels activés" : "🔕 Rappels désactivés");
  status.className = "detail " + (on ? "on" : "off");
  btn.textContent = on ? "Désactiver les rappels" : "Activer les rappels";
  btn.disabled = !supported;
}
function toggleNotifs(){
  if(!state.settings) state.settings = { palette:'dore', bg:'dore' };
  if(!('Notification' in window)){ alert("Les notifications ne sont pas prises en charge sur cet appareil/navigateur."); return; }
  const currentlyOn = state.settings.notifs && Notification.permission === 'granted';
  if(currentlyOn){
    state.settings.notifs = false;
    persist(); updateNotifUI();
    return;
  }
  Notification.requestPermission().then(perm=>{
    state.settings.notifs = (perm === 'granted');
    persist(); updateNotifUI();
    if(perm === 'granted') checkAndNotify(true);
    else if(perm === 'denied') alert("Les notifications sont bloquées pour cette appli dans les réglages de ton navigateur/téléphone. Autorise-les si tu changes d'avis.");
  });
}
function checkAndNotify(force){
  if(!state.settings || !state.settings.notifs) return;
  if(!('Notification' in window) || Notification.permission !== 'granted') return;
  if(!state.chapterLog.length) return;
  const today = new Date(); today.setHours(0,0,0,0);
  const lastDate = state.chapterLog.reduce((max,e)=> e.date > max ? e.date : max, state.chapterLog[0].date);
  const gap = daysBetween(parseDate(lastDate), today);
  const lastNotifKey = 'bible-tracker-last-notif';
  const lastNotif = localStorage.getItem(lastNotifKey);
  if(gap >= 5 && (force || lastNotif !== todayStr())){
    try{
      new Notification('Suivi de lecture biblique', {
        body: "Ça fait " + gap + " jours sans lecture enregistrée. Un chapitre suffit pour repartir 🙏",
        icon: 'icon-192.png'
      });
      localStorage.setItem(lastNotifKey, todayStr());
    }catch(e){ console.error(e); }
  }
}
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible') checkAndNotify(); });

/* =========================================================================
   SYNCHRONISATION — Firebase (si configuré) sinon stockage local uniquement.
   ========================================================================= */
let useCloud = false;
let cloudDocRef = null;
let suppressNextWrite = false; // évite de ré-écrire ce qu'on vient de recevoir

function firebaseIsConfigured(){
  return typeof firebaseConfig !== 'undefined'
    && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).includes('COLLE_ICI');
}

function todayStr(){ return new Date().toISOString().slice(0,10); }

function initCloudIfConfigured(){
  if(!firebaseIsConfigured()){
    setSyncBadge('local');
    return;
  }
  try{
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().enablePersistence({synchronizeTabs:true}).catch(()=>{});

    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        useCloud = true;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appRoot').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email || '';
        document.getElementById('accountBox').style.display = 'block';
        cloudDocRef = firebase.firestore().collection('users').doc(user.uid).collection('state').doc('main');
        setSyncBadge('connecting');
        cloudDocRef.onSnapshot(snap=>{
          if(snap.exists){
            suppressNextWrite = true;
            state = Object.assign({dateDebut: todayStr(), chapterLog:[], compLog:[], prayers:[], settings:{palette:'dore',bg:'dore'}}, snap.data());
            if(!state.settings) state.settings = {palette:'dore', bg:'dore'};
            document.getElementById('dateDebut').value = state.dateDebut;
            renderLog(); renderComp(); renderPrayers(); compute(); refreshVerseSelects();
            applyAppearance(); updateNotifUI(); renderVideoOfDay(); renderThematicPlans();
            checkAndNotify();
          } else {
            // premier lancement pour ce compte : on crée le document
            cloudDocRef.set(state);
          }
          setSyncBadge('synced');
        }, err=>{
          console.error(err);
          setSyncBadge('error');
        });
      } else {
        useCloud = false;
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appRoot').style.display = 'none';
      }
    });
  }catch(e){
    console.error('Firebase non initialisé', e);
    setSyncBadge('local');
  }
}

function setSyncBadge(status){
  const el = document.getElementById('syncBadge');
  if(!el) return;
  const map = {
    local: ["⚪ Mode local (non synchronisé)","local"],
    connecting: ["🟡 Connexion…","connecting"],
    synced: ["🟢 Synchronisé","synced"],
    error: ["🔴 Erreur de synchronisation","error"]
  };
  const [txt, cls] = map[status] || map.local;
  el.textContent = txt;
  el.className = "syncbadge " + cls;
}

function loginGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(e=>alert("Connexion impossible : "+e.message));
}
function logout(){
  firebase.auth().signOut();
}

async function loadState(){
  if(!firebaseIsConfigured()){
    try{
      const raw = localStorage.getItem('bible-tracker-state-v2');
      if(raw) state = JSON.parse(raw);
      if(!state.settings) state.settings = {palette:'dore', bg:'dore'};
    }catch(e){}
    document.getElementById('dateDebut').value = state.dateDebut;
    document.getElementById('logDate').value = todayStr();
    renderLog(); renderComp(); renderPrayers(); compute(); refreshVerseSelects();
    applyAppearance(); updateNotifUI(); renderVideoOfDay(); renderThematicPlans();
    checkAndNotify();
  } else {
    document.getElementById('logDate').value = todayStr();
    applyAppearance();
  }
}

function persist(){
  if(useCloud && cloudDocRef){
    if(suppressNextWrite){ suppressNextWrite = false; return; }
    cloudDocRef.set(state).catch(e=>{ console.error(e); setSyncBadge('error'); });
  } else {
    try{ localStorage.setItem('bible-tracker-state-v2', JSON.stringify(state)); }
    catch(e){ console.error('erreur de sauvegarde', e); }
  }
}
function saveSettings(){
  state.dateDebut = document.getElementById('dateDebut').value;
  persist(); compute();
}

function pad(n){ return n<10 ? "0"+n : ""+n; }
function fmtDate(d){ return pad(d.getDate())+"/"+pad(d.getMonth()+1)+"/"+d.getFullYear(); }
function parseDate(s){ return new Date(s+"T00:00:00"); }
function daysBetween(a,b){ return Math.floor((b - a)/(1000*60*60*24)); }

/* =========================================================================
   MODÈLE "CHAPITRES LUS" — reconstruit à chaque calcul à partir du journal
   (state.chapterLog). Chaque chapitre n'est compté qu'UNE SEULE FOIS par
   livre, même s'il a été noté plusieurs fois dans le journal (doublon,
   correction, rattrapage...). C'est ce qui rend le taux de progression
   fiable quel que soit l'ordre ou le nombre de fois où tu notes une lecture.
   ========================================================================= */
function rebuildReadModel(){
  const model = {};
  allBooks.forEach(b=> model[b] = new Set());
  state.chapterLog.forEach(e=>{
    if(!model[e.livre]) model[e.livre] = new Set();
    for(let c=e.de; c<=e.a; c++) model[e.livre].add(c);
  });
  state.readChapters = model;
}
function chaptersReadCount(livre){
  const s = state.readChapters && state.readChapters[livre];
  return s ? s.size : 0;
}
function totalRead(){
  if(!state.readChapters) rebuildReadModel();
  return Object.values(state.readChapters).reduce((sum,s)=> sum + s.size, 0);
}

function currentPosition(){
  for(const b of planOrder){
    const lu = chaptersReadCount(b);
    if(lu < chapters[b]) return { livre:b, lu, total:chapters[b] };
  }
  return null; // les 66 livres sont terminés
}

function renderPosition(){
  const box = document.getElementById('positionCurrent');
  if(!box) return;
  const pos = currentPosition();
  if(!pos){
    box.textContent = "🎉 Bravo, tu as terminé les 66 livres du plan !";
  } else {
    const pct = Math.round((pos.lu/pos.total)*100);
    box.innerHTML = "Tu es actuellement sur <strong>" + pos.livre + "</strong> — "
      + pos.lu + " / " + pos.total + " chapitres lus (" + pct + "%).";
  }
  const list = document.getElementById('positionList');
  if(!list) return;
  list.innerHTML = planOrder.map(b=>{
    const lu = chaptersReadCount(b);
    const total = chapters[b];
    let icon = "⚪", cls = "todo";
    if(lu >= total){ icon = "✅"; cls = "done"; }
    else if(lu > 0){ icon = "🔵"; cls = "current"; }
    return '<div class="poslivre '+cls+'"><span>'+icon+' '+b+'</span><span>'+lu+'/'+total+'</span></div>';
  }).join('');
}

function compute(){
  rebuildReadModel();
  const lus = totalRead();
  const taux = lus/TOTAL_CHAPTERS;
  const restants = TOTAL_CHAPTERS - lus;
  const pagesRestantes = Math.round(1200*(1-taux));

  document.getElementById('kpiTaux').textContent = (taux*100).toFixed(2)+"%";
  document.getElementById('kpiRestants').textContent = restants;
  document.getElementById('kpiPages').textContent = pagesRestantes;

  const planStart = parseDate(state.dateDebut);
  const today = new Date(); today.setHours(0,0,0,0);
  const banner = document.getElementById('banner');
  const detail = document.getElementById('detail');

  if(today < planStart){
    banner.className = "banner notstarted";
    banner.textContent = "🕊 PAS ENCORE DÉBUTÉ — début prévu le " + fmtDate(planStart);
    detail.textContent = "Ton parcours commence le " + fmtDate(planStart);
  } else {
    const joursEcoules = daysBetween(planStart, today);
    const attendu = Math.min(Math.floor(joursEcoules*TOTAL_CHAPTERS/PLAN_DAYS), TOTAL_CHAPTERS);
    const ecart = attendu - lus;
    if(ecart > 0){
      banner.className = "banner late";
      banner.textContent = "⚠ EN RETARD DE " + ecart + " CHAPITRE(S) (global)";
    } else if(ecart === 0){
      banner.className = "banner ok";
      banner.textContent = "✓ À JOUR — objectif atteint";
    } else {
      banner.className = "banner ok";
      banner.textContent = "✓ EN AVANCE DE " + (-ecart) + " CHAPITRE(S) (global)";
    }
    detail.textContent = "Objectif global : ~" + attendu + " chapitres attendus au total  ·  Tu en as lu " + lus;
  }

  renderReminder(today);

  drawDonut(taux);
  renderPosition();
}

/* =========================================================================
   MESSAGE DU JOUR — encourageant si tu lis bien (récemment ou en volume),
   rappel bienveillant seulement après une vraie coupure sans lecture.
   Ne dépend plus seulement de la date de la dernière entrée : un gros
   rattrapage fait aujourd'hui doit être félicité, pas confondu avec un
   "où étais-tu passée ?".
   ========================================================================= */
function renderReminder(today){
  const reminder = document.getElementById('reminder');
  if(!reminder) return;
  if(!state.chapterLog.length){ reminder.style.display = 'none'; return; }

  const lastDate = state.chapterLog.reduce((max,e)=> e.date > max ? e.date : max, state.chapterLog[0].date);
  const gap = daysBetween(parseDate(lastDate), today);

  // Chapitres enregistrés au cours des 7 derniers jours (dont aujourd'hui).
  const chapitresRecents = state.chapterLog.reduce((sum,e)=>{
    const ecart = daysBetween(parseDate(e.date), today);
    if(ecart >= 0 && ecart <= 6) return sum + (e.a - e.de + 1);
    return sum;
  }, 0);

  reminder.style.display = 'block';
  reminder.className = 'reminder';

  if(gap >= 5){
    reminder.classList.add('warn');
    reminder.textContent = "👋 Où étais-tu passée ? Ça fait " + gap + " jours sans lecture enregistrée. Reprends dès que tu peux, un chapitre suffit pour repartir !";
  } else if(chapitresRecents >= 15){
    reminder.classList.add('great');
    reminder.textContent = "🎉 Bravo, belle accélération ! " + chapitresRecents + " chapitres lus ces 7 derniers jours.";
  } else if(chapitresRecents > 0){
    reminder.classList.add('good');
    reminder.textContent = "👏 Continue comme ça — " + chapitresRecents + " chapitre" + (chapitresRecents>1 ? "s" : "") + " lu" + (chapitresRecents>1 ? "s" : "") + " cette semaine.";
  } else {
    reminder.style.display = 'none';
  }
}

function drawDonut(taux){
  const svg = document.getElementById('donut');
  const r = 60, cx=80, cy=80, circ = 2*Math.PI*r;
  const luLen = circ*taux;
  svg.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E3DCC7" stroke-width="22"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#6B6440" stroke-width="22"
      stroke-dasharray="${luLen} ${circ-luLen}" stroke-dashoffset="${circ*0.25}" stroke-linecap="round"/>
    <text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="18" font-weight="bold" fill="#3A3524" font-family="Avenir,sans-serif">${(taux*100).toFixed(2)}%</text>
  `;
}

function addLog(){
  const livre = logLivreSelect.value;
  const de = parseInt(document.getElementById('logDe').value)||1;
  const a = parseInt(document.getElementById('logA').value)||de;
  const date = document.getElementById('logDate').value || todayStr();
  if(a < de){ alert('"Chapitre à" doit être supérieur ou égal à "Chapitre de".'); return; }
  const maxCh = chapters[livre];
  if(maxCh && (de > maxCh || a > maxCh)){
    alert(livre + " ne compte que " + maxCh + " chapitres. Vérifie les numéros saisis.");
    return;
  }
  const doublon = state.chapterLog.some(e=> e.date===date && e.livre===livre && e.de===de && e.a===a);
  if(doublon && !confirm("Tu as déjà enregistré exactement cette lecture (" + livre + " " + de + "-" + a + " le " + fmtDate(parseDate(date)) + "). Ça n'ajoutera pas de chapitres en double à ta progression, mais veux-tu quand même l'ajouter au journal ?")){
    return;
  }
  state.chapterLog.push({ date, livre, de, a });
  persist(); renderLog(); compute(); refreshVerseSelects();
}
function delLog(i){
  if(!confirm("Supprimer cette lecture du journal ?")) return;
  state.chapterLog.splice(i,1); persist(); renderLog(); compute();
}
function renderLog(){
  const el = document.getElementById('logList');
  if(!state.chapterLog.length){ el.innerHTML = '<div class="empty">Aucune lecture enregistrée pour le moment.</div>'; return; }
  const sorted = state.chapterLog.map((e,i)=>({date:e.date, livre:e.livre, de:e.de, a:e.a, i})).sort((a,b)=> b.date.localeCompare(a.date));
  el.innerHTML = sorted.map(e=>{
    const label = e.de===e.a ? ("chapitre "+e.de) : ("chapitres "+e.de+" à "+e.a);
    return '<div class="entry"><span class="del" onclick="delLog('+e.i+')">supprimer</span>'
      + '<div class="meta">'+fmtDate(parseDate(e.date))+' · '+e.livre+'</div>'+label+'</div>';
  }).join('');
}

function lastLogEntry(){
  if(!state.chapterLog.length) return null;
  return state.chapterLog[state.chapterLog.length-1];
}
function addComp(){
  const livre = document.getElementById('compLivre').value;
  const chapitre = parseInt(document.getElementById('compChapitre').value) || 1;
  const verset = document.getElementById('compVerset').value;
  const note = document.getElementById('compNote').value.trim();
  if(!note) return;
  state.compLog.unshift({ date: todayStr(), livre, chapitre, verset, note });
  document.getElementById('compNote').value = '';
  persist(); renderComp();
}
function delComp(i){
  if(!confirm("Supprimer cette entrée du journal de compréhension ?")) return;
  state.compLog.splice(i,1); persist(); renderComp();
}
function renderComp(){
  const el = document.getElementById('compList');
  if(!state.compLog.length){ el.innerHTML = '<div class="empty">Aucune entrée pour le moment.</div>'; return; }
  el.innerHTML = state.compLog.map((e,i)=>
    '<div class="entry"><span class="del" onclick="delComp('+i+')">supprimer</span>'
    + '<div class="meta">'+fmtDate(parseDate(e.date))+' · '+e.livre+' '+e.chapitre+(e.verset ? ':'+e.verset : '')+'</div>'
    + e.note + '</div>'
  ).join('');
}

function addPrayer(){
  const livre = document.getElementById('prayerLivre').value;
  const chapitre = parseInt(document.getElementById('prayerChapitre').value) || 1;
  const verse = document.getElementById('prayerVerse').value;
  const text = document.getElementById('prayerText').value.trim();
  if(!text) return;
  state.prayers.unshift({ date: todayStr(), reference: livre + " " + chapitre, verse, text });
  document.getElementById('prayerText').value = '';
  persist(); renderPrayers();
}
function delPrayer(i){
  if(!confirm("Supprimer cette prière ?")) return;
  state.prayers.splice(i,1); persist(); renderPrayers();
}
function renderPrayers(){
  const el = document.getElementById('prayerList');
  if(!state.prayers.length){ el.innerHTML = '<div class="empty">Aucune prière pour le moment.</div>'; return; }
  el.innerHTML = state.prayers.map((e,i)=>
    '<div class="entry"><span class="del" onclick="delPrayer('+i+')">supprimer</span>'
    + '<div class="meta">'+fmtDate(parseDate(e.date))+(e.reference ? ' · '+e.reference : '')+(e.verse ? ' · '+e.verse : '')+'</div>'
    + e.text + '</div>'
  ).join('');
}

/* =========================================================================
   VERSET DU JOUR — petite sélection de versets connus, texte Louis Segond
   1910 (domaine public). Le même verset s'affiche toute la journée, et
   change automatiquement le lendemain (calculé à partir du jour de l'année,
   donc pas besoin de synchronisation pour que ce soit cohérent).
   ========================================================================= */
const dailyVerses = [
  { ref:"Jean 3:16", text:"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle." },
  { ref:"Philippiens 4:13", text:"Je puis tout par celui qui me fortifie." },
  { ref:"Psaume 23:1", text:"L'Éternel est mon berger : je ne manquerai de rien." },
  { ref:"Josué 1:9", text:"Ne t'ai-je pas donné cet ordre : Fortifie-toi et prends courage ? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi partout où tu iras." },
  { ref:"Romains 8:28", text:"Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein." },
  { ref:"Proverbes 3:5-6", text:"Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers." },
  { ref:"Ésaïe 41:10", text:"Ne crains rien, car je suis avec toi ; ne prends pas d'inquiétude, car je suis ton Dieu ; je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante." },
  { ref:"Matthieu 6:33", text:"Cherchez premièrement le royaume et la justice de Dieu ; et toutes ces choses vous seront données par-dessus." },
  { ref:"Psaume 118:24", text:"C'est ici la journée que l'Éternel a faite : qu'elle soit pour nous un sujet d'allégresse et de joie !" },
  { ref:"Jérémie 29:11", text:"Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance." },
  { ref:"Psaume 27:1", text:"L'Éternel est ma lumière et mon salut : de qui aurais-je crainte ? L'Éternel est le soutien de ma vie : de qui aurais-je peur ?" },
  { ref:"Matthieu 11:28", text:"Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos." },
  { ref:"Psaume 46:1", text:"Dieu est pour nous un refuge et un appui, un secours qui ne manque jamais dans la détresse." },
  { ref:"Deutéronome 31:6", text:"Fortifiez-vous et ayez du courage ! Ne craignez point et ne soyez point effrayés devant eux ; car l'Éternel, ton Dieu, marchera lui-même avec toi, il ne te délaissera point, il ne t'abandonnera point." },
  { ref:"Psaume 34:8", text:"Sentez et voyez combien l'Éternel est bon ! Heureux l'homme qui cherche en lui son refuge !" },
  { ref:"Éphésiens 2:8", text:"Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu." },
  { ref:"Psaume 119:105", text:"Ta parole est une lampe à mes pieds, et une lumière sur mon sentier." },
  { ref:"Nombres 6:24-26", text:"Que l'Éternel te bénisse, et qu'il te garde ! Que l'Éternel fasse luire sa face sur toi, et qu'il t'accorde sa grâce ! Que l'Éternel tourne sa face vers toi, et qu'il te donne la paix !" },
  { ref:"Philippiens 4:6-7", text:"Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ." },
  { ref:"Psaume 121:1-2", text:"Je lève mes yeux vers les montagnes... D'où me viendra le secours ? Le secours me vient de l'Éternel, qui a fait les cieux et la terre." }
];

function renderVerseAndDate(){
  const dateEl = document.getElementById('todayDate');
  if(dateEl){
    const d = new Date();
    let txt = d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    dateEl.textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
  }
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / (1000*60*60*24));
  const v = dailyVerses[dayOfYear % dailyVerses.length];
  const vt = document.getElementById('verseText');
  const vr = document.getElementById('verseRef');
  if(vt) vt.textContent = "« " + v.text + " »";
  if(vr) vr.textContent = v.ref;
  // La couleur de la carte tourne toute seule chaque jour (7 tons fixes),
  // toujours indépendante de la palette choisie dans Paramètres.
  const verseCard = document.querySelector('.verse-card');
  if(verseCard) verseCard.className = 'card verse-card vc' + (dayOfYear % 7);
}

/* =========================================================================
   PLANS THÉMATIQUES — courts plans (3 à 7 jours), construits uniquement à
   partir de versets bibliques (Louis Segond, 1910, domaine public) avec
   une prière pour chaque jour. Indépendants du plan principal de 66 mois.
   ========================================================================= */
const THEMATIC_PLANS = [
  { id:'parole', titre:"Parler et déclarer la Parole de Dieu", jours:[
    { ref:"Josué 1:8", texte:"Que ce livre de la loi ne s'éloigne point de ta bouche ; médite-le jour et nuit, pour agir fidèlement selon tout ce qui y est écrit ; car c'est alors que tu réussiras dans tes entreprises, c'est alors que tu prospéreras.", priere:"Seigneur, apprends-moi à garder ta Parole dans ma bouche et à la déclarer avec foi aujourd'hui." },
    { ref:"Ésaïe 55:11", texte:"ainsi en est-il de ma parole, qui sort de ma bouche : elle ne retourne point à moi sans effet, sans avoir exécuté ma volonté et accompli mes desseins.", priere:"Merci Seigneur que ta Parole agit même quand je ne vois pas encore le résultat. Je choisis de m'y accrocher aujourd'hui." },
    { ref:"Marc 11:23", texte:"Je vous le dis en vérité, si quelqu'un dit à cette montagne : Ôte-toi de là et jette-toi dans la mer, et s'il ne doute point en son cœur, mais croit que ce qu'il dit arrive, il le verra s'accomplir.", priere:"Seigneur, augmente ma foi pour que mes paroles s'alignent avec les tiennes, sans douter." },
    { ref:"Proverbes 18:21", texte:"La mort et la vie sont au pouvoir de la langue ; celui qui l'aime en mangera les fruits.", priere:"Aide-moi aujourd'hui à choisir des paroles de vie sur moi-même et sur les miens." },
    { ref:"Hébreux 4:12", texte:"Car la parole de Dieu est vivante et efficace, plus tranchante qu'une épée quelconque à deux tranchants, pénétrante jusqu'à partager âme et esprit, jointures et moelles ; elle juge les sentiments et les pensées du cœur.", priere:"Seigneur, que ta Parole vivante fasse son œuvre en moi aujourd'hui." },
    { ref:"Romains 10:17", texte:"Ainsi la foi vient de ce qu'on entend, et ce qu'on entend vient de la parole de Christ.", priere:"Seigneur, nourris ma foi aujourd'hui par ta Parole entendue et déclarée." },
    { ref:"Actes 4:31", texte:"Quand ils eurent prié, le lieu où ils étaient assemblés trembla ; ils furent tous remplis du Saint-Esprit, et ils annonçaient la parole de Dieu avec assurance.", priere:"Donne-moi cette même assurance pour parler de toi aujourd'hui." }
  ]},
  { id:'jeune', titre:"Le jeûne", jours:[
    { ref:"Ésaïe 58:6", texte:"Voici le jeûne auquel je prends plaisir : détache les chaînes de la méchanceté, dénoue les liens de la servitude, renvoie libres les opprimés, et que l'on rompe toute espèce de joug.", priere:"Seigneur, montre-moi le vrai sens de mon jeûne : que mon cœur se tourne vers ce qui te plaît." },
    { ref:"Matthieu 6:17-18", texte:"Mais quand tu jeûnes, parfume ta tête et lave ton visage, afin de ne pas montrer aux hommes que tu jeûnes, mais à ton Père qui est là dans le lieu secret ; et ton Père, qui voit dans le secret, te le rendra.", priere:"Père, que mon jeûne soit pour toi seul, dans le secret, sans chercher le regard des autres." },
    { ref:"Joël 2:12", texte:"Maintenant encore, dit l'Éternel, revenez à moi de tout votre cœur, avec des jeûnes, avec des pleurs et des lamentations !", priere:"Seigneur, je reviens à toi de tout mon cœur aujourd'hui." },
    { ref:"2 Chroniques 20:3", texte:"Dans sa frayeur, Josaphat se disposa à consulter l'Éternel, et il publia un jeûne pour tout Juda.", priere:"Comme Josaphat, je me tourne vers toi par le jeûne dans les moments où j'ai besoin de ta direction." },
    { ref:"Daniel 9:3", texte:"Je tournai ma face vers le Seigneur Dieu, afin de recourir à la prière et aux supplications, en jeûnant et en revêtant le sac et la cendre.", priere:"Seigneur, je tourne mon visage vers toi aujourd'hui, avec humilité." },
    { ref:"Matthieu 9:15", texte:"Jésus leur répondit : Les amis de l'époux peuvent-ils s'affliger pendant que l'époux est avec eux ? Les jours viendront où l'époux leur sera enlevé, et alors ils jeûneront.", priere:"Seigneur, apprends-moi à reconnaître le bon moment pour jeûner." },
    { ref:"Ésaïe 58:8", texte:"Alors ta lumière poindra comme l'aurore, et ta guérison germera promptement ; ta justice marchera devant toi, et la gloire de l'Éternel sera ton arrière-garde.", priere:"Merci pour la lumière et la guérison que tu promets après le jeûne." }
  ]},
  { id:'amour', titre:"L'amour de Dieu", jours:[
    { ref:"Jean 3:16", texte:"Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", priere:"Merci Seigneur pour cet amour qui a tout donné pour moi." },
    { ref:"Romains 5:8", texte:"Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.", priere:"Merci de m'avoir aimée avant même que je le mérite." },
    { ref:"1 Jean 4:19", texte:"Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.", priere:"Apprends-moi à aimer les autres comme tu m'as aimée en premier." },
    { ref:"Sophonie 3:17", texte:"L'Éternel, ton Dieu, est au milieu de toi, comme un héros qui sauve ; il fera de toi sa plus grande joie ; il gardera le silence dans son amour ; il aura pour toi des transports d'allégresse.", priere:"Merci Seigneur de te réjouir de moi. Aide-moi à recevoir cet amour aujourd'hui." },
    { ref:"Romains 8:38-39", texte:"Car j'ai l'assurance que ni la mort ni la vie, ni les anges ni les dominations, ni les choses présentes ni les choses à venir, ni les puissances, ni la hauteur, ni la profondeur, ni aucune autre créature ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.", priere:"Merci que rien ne puisse me séparer de ton amour, quoi qu'il arrive aujourd'hui." },
    { ref:"1 Jean 4:16", texte:"Dieu est amour ; et celui qui demeure dans l'amour demeure en Dieu, et Dieu demeure en lui.", priere:"Seigneur, aide-moi à demeurer dans ton amour aujourd'hui." },
    { ref:"Psaume 136:1", texte:"Louez l'Éternel, car il est bon, car sa miséricorde dure à toujours !", priere:"Merci Seigneur pour ta bonté qui ne s'arrête jamais." }
  ]},
  { id:'priere', titre:"La prière", jours:[
    { ref:"Marc 11:24", texte:"C'est pourquoi je vous dis : Tout ce que vous demanderez en priant, croyez que vous l'avez reçu, et vous le verrez s'accomplir.", priere:"Seigneur, augmente ma foi quand je te présente mes demandes aujourd'hui." },
    { ref:"Matthieu 6:6", texte:"Mais quand tu pries, entre dans ta chambre, ferme ta porte, et prie ton Père qui est là dans le lieu secret ; et ton Père, qui voit dans le secret, te le rendra.", priere:"Merci pour ce lieu secret où je peux te parler librement." },
    { ref:"Jacques 5:16", texte:"confessez vos péchés les uns aux autres, et priez les uns pour les autres, afin que vous soyez guéris. La prière fervente du juste a une grande efficace.", priere:"Apprends-moi à prier avec ferveur, pour moi et pour les autres." },
    { ref:"1 Thessaloniciens 5:17", texte:"Priez sans cesse.", priere:"Seigneur, aide-moi à garder un dialogue avec toi tout au long de cette journée." },
    { ref:"Jérémie 33:3", texte:"Invoque-moi, et je te répondrai ; je t'annoncerai de grandes choses, des choses cachées, que tu ne connais pas.", priere:"Je t'invoque aujourd'hui, Seigneur : parle-moi." },
    { ref:"Luc 18:1", texte:"Jésus leur adressa une parabole, pour montrer qu'il faut toujours prier, et ne point se relâcher.", priere:"Aide-moi à persévérer dans la prière aujourd'hui, sans me décourager." },
    { ref:"Éphésiens 6:18", texte:"Faites en tout temps par l'Esprit toutes sortes de prières et de supplications. Veillez à cela avec une entière persévérance, et priez pour tous les saints.", priere:"Seigneur, mets sur mon cœur les personnes pour qui je dois prier aujourd'hui." }
  ]},
  { id:'saint-esprit', titre:"Le Saint-Esprit", jours:[
    { ref:"Actes 1:8", texte:"Mais vous recevrez une puissance, le Saint-Esprit survenant sur vous, et vous serez mes témoins.", priere:"Remplis-moi de ta puissance aujourd'hui, Seigneur." },
    { ref:"Jean 14:26", texte:"Mais le consolateur, l'Esprit-Saint, que le Père enverra en mon nom, vous enseignera toutes choses, et vous rappellera tout ce que je vous ai dit.", priere:"Merci pour ton Esprit qui m'enseigne et me rappelle ta Parole." },
    { ref:"Galates 5:22-23", texte:"Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance ; la loi n'est pas contre ces choses.", priere:"Fais grandir ce fruit en moi aujourd'hui, Seigneur." },
    { ref:"Romains 8:26", texte:"De même aussi l'Esprit nous aide dans notre faiblesse, car nous ne savons pas ce qu'il nous convient de demander dans nos prières.", priere:"Merci de m'aider dans ma faiblesse, même quand je ne sais pas quoi te dire." },
    { ref:"Zacharie 4:6", texte:"ce n'est ni par la puissance ni par la force, mais c'est par mon Esprit, dit l'Éternel des armées.", priere:"Seigneur, que ce soit ton Esprit qui agisse aujourd'hui, pas mes seules forces." },
    { ref:"Jean 14:16-17", texte:"Et moi, je prierai le Père, et il vous donnera un autre consolateur, afin qu'il demeure éternellement avec vous, l'Esprit de vérité.", priere:"Merci pour ta présence permanente en moi par ton Esprit." },
    { ref:"Actes 2:4", texte:"Et ils furent tous remplis du Saint-Esprit, et se mirent à parler en d'autres langues, selon que l'Esprit leur donnait de s'exprimer.", priere:"Remplis-moi à nouveau de ton Esprit aujourd'hui, Seigneur." }
  ]},
  { id:'marcher-jesus', titre:"Marcher avec Jésus, son attitude", jours:[
    { ref:"Philippiens 2:5", texte:"Ayez en vous les sentiments qui étaient en Jésus-Christ.", priere:"Seigneur, forme en moi tes sentiments aujourd'hui." },
    { ref:"Matthieu 11:29", texte:"Prenez mon joug sur vous et recevez mes instructions, car je suis doux et humble de cœur ; et vous trouverez du repos pour vos âmes.", priere:"Apprends-moi ta douceur et ton humilité, Seigneur." },
    { ref:"Jean 13:15", texte:"car je vous ai donné un exemple, afin que vous fassiez comme je vous ai fait.", priere:"Aide-moi à suivre ton exemple envers les personnes que je croiserai aujourd'hui." },
    { ref:"Luc 6:31", texte:"Ce que vous voulez que les hommes fassent pour vous, faites-le de même pour eux.", priere:"Seigneur, aide-moi à traiter les autres comme j'aimerais être traitée." },
    { ref:"1 Pierre 2:21", texte:"Et c'est à cela que vous avez été appelés, parce que Christ aussi a souffert pour vous, vous laissant un exemple, afin que vous suiviez ses traces.", priere:"Merci pour ton exemple. Aide-moi à marcher dans tes traces aujourd'hui." },
    { ref:"Colossiens 3:12", texte:"Ainsi donc, comme des élus de Dieu, saints et bien-aimés, revêtez-vous d'entrailles de miséricorde, de bonté, d'humilité, de douceur, de patience.", priere:"Seigneur, revêts-moi de ton caractère aujourd'hui." },
    { ref:"Jean 15:5", texte:"Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire.", priere:"Aide-moi à demeurer en toi aujourd'hui, dans chaque décision." }
  ]},
  { id:'tentation', titre:"Résister à la tentation", jours:[
    { ref:"1 Corinthiens 10:13", texte:"Aucune tentation ne vous est survenue qui n'ait été humaine, et Dieu, qui est fidèle, ne permettra pas que vous soyez tentés au delà de vos forces ; mais avec la tentation il préparera aussi le moyen d'en sortir, afin que vous puissiez la supporter.", priere:"Merci Seigneur que tu prépares toujours une issue. Aide-moi à la voir aujourd'hui." },
    { ref:"Jacques 4:7", texte:"Soumettez-vous donc à Dieu ; résistez au diable, et il fuira loin de vous.", priere:"Je me soumets à toi aujourd'hui, Seigneur, et je résiste à ce qui m'éloigne de toi." },
    { ref:"Matthieu 26:41", texte:"Veillez et priez, afin que vous ne tombiez pas dans la tentation ; l'esprit est bien disposé, mais la chair est faible.", priere:"Aide-moi à veiller et à prier plutôt que de compter sur mes propres forces." },
    { ref:"Éphésiens 6:11", texte:"Revêtez-vous de toutes les armes de Dieu, afin de pouvoir tenir ferme contre les ruses du diable.", priere:"Seigneur, revêts-moi de tes armes aujourd'hui." },
    { ref:"Psaume 119:11", texte:"Je serre ta parole dans mon cœur, afin de ne pas pécher contre toi.", priere:"Aide-moi à garder ta Parole tout près de mon cœur aujourd'hui." },
    { ref:"Hébreux 4:15", texte:"Car nous n'avons pas un souverain sacrificateur qui ne puisse compatir à nos faiblesses ; au contraire, il a été tenté comme nous en toutes choses, sans commettre de péché.", priere:"Merci Jésus de comprendre mes luttes. Aide-moi comme toi à résister sans céder." },
    { ref:"Jacques 1:12", texte:"Heureux l'homme qui supporte patiemment la tentation ; car, après avoir été éprouvé, il recevra la couronne de vie, que le Seigneur a promise à ceux qui l'aiment.", priere:"Donne-moi la persévérance dans l'épreuve aujourd'hui, Seigneur." }
  ]},
  { id:'reves', titre:"Les rêves et les visions", jours:[
    { ref:"Joël 2:28", texte:"Après cela, je répandrai mon esprit sur toute chair ; vos fils et vos filles prophétiseront, vos vieillards auront des songes, et vos jeunes gens des visions.", priere:"Seigneur, parle-moi, même dans mon sommeil, et donne-moi un cœur qui écoute." },
    { ref:"Genèse 37:5", texte:"Joseph eut un songe, et il le raconta à ses frères, qui le haïrent encore davantage.", priere:"Seigneur, aide-moi à garder précieusement ce que tu me montres, même quand ce n'est pas encore compris par tous." },
    { ref:"Genèse 28:12", texte:"Il eut un songe. Et voici, une échelle était appuyée sur la terre, et son sommet touchait au ciel. Et voici, les anges de Dieu montaient et descendaient par cette échelle.", priere:"Seigneur, rappelle-moi que le ciel est proche de moi, même quand je ne le vois pas." },
    { ref:"Daniel 1:17", texte:"Dieu accorda à ces quatre jeunes gens de la science, de l'intelligence dans toutes les lettres et une sagesse ; et Daniel expliquait toutes les visions et tous les songes.", priere:"Donne-moi la sagesse de comprendre ce que tu veux me montrer, Seigneur." },
    { ref:"Matthieu 1:20", texte:"Comme il y pensait, voici, un ange du Seigneur lui apparut en songe, et dit : Joseph, fils de David, ne crains pas de prendre avec toi Marie, ta femme, car l'enfant qu'elle a conçu vient du Saint-Esprit.", priere:"Seigneur, guide-moi comme tu as guidé Joseph, même dans mes moments de doute." },
    { ref:"Actes 16:9", texte:"Pendant la nuit, Paul eut une vision : un Macédonien lui apparut, et lui fit cette prière : Passe en Macédoine, secours-nous !", priere:"Seigneur, montre-moi où tu veux m'envoyer et ce que tu veux que je fasse." },
    { ref:"Nombres 12:6", texte:"il dit : Écoutez bien mes paroles ! Lorsqu'il y aura parmi vous un prophète, c'est dans une vision que moi, l'Éternel, je me révélerai à lui, c'est dans un songe que je lui parlerai.", priere:"Merci Seigneur de te révéler à moi de différentes façons. Garde mon cœur attentif." }
  ]},
  { id:'forteresses', titre:"Fermer les forteresses démoniaques", jours:[
    { ref:"2 Corinthiens 10:4-5", texte:"car les armes avec lesquelles nous combattons ne sont pas charnelles ; mais elles sont puissantes, par la vertu de Dieu, pour renverser des forteresses. Nous renversons les raisonnements et toute hauteur qui s'élève contre la connaissance de Dieu, et nous amenons toute pensée captive à l'obéissance de Christ.", priere:"Seigneur, je remets mes pensées captives à ton obéissance aujourd'hui." },
    { ref:"Éphésiens 6:12", texte:"Car nous n'avons pas à lutter contre la chair et le sang, mais contre les dominations, contre les autorités, contre les princes de ce monde de ténèbres, contre les esprits méchants dans les lieux célestes.", priere:"Ouvre mes yeux sur le vrai combat, Seigneur, et arme-moi pour aujourd'hui." },
    { ref:"Luc 10:19", texte:"Voici, je vous ai donné le pouvoir de marcher sur les serpents et les scorpions, et sur toute la puissance de l'ennemi ; et rien ne pourra vous nuire.", priere:"Merci pour l'autorité que tu me donnes. J'avance aujourd'hui sans crainte." },
    { ref:"1 Jean 4:4", texte:"Vous, petits enfants, vous êtes de Dieu, et vous les avez vaincus, parce que celui qui est en vous est plus grand que celui qui est dans le monde.", priere:"Merci que celui qui est en moi est plus grand que tout ce qui m'oppose." },
    { ref:"Marc 16:17", texte:"Voici les miracles qui accompagneront ceux qui auront cru : en mon nom, ils chasseront les démons ; ils parleront de nouvelles langues.", priere:"Seigneur, donne-moi de marcher avec l'autorité que tu promets à ceux qui croient." },
    { ref:"Colossiens 2:15", texte:"il a dépouillé les dominations et les autorités, et les a livrées publiquement en spectacle, en triomphant d'elles par la croix.", priere:"Merci Jésus pour ta victoire déjà remportée sur tout ce qui m'oppose." },
    { ref:"Apocalypse 12:11", texte:"Ils l'ont vaincu à cause du sang de l'agneau et à cause de la parole de leur témoignage, et ils n'ont pas aimé leur vie jusqu'à craindre la mort.", priere:"Seigneur, aide-moi à tenir ferme dans mon témoignage aujourd'hui." }
  ]},
  { id:'connaitre-dieu', titre:"Connaître Dieu", jours:[
    { ref:"Jérémie 9:24", texte:"mais que celui qui veut se glorifier se glorifie de ce qu'il a l'intelligence de me connaître, et de savoir que je suis l'Éternel qui exerce la bonté, le droit et la justice sur la terre.", priere:"Seigneur, je veux te connaître toi, plus que tout le reste." },
    { ref:"Jean 17:3", texte:"Or, la vie éternelle, c'est qu'ils te connaissent, toi, le seul vrai Dieu, et celui que tu as envoyé, Jésus-Christ.", priere:"Merci pour cette vie éternelle qui commence par te connaître dès aujourd'hui." },
    { ref:"Philippiens 3:10", texte:"Afin de connaître Christ, et la puissance de sa résurrection, et la communion de ses souffrances, en devenant conforme à lui dans sa mort.", priere:"Fais-moi connaître ta puissance et ta présence aujourd'hui, Seigneur." },
    { ref:"Osée 6:3", texte:"Connaissons, cherchons à connaître l'Éternel ; sa venue est aussi certaine que celle de l'aurore.", priere:"J'ai soif de te connaître davantage, Seigneur." },
    { ref:"Psaume 46:11", texte:"Arrêtez, et sachez que je suis Dieu.", priere:"Seigneur, aide-moi à m'arrêter aujourd'hui pour reconnaître qui tu es." },
    { ref:"Colossiens 1:10", texte:"afin de vous conduire d'une manière digne du Seigneur et lui être entièrement agréables, portant des fruits en toute bonne œuvre et croissant par la connaissance de Dieu.", priere:"Fais-moi grandir dans ta connaissance aujourd'hui, Seigneur." },
    { ref:"1 Chroniques 28:9", texte:"connais le Dieu de ton père, et sers-le avec un cœur dévoué et l'âme empressée ; car l'Éternel sonde tous les cœurs, et il discerne toute la suite des pensées.", priere:"Seigneur, sonde mon cœur et rapproche-moi de toi aujourd'hui." }
  ]},
  { id:'education-enfants', titre:"L'éducation des enfants", jours:[
    { ref:"Proverbes 22:6", texte:"Instruis l'enfant selon la voie qu'il doit suivre ; et quand il sera vieux, il ne s'en détournera pas.", priere:"Seigneur, donne-moi la sagesse pour guider mon enfant sur ton chemin." },
    { ref:"Deutéronome 6:6-7", texte:"Et ces commandements, que je te donne aujourd'hui, seront dans ton cœur. Tu les inculqueras à tes enfants, et tu en parleras quand tu seras dans ta maison, quand tu iras en voyage, quand tu te coucheras et quand tu te lèveras.", priere:"Aide-moi à transmettre ta Parole à mon enfant, dans les petits moments du quotidien." },
    { ref:"Éphésiens 6:4", texte:"Et vous, pères, n'irritez pas vos enfants, mais élevez-les en les corrigeant et en les instruisant selon le Seigneur.", priere:"Seigneur, donne-moi patience et douceur dans la façon dont je corrige et j'instruis." },
    { ref:"Proverbes 29:17", texte:"Chatie ton fils, et il te donnera du repos, et il procurera des délices à ton âme.", priere:"Merci pour la promesse de paix qui accompagne une bonne éducation. Aide-moi à persévérer." },
    { ref:"Proverbes 13:24", texte:"Celui qui épargne la verge hait son fils, mais celui qui l'aime cherche à le corriger.", priere:"Donne-moi l'équilibre entre fermeté et amour dans l'éducation de mon enfant." },
    { ref:"Marc 10:14", texte:"Jésus, voyant cela, fut indigné, et leur dit : Laissez venir à moi les petits enfants, et ne les empêchez pas ; car le royaume de Dieu est pour ceux qui leur ressemblent.", priere:"Merci pour la place que tu donnes aux enfants dans ton cœur. Aide-moi à les accueillir comme toi." },
    { ref:"Proverbes 1:8", texte:"Écoute, mon fils, l'instruction de ton père, et ne rejette pas l'enseignement de ta mère.", priere:"Aide-moi à transmettre une instruction que mon enfant voudra recevoir." }
  ]},
  { id:'guerison-coeur', titre:"La guérison du cœur (blessures intérieures)", jours:[
    { ref:"Psaume 147:3", texte:"Il guérit ceux qui ont le cœur brisé, et il panse leurs blessures.", priere:"Seigneur, viens panser ce qui est encore blessé en moi aujourd'hui." },
    { ref:"Ésaïe 61:1", texte:"L'esprit du Seigneur, l'Éternel, est sur moi, car l'Éternel m'a oint pour porter de bonnes nouvelles aux malheureux ; il m'a envoyé pour guérir ceux qui ont le cœur brisé, pour proclamer aux captifs la liberté, et aux prisonniers la délivrance.", priere:"Merci pour la liberté que tu offres. Je reçois ta délivrance aujourd'hui." },
    { ref:"Psaume 34:18", texte:"L'Éternel est près de ceux qui ont le cœur brisé, et il sauve ceux qui ont l'esprit dans l'abattement.", priere:"Merci d'être proche de moi précisément là où j'ai mal." },
    { ref:"Jérémie 30:17", texte:"Mais je te guérirai, je panserai tes plaies, dit l'Éternel.", priere:"Je reçois ta guérison aujourd'hui, Seigneur, à mon rythme." },
    { ref:"Ésaïe 53:5", texte:"Mais il était blessé pour nos péchés, brisé pour nos iniquités ; le châtiment qui nous donne la paix est tombé sur lui, et c'est par ses meurtrissures que nous sommes guéris.", priere:"Merci Jésus d'avoir porté ce que je ne pouvais pas porter seule." },
    { ref:"Ésaïe 40:29", texte:"Il donne de la force à celui qui est fatigué, et il augmente la vigueur de celui qui tombe en défaillance.", priere:"Seigneur, renouvelle mes forces aujourd'hui, là où je suis fatiguée." },
    { ref:"Psaume 73:26", texte:"Ma chair et mon cœur peuvent se consumer : Dieu sera toujours le rocher de mon cœur et mon partage.", priere:"Merci d'être mon rocher, même quand tout le reste vacille." }
  ]},
  { id:'amis', titre:"Les amis", jours:[
    { ref:"Proverbes 17:17", texte:"L'ami aime en tout temps, et dans le malheur il se montre un frère.", priere:"Merci Seigneur pour les amis fidèles que tu places sur ma route." },
    { ref:"Ecclésiaste 4:9-10", texte:"Deux valent mieux qu'un, parce qu'ils retirent un bon salaire de leur travail. Car, s'ils tombent, l'un relèvera son compagnon ; mais malheur à celui qui est seul et qui tombe, sans avoir un second pour le relever !", priere:"Aide-moi à être une amie qui relève, et à accepter d'être relevée aussi." },
    { ref:"Jean 15:13", texte:"Il n'y a pas de plus grand amour que de donner sa vie pour ses amis.", priere:"Merci Jésus pour ton amitié qui va jusqu'au don total." },
    { ref:"Proverbes 18:24", texte:"Celui qui a des amis doit se montrer ami, et il y a tel ami plus attaché qu'un frère.", priere:"Apprends-moi à être une amie présente et fidèle aujourd'hui." },
    { ref:"1 Samuel 18:1", texte:"L'âme de Jonathan s'attacha à l'âme de David, et Jonathan l'aima comme son âme.", priere:"Merci pour les amitiés profondes. Fortifie celles que je vis aujourd'hui." },
    { ref:"Proverbes 27:6", texte:"Les blessures d'un ami prouvent sa fidélité, mais les baisers d'un ennemi sont trompeurs.", priere:"Aide-moi à accueillir la vérité venant d'une amie sincère, même quand elle dérange." },
    { ref:"Romains 1:12", texte:"c'est-à-dire, que nous nous consolions mutuellement par la foi qui nous est commune, à vous et à moi.", priere:"Merci pour les amies avec qui je peux partager ma foi et être encouragée." }
  ]},
  { id:'relations-sociales', titre:"Les relations sociales", jours:[
    { ref:"Romains 12:18", texte:"S'il est possible, autant que cela dépend de vous, soyez en paix avec tous les hommes.", priere:"Aide-moi à rechercher la paix dans mes relations aujourd'hui." },
    { ref:"Romains 12:10", texte:"Par amour fraternel, soyez pleins d'affection les uns pour les autres ; par honneur, usez de prévenances réciproques.", priere:"Donne-moi un cœur attentif et honorant envers les autres aujourd'hui." },
    { ref:"Colossiens 3:13", texte:"Supportez-vous les uns les autres, et, si l'un a sujet de se plaindre de l'autre, pardonnez-vous réciproquement. De même que Christ vous a pardonné, pardonnez-vous aussi.", priere:"Seigneur, aide-moi à pardonner comme tu m'as pardonnée." },
    { ref:"Proverbes 27:9", texte:"L'huile et les parfums réjouissent le cœur, et les conseils affectueux d'un ami sont doux.", priere:"Merci pour les bons conseils reçus. Rends-moi aussi source d'encouragement pour les autres." },
    { ref:"Hébreux 10:24-25", texte:"Veillons les uns sur les autres, pour nous exciter à la charité et aux bonnes œuvres. N'abandonnons pas notre assemblée, comme c'est la coutume de quelques-uns ; mais exhortons-nous réciproquement.", priere:"Aide-moi à rester connectée à une communauté qui m'encourage dans la foi." },
    { ref:"1 Pierre 4:9", texte:"Exercez l'hospitalité les uns envers les autres, sans murmures.", priere:"Donne-moi un cœur accueillant envers les autres aujourd'hui, sans arrière-pensée." },
    { ref:"Galates 6:2", texte:"Portez les fardeaux les uns des autres, et vous accomplirez ainsi la loi de Christ.", priere:"Aide-moi à porter le fardeau de quelqu'un aujourd'hui, avec amour." }
  ]},
  { id:'relations-sexuelles', titre:"Les relations conjugales", jours:[
    { ref:"Hébreux 13:4", texte:"Le mariage est honorable en tous, et le lit conjugal sans souillure, car Dieu jugera les impudiques et les adultères.", priere:"Seigneur, aide-moi à honorer ce que tu as institué comme saint." },
    { ref:"Cantique des Cantiques 8:6", texte:"Mets-moi comme un sceau sur ton cœur, comme un sceau sur ton bras ; car l'amour est fort comme la mort, la jalousie est inflexible comme le séjour des morts ; ses ardeurs sont des ardeurs de feu, une flamme de l'Éternel.", priere:"Merci pour la force et la beauté de l'amour que tu as créé." },
    { ref:"Genèse 2:24", texte:"C'est pourquoi l'homme quittera son père et sa mère, et s'attachera à sa femme, et ils deviendront une seule chair.", priere:"Seigneur, fortifie l'union et l'intimité dans mon couple." },
    { ref:"1 Corinthiens 7:3", texte:"Que le mari rende à sa femme l'affection qui lui est due, et que la femme agisse de même envers son mari.", priere:"Seigneur, aide-nous à nous donner l'un à l'autre avec amour et attention." },
    { ref:"1 Thessaloniciens 4:3-4", texte:"Ce que Dieu veut, c'est votre sanctification ; c'est que vous vous absteniez de l'impudicité ; c'est que chacun de vous sache posséder son corps avec sainteté et honnêteté.", priere:"Seigneur, garde mon cœur et mon corps dans la sainteté que tu désires pour moi." },
    { ref:"Proverbes 18:22", texte:"Celui qui trouve une femme trouve le bonheur ; c'est une grâce qu'il obtient de l'Éternel.", priere:"Merci Seigneur pour la grâce du mariage et de l'union que tu bénis." },
    { ref:"Colossiens 3:14", texte:"Mais par-dessus toutes ces choses revêtez-vous de la charité, qui est le lien de la perfection.", priere:"Que l'amour reste le lien qui unit mon couple, par-dessus tout le reste." }
  ]},
  { id:'famille', titre:"La famille", jours:[
    { ref:"Josué 24:15", texte:"quant à moi et à ma maison, nous servirons l'Éternel.", priere:"Seigneur, je choisis aujourd'hui de servir avec ma famille." },
    { ref:"Psaume 127:1", texte:"Si l'Éternel ne bâtit la maison, ceux qui la bâtissent travaillent en vain.", priere:"Bâtis toi-même ma maison, Seigneur, je te confie ma famille." },
    { ref:"Éphésiens 5:25", texte:"Maris, aimez vos femmes, comme Christ a aimé l'Église, et s'est livré lui-même pour elle.", priere:"Seigneur, que l'amour dans ma famille reflète le tien." },
    { ref:"Éphésiens 6:1-3", texte:"Enfants, obéissez à vos parents, selon le Seigneur, car cela est juste. Honore ton père et ta mère... afin que tu sois heureux et que tu vives longtemps sur la terre.", priere:"Merci pour tes promesses sur ma famille. Aide-nous à nous honorer les uns les autres." },
    { ref:"Proverbes 24:3-4", texte:"C'est par la sagesse qu'une maison s'élève, et par l'intelligence qu'elle s'affermit ; c'est par la science que les chambres se remplissent de tous les biens précieux et agréables.", priere:"Donne-moi la sagesse pour bâtir un foyer stable et paisible." },
    { ref:"Genèse 18:19", texte:"Car je l'ai choisi, afin qu'il ordonne à ses fils et à sa maison après lui de garder la voie de l'Éternel, en pratiquant la droiture et la justice.", priere:"Seigneur, aide-moi à transmettre ta voie à ma famille par mon exemple." },
    { ref:"1 Timothée 5:8", texte:"Si quelqu'un n'a pas soin des siens, et principalement de ceux de sa famille, il a renié la foi, et il est pire qu'un infidèle.", priere:"Donne-moi le cœur pour prendre soin des miens avec fidélité." }
  ]},
  { id:'projets', titre:"Les projets", jours:[
    { ref:"Proverbes 16:3", texte:"Recommande à l'Éternel tes œuvres, et tes projets réussiront.", priere:"Seigneur, je te confie mes projets aujourd'hui." },
    { ref:"Proverbes 16:9", texte:"Le cœur de l'homme médite sa voie, mais c'est l'Éternel qui dirige ses pas.", priere:"Dirige mes pas, Seigneur, même quand je fais mes propres plans." },
    { ref:"Jacques 4:15", texte:"Vous devriez dire, au contraire : Si Dieu le veut, nous vivrons, et nous ferons ceci ou cela.", priere:"Que ta volonté guide mes projets, plus que mes envies." },
    { ref:"Psaume 20:4-5", texte:"Qu'il te donne ce que ton cœur désire, et qu'il accomplisse tous tes desseins !", priere:"Merci de t'intéresser à mes désirs. J'attends l'accomplissement de tes promesses." },
    { ref:"Proverbes 21:5", texte:"Les projets de l'homme diligent ne mènent qu'à l'abondance, mais celui qui agit avec précipitation n'arrive qu'à la disette.", priere:"Aide-moi à avancer dans mes projets avec constance, sans précipitation." },
    { ref:"Proverbes 15:22", texte:"Les projets échouent, faute d'une assemblée qui délibère ; mais ils réussissent quand il y a de nombreux conseillers.", priere:"Seigneur, entoure-moi de bons conseils pour mes projets." },
    { ref:"Psaume 37:5", texte:"Recommande ton sort à l'Éternel, mets en lui ta confiance, et il agira.", priere:"Je te remets mes projets aujourd'hui, Seigneur, avec confiance." }
  ]},
  { id:'finances', titre:"Les finances", jours:[
    { ref:"Malachie 3:10", texte:"Apportez à la maison du trésor toutes les dîmes, afin qu'il y ait de la nourriture dans ma maison ; mettez-moi de la sorte à l'épreuve, dit l'Éternel des armées. Et vous verrez si je n'ouvre pas pour vous les écluses des cieux, si je ne répands pas sur vous la bénédiction en abondance.", priere:"Seigneur, aide-moi à être fidèle dans ce que tu me confies." },
    { ref:"Philippiens 4:19", texte:"Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus-Christ.", priere:"Merci de pourvoir à mes besoins. J'ai confiance en ta provision." },
    { ref:"Proverbes 3:9-10", texte:"Honore l'Éternel avec tes biens, et avec les prémices de tout ton revenu : alors tes greniers seront remplis d'abondance, et tes cuves regorgeront de moût.", priere:"Aide-moi à t'honorer dans ma façon de gérer ce que je reçois." },
    { ref:"Deutéronome 8:18", texte:"Souviens-toi de l'Éternel, ton Dieu, car c'est lui qui te donnera de la force pour les acquérir.", priere:"Merci Seigneur, c'est toi la source de tout ce que j'ai." },
    { ref:"Luc 6:38", texte:"Donnez, et il vous sera donné : on versera dans votre sein une bonne mesure, serrée, secouée et qui déborde ; car on vous mesurera avec la mesure dont vous vous serez servis.", priere:"Apprends-moi à donner avec un cœur généreux et confiant." },
    { ref:"Proverbes 13:11", texte:"La richesse mal acquise diminue, mais celui qui amasse peu à peu l'augmente.", priere:"Donne-moi la patience de bâtir petit à petit, honnêtement." },
    { ref:"2 Corinthiens 9:7", texte:"Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie.", priere:"Seigneur, donne-moi un cœur joyeux quand je donne." }
  ]},
  { id:'plan-de-dieu', titre:"Le plan de Dieu", jours:[
    { ref:"Psaume 138:8", texte:"L'Éternel agira en ma faveur. Éternel, ta bonté dure toujours : n'abandonne pas les œuvres de tes mains.", priere:"Merci de ne pas abandonner ce que tu as commencé en moi." },
    { ref:"Ésaïe 46:10", texte:"J'annonce dès le commencement ce qui doit arriver, et longtemps d'avance ce qui n'est pas encore accompli ; je dis : Mes arrêts subsisteront, et j'exécuterai toute ma volonté.", priere:"Merci que ton dessein s'accomplira, quoi qu'il arrive." },
    { ref:"Ésaïe 55:8-9", texte:"Car mes pensées ne sont pas vos pensées, et vos voies ne sont pas mes voies, dit l'Éternel. Autant les cieux sont élevés au-dessus de la terre, autant mes voies sont élevées au-dessus de vos voies, et mes pensées au-dessus de vos pensées.", priere:"Seigneur, aide-moi à faire confiance à tes voies même quand elles dépassent les miennes." },
    { ref:"Proverbes 19:21", texte:"Il y a dans le cœur de l'homme beaucoup de projets, mais c'est le dessein de l'Éternel qui s'accomplit.", priere:"Que ton dessein s'accomplisse dans ma vie, au-delà de mes propres plans." },
    { ref:"Éphésiens 2:10", texte:"Car nous sommes son ouvrage, ayant été créés en Jésus-Christ pour de bonnes œuvres, que Dieu a préparées d'avance, afin que nous les pratiquions.", priere:"Merci d'avoir préparé d'avance de bonnes œuvres pour moi. Montre-les-moi aujourd'hui." },
    { ref:"Actes 17:26", texte:"Il a fait que tous les hommes, sortis d'un seul sang, habitassent sur toute la surface de la terre, ayant déterminé la durée des temps et les bornes de leur demeure.", priere:"Merci d'avoir fixé d'avance mes temps et mes limites, Seigneur." },
    { ref:"Psaume 33:11", texte:"Les desseins de l'Éternel subsistent à toujours, et les projets de son cœur, de génération en génération.", priere:"Merci que ton dessein tient bon, au-delà de ma propre génération." }
  ]},
  { id:'voix-de-dieu', titre:"La voix de Dieu", jours:[
    { ref:"Jean 10:27", texte:"Mes brebis entendent ma voix ; je les connais, et elles me suivent.", priere:"Seigneur, rends mon oreille attentive à ta voix aujourd'hui." },
    { ref:"1 Rois 19:12", texte:"Et après le tremblement de terre, un feu : l'Éternel n'était pas dans le feu. Et après le feu, un bruit doux et léger.", priere:"Aide-moi à te reconnaître dans le calme, pas seulement dans l'extraordinaire." },
    { ref:"Ésaïe 30:21", texte:"Tes oreilles entendront derrière toi la voix qui dira : Voici le chemin, marchez-y ! lorsque vous irez à droite ou que vous irez à gauche.", priere:"Guide-moi aujourd'hui, Seigneur, dans les décisions à prendre." },
    { ref:"Habacuc 2:1", texte:"J'étais à mon poste, et je me tenais sur la tour ; et je veillais, pour voir ce que l'Éternel me dirait, et ce que je répliquerais après ma plainte.", priere:"Apprends-moi à me tenir à l'écoute, patiemment, jusqu'à ta réponse." },
    { ref:"Jean 16:13", texte:"Quand le consolateur sera venu, l'Esprit de vérité, il vous conduira dans toute la vérité ; car il ne parlera pas de lui-même, mais il dira tout ce qu'il aura entendu, et il vous annoncera les choses à venir.", priere:"Merci pour ton Esprit qui me conduit dans la vérité. Guide-moi aujourd'hui." },
    { ref:"Jean 8:47", texte:"Celui qui est de Dieu, écoute les paroles de Dieu ; vous n'écoutez pas, parce que vous n'êtes pas de Dieu.", priere:"Seigneur, rends mon cœur disposé à t'écouter aujourd'hui." },
    { ref:"Apocalypse 3:20", texte:"Voici, je me tiens à la porte, et je frappe. Si quelqu'un entend ma voix et ouvre la porte, j'entrerai chez lui, je souperai avec lui, et lui avec moi.", priere:"J'ouvre la porte aujourd'hui, Seigneur. Viens." }
  ]}
];

/* Une icône par thème, pour la grille de présentation. */
const PLAN_ICONS = {
  'parole':'🗣️', 'jeune':'🌙', 'amour':'❤️', 'priere':'🙏', 'saint-esprit':'🔥',
  'marcher-jesus':'👣', 'tentation':'🛡️', 'reves':'💭', 'forteresses':'⚔️',
  'connaitre-dieu':'📖', 'education-enfants':'👶', 'guerison-coeur':'💚',
  'amis':'🤝', 'relations-sociales':'👥', 'relations-sexuelles':'💍',
  'famille':'🏠', 'projets':'🎯', 'finances':'💰', 'plan-de-dieu':'🧭', 'voix-de-dieu':'👂'
};

/* Grille d'icônes (comme une appli de plans de lecture) avec jauge de
   progression par plan. Touche une tuile pour ouvrir le plan en plein
   écran, jour après jour. */
function renderThematicPlans(){
  const el = document.getElementById('plansGrid');
  if(!el) return;
  if(!state.thematicProgress) state.thematicProgress = {};
  el.innerHTML = THEMATIC_PLANS.map(plan=>{
    const done = state.thematicProgress[plan.id] || [];
    const nbDone = done.filter(Boolean).length;
    const total = plan.jours.length;
    const pct = Math.round((nbDone/total)*100);
    const icon = PLAN_ICONS[plan.id] || '📜';
    return '<div class="plan-tile" onclick="openPlanReader(\''+plan.id+'\')">'
      + '<div class="plan-tile-icon">'+icon+'</div>'
      + '<div class="plan-tile-title">'+plan.titre+'</div>'
      + '<div class="plan-tile-bar"><div class="plan-tile-bar-fill" style="width:'+pct+'%"></div></div>'
      + '<div class="plan-tile-pct">'+nbDone+'/'+total+' · '+pct+'%</div>'
      + '</div>';
  }).join('');
}

/* =========================================================================
   LECTEUR PLEIN ÉCRAN D'UN PLAN — un verset (+ prière) par écran, on
   avance/recule en glissant à gauche/à droite (ou avec les flèches).
   ========================================================================= */
let readerPlanId = null;
let readerDayIndex = 0;

function openPlanReader(planId){
  const plan = THEMATIC_PLANS.find(p=>p.id===planId);
  if(!plan) return;
  readerPlanId = planId;
  if(!state.thematicProgress) state.thematicProgress = {};
  const done = state.thematicProgress[planId] || [];
  const firstUnfinished = plan.jours.findIndex((_,i)=>!done[i]);
  readerDayIndex = firstUnfinished === -1 ? 0 : firstUnfinished;
  document.getElementById('readerTitle').textContent = plan.titre;
  renderReaderDay();
  document.getElementById('planReader').classList.add('open');
}
function closePlanReader(){
  document.getElementById('planReader').classList.remove('open');
  renderThematicPlans();
}
function renderReaderDay(){
  const plan = THEMATIC_PLANS.find(p=>p.id===readerPlanId);
  if(!plan) return;
  const total = plan.jours.length;
  readerDayIndex = Math.max(0, Math.min(readerDayIndex, total-1));
  const jour = plan.jours[readerDayIndex];
  const done = (state.thematicProgress && state.thematicProgress[readerPlanId]) || [];
  const isDone = !!done[readerDayIndex];

  document.getElementById('readerDay').textContent = 'Jour ' + (readerDayIndex+1) + ' / ' + total;
  document.getElementById('readerRef').textContent = jour.ref;
  document.getElementById('readerText').textContent = '« ' + jour.texte + ' »';
  document.getElementById('readerPrayer').textContent = '🙏 ' + jour.priere;

  const pct = Math.round(((readerDayIndex+1)/total)*100);
  document.getElementById('readerProgressFill').style.width = pct + '%';
  document.getElementById('readerProgressLabel').textContent = pct + '%';

  const doneBtn = document.getElementById('readerDoneBtn');
  doneBtn.textContent = isDone ? '✓ Jour fait' : 'Marquer ce jour comme fait';
  doneBtn.classList.toggle('done', isDone);

  document.getElementById('readerPrevBtn').disabled = (readerDayIndex === 0);
  document.getElementById('readerNextBtn').disabled = (readerDayIndex === total-1);
}
function readerNext(){
  const plan = THEMATIC_PLANS.find(p=>p.id===readerPlanId);
  if(!plan) return;
  if(readerDayIndex < plan.jours.length-1){ readerDayIndex++; renderReaderDay(); }
}
function readerPrev(){
  if(readerDayIndex > 0){ readerDayIndex--; renderReaderDay(); }
}
function readerToggleDone(){
  if(!readerPlanId) return;
  if(!state.thematicProgress) state.thematicProgress = {};
  if(!state.thematicProgress[readerPlanId]) state.thematicProgress[readerPlanId] = [];
  state.thematicProgress[readerPlanId][readerDayIndex] = !state.thematicProgress[readerPlanId][readerDayIndex];
  persist();
  renderReaderDay();
}

/* Balayage tactile gauche/droite + flèches du clavier (pratique sur ordi).
   Le script est chargé en fin de page, donc #readerBody existe déjà : pas
   besoin d'attendre DOMContentLoaded (qui serait déjà passé). */
(function(){
  let touchStartX = null;
  const readerBodyEl = document.getElementById('readerBody');
  if(readerBodyEl){
    readerBodyEl.addEventListener('touchstart', e=>{ touchStartX = e.touches[0].clientX; }, {passive:true});
    readerBodyEl.addEventListener('touchend', e=>{
      if(touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if(dx < -40) readerNext();
      else if(dx > 40) readerPrev();
      touchStartX = null;
    }, {passive:true});
  }
})();
document.addEventListener('keydown', e=>{
  const reader = document.getElementById('planReader');
  if(!reader || !reader.classList.contains('open')) return;
  if(e.key === 'ArrowRight') readerNext();
  if(e.key === 'ArrowLeft') readerPrev();
  if(e.key === 'Escape') closePlanReader();
});

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>{ p.hidden = (p.id !== 'page-'+id); });
  document.querySelectorAll('.side-menu button').forEach(b=>{
    b.classList.toggle('active', b.dataset.page === id);
  });
  if(id === 'journal-comprehension' || id === 'prieres') refreshVerseSelects();
  if(id === 'rapports') renderRapportPreview();
  if(id === 'plans') renderThematicPlans();
  if(id === 'parametres') updateNotifUI();
  closeMenu();
  window.scrollTo(0,0);
}
function toggleMenu(){
  document.getElementById('sideMenu').classList.toggle('open');
  document.getElementById('menuOverlay').classList.toggle('show');
}
function closeMenu(){
  document.getElementById('sideMenu').classList.remove('open');
  document.getElementById('menuOverlay').classList.remove('show');
}

/* =========================================================================
   RAPPORT — un résumé lisible, affiché directement dans l'appli (pas
   seulement au moment d'imprimer), pour que ce soit concret à l'écran.
   ========================================================================= */
function renderRapportPreview(){
  const el = document.getElementById('rapportPreview');
  if(!el) return;
  const lus = totalRead();
  const taux = ((lus/TOTAL_CHAPTERS)*100).toFixed(2);
  const pos = currentPosition();
  const posTxt = pos ? (pos.livre + " (" + pos.lu + "/" + pos.total + " chapitres)") : "Plan terminé 🎉";

  const chapEntries = state.chapterLog.slice().sort((a,b)=> b.date.localeCompare(a.date)).map(e=>{
    const label = e.de===e.a ? ("chapitre "+e.de) : ("chapitres "+e.de+" à "+e.a);
    return "<li>" + fmtDate(parseDate(e.date)) + " · <strong>" + e.livre + "</strong> — " + label + "</li>";
  }).join('') || "<li class='empty'>Aucune lecture enregistrée.</li>";

  const compEntries = state.compLog.map(e=>
    "<li>" + fmtDate(parseDate(e.date)) + " · <strong>" + e.livre + " " + e.chapitre + (e.verset ? ':'+e.verset : '') + "</strong><br>" + e.note + "</li>"
  ).join('') || "<li class='empty'>Aucune entrée.</li>";

  const prayerEntries = state.prayers.map(e=>
    "<li>" + fmtDate(parseDate(e.date)) + (e.reference ? ' · '+e.reference : '') + (e.verse ? ' · verset '+e.verse : '') + "<br>" + e.text + "</li>"
  ).join('') || "<li class='empty'>Aucune prière.</li>";

  el.innerHTML = `
    <div class="card">
      <h2>Résumé de progression</h2>
      <div class="detail" style="margin-top:0;">Taux : <strong>${taux}%</strong> (${lus} / ${TOTAL_CHAPTERS} chapitres) · Position actuelle : <strong>${posTxt}</strong></div>
    </div>
    <div class="card"><h2>📘 Journal des chapitres</h2><ul style="padding-left:18px; margin:0;">${chapEntries}</ul></div>
    <div class="card"><h2>📖 Journal de compréhension</h2><ul style="padding-left:18px; margin:0;">${compEntries}</ul></div>
    <div class="card"><h2>🙏 Prières</h2><ul style="padding-left:18px; margin:0;">${prayerEntries}</ul></div>
  `;
}

function printReport(){
  renderRapportPreview();
  document.querySelectorAll('details').forEach(d=> d.open = true);
  window.print();
}

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('service-worker.js?v=5').catch(()=>{});
  });
}

loadState();
initCloudIfConfigured();
renderVerseAndDate();
