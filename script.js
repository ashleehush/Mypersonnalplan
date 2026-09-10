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

/* Menu déroulant de numéros de verset (1 à 180, couvre le plus long chapitre
   de la Bible — Psaume 119, 176 versets) : plus de saisie manuelle. */
const compVersetSelect = document.getElementById('compVerset');
if(compVersetSelect){
  const empty = document.createElement('option');
  empty.value = ''; empty.textContent = '— (aucun) —';
  compVersetSelect.appendChild(empty);
  for(let v=1; v<=180; v++){
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = 'Verset ' + v;
    compVersetSelect.appendChild(opt);
  }
}

let state = { dateDebut: new Date().toISOString().slice(0,10), chapterLog: [], compLog: [], prayers: [] };

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
            state = Object.assign({dateDebut: todayStr(), chapterLog:[], compLog:[], prayers:[]}, snap.data());
            document.getElementById('dateDebut').value = state.dateDebut;
            renderLog(); renderComp(); renderPrayers(); compute();
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
    }catch(e){}
    document.getElementById('dateDebut').value = state.dateDebut;
    document.getElementById('logDate').value = todayStr();
    renderLog(); renderComp(); renderPrayers(); compute();
  } else {
    document.getElementById('logDate').value = todayStr();
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

  const reminder = document.getElementById('reminder');
  if(state.chapterLog.length){
    const lastDate = state.chapterLog.reduce((max,e)=> e.date > max ? e.date : max, state.chapterLog[0].date);
    const gap = daysBetween(parseDate(lastDate), today);
    if(gap >= 3){
      reminder.style.display = 'block';
      reminder.textContent = "👋 Où étais-tu passée ? Ça fait " + gap + " jours sans lecture enregistrée.";
    } else {
      reminder.style.display = 'none';
    }
  } else {
    reminder.style.display = 'none';
  }

  drawDonut(taux);
  renderPosition();
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
  persist(); renderLog(); compute();
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
  const last = lastLogEntry();
  if(!last){ alert("Ajoute d'abord une lecture dans le Journal des chapitres."); return; }
  const note = document.getElementById('compNote').value.trim();
  if(!note) return;
  state.compLog.unshift({
    date: last.date, livre: last.livre, chapitre: last.a,
    verset: document.getElementById('compVerset').value.trim(), note
  });
  document.getElementById('compNote').value = '';
  document.getElementById('compVerset').value = '';
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
  const last = lastLogEntry();
  const verse = document.getElementById('prayerVerse').value.trim();
  const text = document.getElementById('prayerText').value.trim();
  if(!text) return;
  state.prayers.unshift({
    date: last ? last.date : todayStr(),
    reference: last ? (last.livre+" "+last.a) : "",
    verse, text
  });
  document.getElementById('prayerVerse').value = '';
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
}

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>{ p.hidden = (p.id !== 'page-'+id); });
  document.querySelectorAll('.side-menu button').forEach(b=>{
    b.classList.toggle('active', b.dataset.page === id);
  });
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

function printReport(){
  document.querySelectorAll('details').forEach(d=> d.open = true);
  window.print();
}

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('service-worker.js?v=3').catch(()=>{});
  });
}

loadState();
initCloudIfConfigured();
renderVerseAndDate();
