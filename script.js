// ===== Dati del calendario Giochi VLE 2026 =====
// Ogni gioco: { ora: "HH:MM", nome: "..." } — l'orario vuoto ("") va in fondo.
const EVENTI = [
  { data: "4 luglio",  giorno: "sabato",          luogo: "Comune",             giochi: [{ ora: "18:00", nome: "Wallpainting" }] },
  { data: "9 luglio",  giorno: "giovedì",         luogo: "Parco Benessere",    giochi: [{ ora: "18:00", nome: "Primo turno Calcio e Basket" }] },
  { data: "11 luglio", giorno: "sabato mattina",  luogo: "Acquamorta",         giochi: [{ ora: "09:00", nome: "Passami l'acqua" }, { ora: "09:00", nome: "Incendio" }, { ora: "09:00", nome: "Ciambell Cor a Cor" }] },
  { data: "14 luglio", giorno: "martedì",         luogo: "P.za S. Giuseppe",   giochi: [{ ora: "21:00", nome: "Patata Bollente" }, { ora: "21:00", nome: "Sul filo del mattone" }] },
  { data: "15 luglio", giorno: "mercoledì",       luogo: "Parco del Benessere",giochi: [{ ora: "18:00", nome: "Semifinali e Finali Calcio" }] },
  { data: "16 luglio", giorno: "giovedì",         luogo: "Parco del Benessere",giochi: [{ ora: "18:00", nome: "Semifinali e Finali Basket" }] },
  { data: "18 luglio", giorno: "sabato",          luogo: "P.za XXVII Gennaio", giochi: [{ ora: "18:00", nome: "Parata" }, { ora: "21:00", nome: "Tiro alla fune" }, { ora: "21:00", nome: "Nu jeans e na maglietta" }] },
  { data: "20 luglio", giorno: "lunedì",          luogo: "Acquamorta",         giochi: [{ ora: "17:00", nome: "Qua Qua Game" }, { ora: "09:00", nome: "Beach volley" }, { ora: "09:00", nome: "SUP" }] },
  { data: "22 luglio", giorno: "mercoledì",       luogo: "Acquamorta",         giochi: [{ ora: "21:00", nome: "Voci x caso" }, { ora: "21:00", nome: "Tiro alla fune" }, { ora: "21:00", nome: "Gara di t-shirts" }] },
  { data: "23 luglio", giorno: "giovedì",         luogo: "Acquamorta",         giochi: [{ ora: "21:00", nome: "Buona la Prima" }, { ora: "21:00", nome: "Body art" }] },
  { data: "24 luglio", giorno: "venerdì",         luogo: "Acquamorta",         giochi: [{ ora: "21:00", nome: "Miss & Mister" }, { ora: "21:00", nome: "Divisi dalla nascita" }] },
  { data: "25 luglio", giorno: "sabato",          luogo: "Acquamorta",         giochi: [{ ora: "21:00", nome: "Balliamo sul mondo" }, { ora: "21:00", nome: "Alta moda" }] },
  { data: "26 luglio", giorno: "domenica",        luogo: "Acquamorta",         giochi: [{ ora: "21:00", nome: "Premiazione" }] },
];

// Ordina i giochi di una giornata per orario crescente; quelli senza orario vanno in fondo.
function giochiOrdinati(giochi) {
  return [...giochi].sort((a, b) => {
    if (!a.ora) return 1;
    if (!b.ora) return -1;
    return a.ora.localeCompare(b.ora);
  });
}

// ===== Render timeline =====
const timeline = document.getElementById("timeline");

function renderEventi(filtro = "all") {
  timeline.innerHTML = "";
  EVENTI.filter(e => filtro === "all" || e.luogo === filtro).forEach((e, i) => {
    const giochi = giochiOrdinati(e.giochi).map(g =>
      `<li><svg class="bullet"><use href="#i-bones"/></svg>${g.ora ? `<span class="event-time">${g.ora}</span>` : ""}<span class="game-name">${g.nome}</span></li>`
    ).join("");
    const el = document.createElement("article");
    el.className = "event";
    el.style.transitionDelay = `${i * 60}ms`;
    el.innerHTML = `
      <span class="event-dot"><svg><use href="#i-skull"/></svg></span>
      <div class="event-card parchment">
        <div class="event-head">
          <span class="event-date">${e.data}</span>
          <span class="event-day">${e.giorno}</span>
          <span class="event-place">${e.luogo}</span>
        </div>
        <ul class="event-games">${giochi}</ul>
      </div>`;
    timeline.appendChild(el);
  });
  observeEvents();
}

// ===== Filtri per luogo =====
const filters = document.getElementById("filters");
const luoghi = [...new Set(EVENTI.map(e => e.luogo))];
luoghi.forEach(l => {
  const b = document.createElement("button");
  b.className = "chip";
  b.dataset.filter = l;
  b.textContent = l;
  filters.appendChild(b);
});

filters.addEventListener("click", (ev) => {
  const btn = ev.target.closest(".chip");
  if (!btn) return;
  filters.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderEventi(btn.dataset.filter);
});

// ===== Animazione reveal allo scroll =====
let io;
function observeEvents() {
  if (io) io.disconnect();
  io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".event").forEach(e => io.observe(e));
}

renderEventi();
