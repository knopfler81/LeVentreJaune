// MENU HAMBURGER MOBILE
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  const closeMenu = () => {
    navToggle.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
  };

  const openMenu = () => {
    navToggle.classList.add('is-open');
    navLinks.classList.add('is-open');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fermer le menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 680) closeMenu();
  });
});

// ============================================================
// CONFIGURATION — À MODIFIER
// Remplacez VOTRE_SHEET_ID par l'ID du Google Sheets
// (visible dans l'URL : docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit)
// ============================================================
const SHEET_ID = '1n1WMK411bha05TV3gk5KGfa0l5sCPm2ZxLJzqFJEAFY'; 
const SHEET_NAME = 'Menu';

const JOURS = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const JOURS_JS = [1,2,3,4,5,6,0]; // JS: 0=Dimanche

function getJourAujourdHui() {
  const d = new Date().getDay();
  return JOURS_JS.indexOf(d);
}

async function chargerMenu() {
  const container = document.getElementById('menu-container');
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0,-2));
    const rows = json.table.rows;
    afficherMenu(rows);
  } catch(e) {
    afficherMenuDemoFallback();
  }
}

function afficherMenu(rows) {
  const container = document.getElementById('menu-container');
  const aujourdHui = getJourAujourdHui();
  let html = '';
  rows.forEach((row, i) => {
    const c = row.c;
    const jour = c[0]?.v || '';
    const entree = c[1]?.v || '';
    const plat = c[2]?.v || '';
    const fromage = c[3]?.v || '';  
    const dessert = c[4]?.v || '';
    const prix = c[5]?.v || '';
    const ouvert = c[6]?.v;
    const idx = JOURS.findIndex(j => j.toLowerCase() === jour.toLowerCase());
    const isToday = idx === aujourdHui;
    if (ouvert === false || ouvert === 'false' || ouvert === 'FERME') {
      html += `<div class="menu-day-card${isToday?' today':''}">
        ${isToday?'<span class="today-badge">Aujourd\'hui</span>':''}
        <div class="day-label">${jour}</div>
        <div class="menu-fermé"><p class="menu-fermé-label">Fermé ce jour</p></div>
      </div>`;
    } else {
      html += `<div class="menu-day-card${isToday?' today':''}">
        ${isToday?'<span class="today-badge">Aujourd\'hui</span>':''}
        <div class="day-label">${jour}</div>
        ${prix?`<div class="day-price">${prix}</div>`:''}
        <div style="clear:both;padding-top:0.5rem">
          ${entree?`<div class="menu-item"><div class="menu-item-label">Entrée</div><div class="menu-item-name">${entree}</div></div>`:''}
          ${plat?`<div class="menu-item"><div class="menu-item-label">Plat</div><div class="menu-item-name">${plat}</div></div>`:''}
          ${fromage?`<div class="menu-item"><div class="menu-item-label">Fromage</div><div class="menu-item-name">${fromage}</div></div>`:''}
          ${dessert?`<div class="menu-item"><div class="menu-item-label">Dessert</div><div class="menu-item-name">${dessert}</div></div>`:''}
        </div>
      </div>`;
    }
  });
  container.innerHTML = html;
}

function afficherMenuDemoFallback() {
  const menuDemo = [
    { jour:'Lundi', ferme: true },
    { jour:'Mardi', entree:'Velouté de potiron', plat:'Rôti de porc, gratin dauphinois', fromage: 'Fromage blanc ou sec',dessert:'Tarte aux pommes', prix:'13€' },
    { jour:'Mercredi', entree:'Salade Forézienne', plat:'Joue de bœuf braisée, purée maison', fromage: 'Fromage blanc ou sec',  dessert:'Crème brûlée', prix:'13€' },
    { jour:'Jeudi', entree:'Œuf mayo maison', plat:'Poulet rôti, haricots verts', fromage: 'Fromage blanc ou sec', dessert:'Fromage blanc du pays', prix:'12€' },
    { jour:'Vendredi', entree:'Soupe à l\'oignon', plat:'Andouillette AAAAA, frites maison', fromage: 'Fromage blanc ou sec', dessert:'Tarte tatin', prix:'13€' },
    { jour:'Samedi', entree:'Terrine de campagne', plat:'Magret de canard, écrasé de pommes de terre', fromage: 'Fromage blanc ou sec', dessert:'Mousse au chocolat', prix:'15€' },
    { jour:'Dimanche', entree:'Terrine de campagne', plat:'Magret de canard, écrasé de pommes de terre', fromage: 'Fromage blanc ou sec', dessert:'Mousse au chocolat', prix:'15€' },
  ];
  const container = document.getElementById('menu-container');
  const aujourdHui = getJourAujourdHui();
  let html = '';
  menuDemo.forEach((m, i) => {
    const isToday = i === aujourdHui;
    if (m.ferme) {
      html += `<div class="menu-day-card${isToday?' today':''}">
        ${isToday?'<span class="today-badge">Aujourd\'hui</span>':''}
        <div class="day-label">${m.jour}</div>
        <div class="menu-fermé"><p class="menu-fermé-label">Fermé ce jour</p></div>
      </div>`;
    } else {
      html += `<div class="menu-day-card${isToday?' today':''}">
        ${isToday?'<span class="today-badge">Aujourd\'hui</span>':''}
        <div class="day-label">${m.jour}</div>
        <div class="day-price">${m.prix}</div>
        <div style="clear:both;padding-top:0.5rem">
          <div class="menu-item"><div class="menu-item-label">Entrée</div><div class="menu-item-name">${m.entree}</div></div>
          <div class="menu-item"><div class="menu-item-label">Plat</div><div class="menu-item-name">${m.plat}</div></div>
          
          <div class="menu-item"><div class="menu-item-label">Dessert</div><div class="menu-item-name">${m.dessert}</div></div>
        </div>
      </div>`;
    }
  });
  container.innerHTML = html;
  document.querySelector('.menu-note').innerHTML = '⚠️ <em>Mode démo — connectez le Google Sheets pour afficher le vrai menu (voir instructions).</em>';
}

chargerMenu();

// COUNTDOWN
function pad(n){ return String(n).padStart(2,'0'); }
const target = new Date('2026-06-20T12:00:00');
function tick(){
  const diff = target - new Date();
  if(diff <= 0){ ['cd-j','cd-h','cd-m','cd-s'].forEach(id=>document.getElementById(id).textContent='00'); return; }
  document.getElementById('cd-j').textContent = pad(Math.floor(diff/86400000));
  document.getElementById('cd-h').textContent = pad(Math.floor((diff%86400000)/3600000));
  document.getElementById('cd-m').textContent = pad(Math.floor((diff%3600000)/60000));
  document.getElementById('cd-s').textContent = pad(Math.floor((diff%60000)/1000));
}
tick(); setInterval(tick,1000);

// ALERTE EMAIL
function subscribe(){
  const inp = document.getElementById('email-input');
  const msg = document.getElementById('notif-msg');
  if(inp.value && inp.value.includes('@')){ msg.style.display='block'; inp.value=''; inp.style.borderColor='#4caf50'; }
  else { inp.style.borderColor='#B5341A'; inp.focus(); }
}

// // RÉSERVATION
// function envoyerResa(){
//   const nom = document.getElementById('resa-nom').value;
//   const tel = document.getElementById('resa-tel').value;
//   const date = document.getElementById('resa-date').value;
//   if(!nom || !tel || !date){ alert('Merci de remplir au moins votre nom, téléphone et date souhaitée.'); return; }
//   document.getElementById('resa-confirm').style.display = 'block';
//   document.querySelector('.btn-resa').textContent = 'Demande envoyée ✓';
//   document.querySelector('.btn-resa').style.background = '#4a8c3f';
// }

// // Date min pour réservation = demain
// const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
// document.getElementById('resa-date').min = tomorrow.toISOString().split('T')[0];
