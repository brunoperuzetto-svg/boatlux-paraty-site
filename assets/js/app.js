(function () {
  "use strict";
  var B = window.BOATLUX, FROTA = window.FROTA, DEST = window.DESTINOS, MAP = window.PARATY_MAP;
  var Q = new URLSearchParams(location.search);
  var SHOT = Q.has("shot");              // modo captura de tela (testes)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function wa(msg) { return "https://wa.me/" + B.whatsapp + "?text=" + encodeURIComponent(msg); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Básico ---------- */
  $$(".js-wa").forEach(function (a) {
    a.href = wa(a.dataset.msg || "Olá! Vim pelo site da Boatlux Paraty.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $("#waLabel").textContent = B.whatsappLabel;

  /* ---------- Medição: eventos de clique no WhatsApp ----------
     Dispara o evento "boatlux:whatsapp_click" na window (e empurra para window.dataLayer se existir).
     Para conectar as ferramentas, descomente o listener no fim deste bloco. */
  function trackWhatsApp(info) {
    var detail = { position: info.position || "desconhecido", text: info.text || "", boat: info.boat || null, message: info.message || "", page: location.pathname, ts: Date.now() };
    try { window.dispatchEvent(new CustomEvent("boatlux:whatsapp_click", { detail: detail })); } catch (e) {}
    if (window.dataLayer && window.dataLayer.push) window.dataLayer.push({ event: "whatsapp_click", cta_position: detail.position, cta_text: detail.text, boat: detail.boat, whatsapp_message: detail.message });
    return detail;
  }
  window.trackWhatsApp = trackWhatsApp;
  /* CONECTAR GA4 e META PIXEL (quando as tags estiverem instaladas no <head>):
  window.addEventListener("boatlux:whatsapp_click", function (e) {
    var d = e.detail;
    // GA4:
    // gtag("event", "generate_lead", { method: "whatsapp", cta_position: d.position, cta_text: d.text, item_name: d.boat });
    // META PIXEL:
    // fbq("track", "Contact", { content_name: d.boat || "geral", cta_position: d.position });
  }); */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a.js-wa, #sCta") : null;
    if (!a) return;
    var msg = ""; try { msg = decodeURIComponent((a.href.split("text=")[1] || "")); } catch (x) {}
    trackWhatsApp({ position: a.dataset.pos || "desconhecido", text: (a.textContent || "").replace(/\s+/g, " ").trim(), boat: a.dataset.boat || null, message: msg });
  }, true);

  /* ---------- Rodapé: dados vindos da configuração ---------- */
  (function () {
    var t = $("#footTel"); if (t) { t.href = "tel:" + B.phoneTel; t.textContent = B.whatsappLabel; }
    var ad = $("#footAddr"); if (ad) ad.textContent = B.address ? B.address : "Paraty, RJ";
    var mp = $("#footMap"); if (mp && B.mapsUrl) mp.href = B.mapsUrl;
  })();
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  var loader = $("#loader"), bar = $("#loaderBar"), pct = 8;
  function ready() {
    bar.style.width = "100%";
    loader.classList.add("is-out"); document.body.classList.add("is-ready");
  }
  if (SHOT) { loader.style.display = "none"; document.body.classList.add("is-ready", "is-shot"); }
  else {
    var tick = setInterval(function () { pct = Math.min(88, pct + Math.random() * 18); bar.style.width = pct + "%"; }, 120);
    var done = false;
    var finish = function () { if (done) return; done = true; clearInterval(tick); ready(); };
    // libera assim que o HTML está pronto (não espera imagens e fontes); teto de 1,2 s
    if (document.readyState !== "loading") setTimeout(finish, 120); else document.addEventListener("DOMContentLoaded", function () { setTimeout(finish, 120); }, { once: true });
    setTimeout(finish, 900);
  }

  /* ---------- Header, progresso, barra mobile ---------- */
  var header = $("#header"), prog = $("#progress");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("is-solid", y > 40);
    prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    flowUpdate();
  }
  var burger = $("#burger"), nav = $("#nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("is-locked", open);
    var narrow = window.matchMedia("(max-width: 900px)").matches;
    [$("#conteudo"), $(".footer"), $(".brand")].forEach(function (el) { if (el) { if (open && narrow) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    if (open && narrow) { setTimeout(function () { var first = $("a", nav); if (first) first.focus(); }, 80); } else if (!open && narrow) burger.focus();
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false); });

  /* ---------- Como funciona: itens acendem em sequência ---------- */
  var flow = $$(".flow__i");
  function flowUpdate() {
    flow.forEach(function (el) { el.classList.toggle("is-on", SHOT || el.getBoundingClientRect().top < innerHeight * 0.62); });
  }

  /* ---------- Frota ---------- */
  var IC = {
    pax: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.300 2.700-6 6-6s6 2.700 6 6"/><circle cx="17" cy="9" r="2.200"/><path d="M17 14c2.500 0 4.500 2 4.500 4.500"/></svg>',
    eng: '<svg viewBox="0 0 24 24"><path d="M4 9h3l2-3h6l1 3h3v8H4z"/><path d="M2 12v3M22 12v3"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/></svg>'
  };
  /* Imagens responsivas: usa <picture> (AVIF/WebP/srcset) quando existir entrada em window.IMG_VARIANTS */
  var CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw";
  function pictureHtml(src, alt, sizes, pos, o) {
    o = o || {};
    var key = String(src).split("?")[0], v = (window.IMG_VARIANTS || {})[key];
    var style = pos ? ' style="object-position:' + pos + '"' : "";
    var load = o.eager ? (o.priority ? 'fetchpriority="high" decoding="async"' : 'decoding="async"') : 'loading="lazy" decoding="async"';
    var dim = o.w ? ' width="' + o.w + '" height="' + o.h + '"' : ' width="800" height="550"';
    var img = '<img src="' + src + '" alt="' + alt + '" ' + load + dim + (v && v.jpg ? ' srcset="' + v.jpg + '" sizes="' + sizes + '"' : "") + style + ">";
    if (!v || !(v.avif || v.webp)) return img;
    return "<picture>" + (v.avif ? '<source type="image/avif" srcset="' + v.avif + '" sizes="' + sizes + '">' : "") + (v.webp ? '<source type="image/webp" srcset="' + v.webp + '" sizes="' + sizes + '">' : "") + img + "</picture>";
  }
  var fleetEl = $("#fleet"), emptyEl = $("#empty"), countEl = $("#count"), sortEl = $("#sort");
  var state = { kind: "all", pax: 0, night: 0, sort: "rec" };
  var cards = {};

  function specText(b) { return b.paxDay + " pessoas" + (b.paxNight ? " · " + b.paxNight + " à noite" : ""); }
  function dotsHtml(n) { var s = ""; for (var i = 0; i < n; i++) s += "<i></i>"; return s; }

  // O HTML dos cards já vem pronto de scripts/prerender.js (bom para SEO e sem JS); aqui só ligamos os cliques.
  var preCards = {}; $$(".card", fleetEl).forEach(function (el) { preCards[el.dataset.id] = el; });
  FROTA.forEach(function (b, idx) {
    var c = preCards[b.id], pre = !!c;
    if (pre) {
      c.style.order = idx; c.classList.add("reveal");
      var im = $(".card__img img", c);
      if (im) { var tmp = document.createElement("div"); tmp.innerHTML = pictureHtml(b.card, esc(b.name) + " em Paraty", CARD_SIZES, b.cardPos); im.replaceWith(tmp.firstChild); }
    } else {
      c = document.createElement("button");
      c.type = "button"; c.className = "card reveal"; c.dataset.id = b.id; c.style.order = idx;
    c.setAttribute("aria-label", "Ver ficha: " + b.name);
    c.innerHTML =
      '<div class="card__img">' + pictureHtml(b.card, esc(b.name) + ' em Paraty', CARD_SIZES, b.cardPos) +
      (b.badge ? '<span class="badge' + (b.soon ? " badge--soon" : "") + '">' + esc(b.badge) + "</span>" : "") +
      "</div>" +
      '<div class="card__body"><span class="card__kind">' + (b.kind === "jet" ? "Jet ski" : "Lancha") + "</span>" +
      "<h3>" + esc(b.name) + "</h3>" + (b.alias ? '<span class="card__alias">' + esc(b.alias) + "</span>" : "") +
      '<p class="card__tag">' + esc(b.tagline) + "</p>" +
      '<div class="card__specs"><span class="spec">' + IC.pax + esc(specText(b)) + '</span><span class="spec">' + IC.eng + esc(b.motor.split("·")[0].trim()) + "</span>" + (b.year ? '<span class="spec">Ano ' + esc(b.year) + "</span>" : "") + "</div>" +
      '<div class="dots" title="Você é 1 de ' + b.cotas + ' proprietários">' + dotsHtml(b.cotas) + "<span>você é 1 de " + b.cotas + " proprietários</span></div>" +
      '<span class="card__more">Ver ficha</span></div>';
    }
    c.addEventListener("click", function () { openSheet(b, c); });
    if (!pre) fleetEl.appendChild(c);
    cards[b.id] = c;
  });

  function matches(b) {
    if (state.kind !== "all" && b.kind !== state.kind) return false;
    if (state.pax && b.paxDay < state.pax) return false;
    if (state.night && !b.paxNight) return false;
    return true;
  }
  function applyFilters() {
    var list = FROTA.filter(matches), shown = {};
    list.forEach(function (b) { shown[b.id] = true; });
    var sorted = FROTA.map(function (b, i) { return { b: b, i: i }; });
    sorted.sort(function (a, z) {
      if (state.sort === "paxDesc") return z.b.paxDay - a.b.paxDay || a.i - z.i;
      if (state.sort === "paxAsc") return a.b.paxDay - z.b.paxDay || a.i - z.i;
      if (state.sort === "cotas") return a.b.cotas - z.b.cotas || a.i - z.i;
      return a.i - z.i;
    });
    sorted.forEach(function (o, pos) { cards[o.b.id].style.order = pos; });
    FROTA.forEach(function (b) {
      var c = cards[b.id], on = !!shown[b.id];
      if (on && c.hidden) { c.hidden = false; c.classList.add("is-out"); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove("is-out"); c.classList.add("is-in"); }); }); }
      else if (on) c.classList.add("is-in");
      if (!on) c.hidden = true;
    });
    emptyEl.hidden = list.length > 0;
    countEl.innerHTML = list.length === FROTA.length ? "<b>" + list.length + "</b> embarcações" : "<b>" + list.length + "</b> de " + FROTA.length + " embarcações";
  }
  $$("#filters .chip").forEach(function (ch) {
    ch.setAttribute("aria-pressed", ch.classList.contains("is-on") ? "true" : "false");
    ch.addEventListener("click", function () {
      var f = ch.dataset.f, v = ch.dataset.v;
      $$('#filters .chip[data-f="' + f + '"]').forEach(function (x) { x.classList.toggle("is-on", x === ch); x.setAttribute("aria-pressed", x === ch ? "true" : "false"); });
      state[f] = f === "kind" ? v : Number(v);
      applyFilters();
    });
  });
  sortEl.addEventListener("change", function () { state.sort = sortEl.value; applyFilters(); });
  applyFilters();

  /* ---------- Hero: carrossel de embarcações ---------- */
  var HERO = [
    { id: "gtx-300", img: "assets/img/m/gtx-300-1.jpg", pos: "66% 50%" },
    { id: "wake-170", img: "assets/img/m/wake-170-1.jpg", pos: "50% 72%" },
    { id: "infinity-345", img: "assets/img/m/infinity-345-4.jpg", pos: "28% 62%" },
    { id: "conquest-180", img: "assets/img/m/conquest-180-1.jpg", pos: "38% 55%" }
  ];
  var hs = $("#heroSlides"), hd = $("#heroDots"), hIdx = 0, hTimer = null;
  var HSIZES = "(max-width: 900px) 100vw, 64vw", hPaused = false, hHover = false, hBtn = $("#heroPause");
  HERO.forEach(function (h, i) {
    var b = FROTA.filter(function (x) { return x.id === h.id; })[0]; h.b = b;
    var d = document.createElement("div"); d.className = "hslide";
    d.innerHTML = pictureHtml(h.img, "", HSIZES, h.pos, { eager: i === 0, priority: i === 0, w: 1600, h: 1100 });
    if (i > 0) { var im = d.querySelector("img"); if (im) im.setAttribute("loading", "lazy"); }
    hs.appendChild(d);
    var t = document.createElement("button"); t.type = "button";
    t.setAttribute("aria-label", "Mostrar " + b.name); t.addEventListener("click", function () { showHero(i, true); });
    hd.appendChild(t);
  });
  function scheduleHero() {
    clearTimeout(hTimer);
    if (!reduce && !SHOT && !hPaused && !hHover && !document.hidden) hTimer = setTimeout(function () { showHero((hIdx + 1) % HERO.length); }, 6000);
  }
  function showHero(i, user) {
    hIdx = i;
    var h = HERO[i], b = h.b;
    $$(".hslide", hs).forEach(function (el, k) { el.classList.toggle("is-on", k === i); });
    $$("button", hd).forEach(function (el, k) { el.classList.remove("is-on", "is-done"); if (k === i) el.setAttribute("aria-current", "true"); else el.removeAttribute("aria-current"); if (k < i) el.classList.add("is-done"); });
    var cur = $$("button", hd)[i]; void cur.offsetWidth; cur.classList.add("is-on");
    $("#nowKind").textContent = (b.kind === "jet" ? "Jet ski" : "Lancha") + (b.year ? " · " + b.year : "");
    $("#nowName").textContent = b.name + (b.alias ? " · " + b.alias : "");
    $("#nowSpec").textContent = b.paxDay + " pessoas" + (b.paxNight ? " · " + b.paxNight + " à noite" : "") + " · 1 de " + b.cotas + " proprietários";
    scheduleHero();
  }
  if (hBtn) hBtn.addEventListener("click", function () {
    hPaused = !hPaused; hBtn.setAttribute("aria-pressed", hPaused ? "true" : "false");
    hBtn.setAttribute("aria-label", hPaused ? "Retomar carrossel" : "Pausar carrossel"); hBtn.classList.toggle("is-paused", hPaused);
    $("#heroDots").classList.toggle("is-paused", hPaused); scheduleHero();
  });
  var heroSec = $("#topo");
  heroSec.addEventListener("mouseenter", function () { hHover = true; clearTimeout(hTimer); });
  heroSec.addEventListener("mouseleave", function () { hHover = false; scheduleHero(); });
  heroSec.addEventListener("focusin", function () { hHover = true; clearTimeout(hTimer); });
  heroSec.addEventListener("focusout", function () { hHover = false; scheduleHero(); });
  document.addEventListener("visibilitychange", scheduleHero);
  $("#heroNow").addEventListener("click", function () { openSheet(HERO[hIdx].b, this); });
  showHero(0);

  /* ---------- Ficha ---------- */
  var sheet = $("#sheet"), sMain = $("#sMain"), sThumbs = $("#sThumbs"), gIdx = 0, cur = null, lastFocus = null;
  function showImg(i) {
    gIdx = (i + cur.gallery.length) % cur.gallery.length;
    sMain.src = cur.gallery[gIdx]; sMain.alt = cur.name + ", foto " + (gIdx + 1);
    $("#gCount").textContent = (gIdx + 1) + " / " + cur.gallery.length;
    $$("button", sThumbs).forEach(function (x, k) { x.classList.toggle("is-on", k === gIdx); });
  }
  function openSheet(b, trigger) {
    cur = b; lastFocus = trigger || null;
    $("#sTag").textContent = (b.kind === "jet" ? "Jet ski" : "Lancha") + (b.year ? " " + b.year : "") + " · Marina " + B.marina;
    $("#sTitle").textContent = b.name;
    $("#sAlias").textContent = b.alias ? "“" + b.alias + "”" : "";
    $("#sTagline").textContent = b.tagline;
    $("#sSpecs").innerHTML =
      "<div><dt>Passageiros</dt><dd>" + (b.paxNight ? b.paxDay + " de dia · " + b.paxNight + " à noite" : b.paxDay + " pessoas") + "</dd></div>" +
      "<div><dt>Motor</dt><dd>" + esc(b.motor) + "</dd></div>" +
      "<div><dt>Marina</dt><dd>" + esc(B.marina) + "</dd></div>" +
      (b.year ? "<div><dt>Ano</dt><dd>" + esc(b.year) + "</dd></div>" : "") + "<div><dt>Proprietários</dt><dd>" + b.cotas + " proprietários</dd></div>";
    $("#sGroup").innerHTML = '<div class="dots">' + dotsHtml(b.cotas) + "</div><p>Você será um dos " + b.cotas + " proprietários desta embarcação. O uso e os custos são compartilhados entre os proprietários e a Boatlux administra tudo.</p>";
    $("#sItems").innerHTML = b.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");
    sThumbs.innerHTML = "";
    b.gallery.forEach(function (src, i) {
      var t = document.createElement("button"); t.type = "button"; t.setAttribute("aria-label", "Foto " + (i + 1));
      t.innerHTML = '<img src="' + src + '" alt="" loading="lazy">'; t.addEventListener("click", function () { showImg(i); });
      sThumbs.appendChild(t);
    });
    var msg = "Olá! Vi o site da Boatlux Paraty e quero saber mais sobre a cota " + (b.alias ? "da " + b.name + " (" + b.alias + ")" : "da " + b.name) + ".";
    var cta = $("#sCta"); cta.href = wa(msg); cta.target = "_blank"; cta.rel = "noopener"; cta.dataset.boat = b.name + (b.alias ? " (" + b.alias + ")" : "");
    showImg(0);
    sheet.hidden = false; document.body.classList.add("is-locked", "sheet-open");
    $(".sheet__x").focus();
    if (history.replaceState) history.replaceState(null, "", "#b-" + b.id);
  }
  function closeSheet() {
    sheet.hidden = true; document.body.classList.remove("is-locked", "sheet-open");
    if (lastFocus) lastFocus.focus();
    if (history.replaceState && /^#b-/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
  }
  sheet.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeSheet(); });
  $("#gPrev").addEventListener("click", function () { showImg(gIdx - 1); });
  $("#gNext").addEventListener("click", function () { showImg(gIdx + 1); });
  var tx = null;
  sMain.parentNode.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  sMain.parentNode.addEventListener("touchend", function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) showImg(gIdx + (dx < 0 ? 1 : -1));
  });
  document.addEventListener("keydown", function (e) {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "ArrowRight") showImg(gIdx + 1);
    if (e.key === "ArrowLeft") showImg(gIdx - 1);
    if (e.key === "Tab") {
      var f = $$("button, a[href]", sheet).filter(function (x) { return x.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  (function () {
    var m = /^#b-(.+)$/.exec(location.hash);
    if (m) { var b = FROTA.filter(function (x) { return x.id === m[1]; })[0]; if (b) openSheet(b, null); }
  })();

  /* ---------- Mapa: carta náutica ilustrada (costa do OpenStreetMap) ---------- */
  var MP = window.PARATY_MAP, P = MP.pts, VW = MP.W, VH = MP.H;
  var G = { LAT0: -23.335, LAT1: -23.150, LON0: -44.775, LON1: -44.545 };
  function proj(lat, lon) { return [(lon - G.LON0) / (G.LON1 - G.LON0) * VW, (G.LAT1 - lat) / (G.LAT1 - G.LAT0) * VH]; }
  var NS = "http://www.w3.org/2000/svg", svg = $("#mapSvg"), stepsEl = $("#mapSteps"), curStep = -1;
  function mk(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  var mc = B.marinaCoord;
  function dist(d) {
    var R = 6371, rad = Math.PI / 180, dLat = (d.lat - mc.lat) * rad, dLon = (d.lon - mc.lon) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(mc.lat * rad) * Math.cos(d.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  function fmt(n) { return n.toFixed(1).replace(".", ","); }
  // distância APROXIMADA: arredonda para 0,5 km e para milhas inteiras
  function approx(km) { var k = Math.max(0.5, Math.round(km * 2) / 2); return "≈ " + (k % 1 ? fmt(k) : String(k)) + " km"; }
  function approxMn(km) { return "≈ " + Math.max(1, Math.round(km / 1.852)) + " mn"; }
  var RED = "#C23B33", INK = "#2c2a26";

  svg.setAttribute("role", "group"); svg.setAttribute("viewBox", "0 0 " + VW + " " + VH); svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  var defs = mk("defs", {}, svg);
  var pat = mk("pattern", { id: "relief", width: 5, height: 5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(40)" }, defs);
  mk("line", { x1: 0, y1: 0, x2: 0, y2: 5, stroke: "rgba(120,86,36,.20)", "stroke-width": 0.9 }, pat);
  var clip = mk("clipPath", { id: "landclip" }, defs); mk("path", { d: MP.land }, clip);

  // mar: branco (fundo) + faixas de águas rasas em azul de carta
  mk("rect", { x: -4000, y: -4000, width: VW + 8000, height: VH + 8000, fill: "#F8FBFD" }, svg);
  [[64, "#E3F1FA"], [44, "#CBE6F6"], [26, "#A9D4EF"], [12, "#86BFE6"]].forEach(function (b) {
    mk("path", { d: MP.land, fill: "none", stroke: b[1], "stroke-width": b[0], "stroke-linejoin": "round" }, svg);
  });
  // terra: areia, relevo em hachura, sombreado interno e linha de costa
  mk("path", { d: MP.land, fill: "#E6D3A5", stroke: "none" }, svg);
  var inner = mk("g", { "clip-path": "url(#landclip)" }, svg);
  [[60, "rgba(196,160,92,.10)"], [38, "rgba(196,160,92,.12)"], [18, "rgba(176,138,70,.14)"]].forEach(function (b) {
    mk("path", { d: MP.land, fill: "none", stroke: b[1], "stroke-width": b[0], "stroke-linejoin": "round" }, inner);
  });
  mk("path", { d: MP.land, fill: "url(#relief)", stroke: "none" }, svg);
  mk("path", { d: MP.land, fill: "none", stroke: INK, "stroke-width": 1.0, "stroke-linejoin": "round" }, svg);

  // grade de latitude/longitude (vermelha, como nas cartas)
  var grid = mk("g", { stroke: RED, "stroke-opacity": .55, "stroke-width": 0.8, fill: "none" }, svg), glabels = [];
  function dm(v, pos, neg) { var a = Math.abs(v), d = Math.floor(a), m = Math.round((a - d) * 60); return d + "°" + (m < 10 ? "0" : "") + m + "′" + (v < 0 ? neg : pos); }
  [-44.75, -44.70, -44.65, -44.60, -44.55].forEach(function (lon) {
    var x = proj(G.LAT0, lon)[0]; mk("line", { x1: x, y1: -4000, x2: x, y2: 4000 }, grid);
    var t = mk("text", { fill: RED, "font-family": "Jost, sans-serif", "font-size": 11, "text-anchor": "middle" }, svg); t.textContent = dm(lon, "L", "O"); glabels.push({ el: t, kind: "lon", v: x });
  });
  [-23.20, -23.25, -23.30].forEach(function (lat) {
    var y = proj(lat, G.LON0)[1]; mk("line", { x1: -4000, y1: y, x2: 4000, y2: y }, grid);
    var t = mk("text", { fill: RED, "font-family": "Jost, sans-serif", "font-size": 11 }, svg); t.textContent = dm(lat, "N", "S"); glabels.push({ el: t, kind: "lat", v: y });
  });

  // rosa dos ventos
  (function () {
    var cx = 935, cy = 160, r = 54, g = mk("g", { stroke: RED, fill: "none", "stroke-opacity": .75 }, svg);
    mk("circle", { cx: cx, cy: cy, r: r, "stroke-width": 1.1 }, g); mk("circle", { cx: cx, cy: cy, r: r - 9, "stroke-width": .8 }, g); mk("circle", { cx: cx, cy: cy, r: r - 22, "stroke-width": .6 }, g);
    for (var d = 0; d < 360; d += 5) {
      var big = d % 30 === 0, a = d * Math.PI / 180, r1 = big ? r - 22 : r - 9, r2 = r;
      mk("line", { x1: cx + Math.sin(a) * r1, y1: cy - Math.cos(a) * r1, x2: cx + Math.sin(a) * r2, y2: cy - Math.cos(a) * r2, "stroke-width": big ? 1 : .6 }, g);
    }
    mk("path", { d: "M" + cx + " " + (cy - r - 14) + " L" + (cx + 7) + " " + cy + " L" + cx + " " + (cy + r - 22) + " L" + (cx - 7) + " " + cy + "Z", fill: RED, "fill-opacity": .18, "stroke-width": 1 }, g);
    mk("path", { d: "M" + (cx - r + 8) + " " + cy + " L" + cx + " " + (cy - 6) + " L" + (cx + r - 8) + " " + cy + " L" + cx + " " + (cy + 6) + "Z", fill: "none", "stroke-width": .8 }, g);
    var n = mk("text", { x: cx, y: cy - r - 18, "text-anchor": "middle", fill: RED, "font-family": "DM Serif Display, serif", "font-size": 14 }, svg); n.textContent = "N";
  })();

  // nomes de águas e terras (itálico, como nas cartas)
  var tlabels = [];
  function nameLabel(txt, x, y, color, size, rot, spacing) {
    var t = mk("text", { x: x, y: y, "text-anchor": "middle", fill: color, "font-family": "DM Serif Display, serif", "font-style": "italic", "letter-spacing": spacing || "0.18em", "pointer-events": "none" }, svg);
    if (rot) t.setAttribute("transform", "rotate(" + rot + " " + x + " " + y + ")");
    t.textContent = txt; tlabels.push({ el: t, px: size });
  }
  nameLabel("Baía de Paraty", 405, 150, "#2a6c9a", 22, 0);
  nameLabel("Baía da Ilha Grande", 820, 70, "#2a6c9a", 20, 0);
  nameLabel("Serra do Mar", 330, 640, "#7a5a24", 20, -12, "0.28em");
  nameLabel("Península da Juatinga", 840, 650, "#7a5a24", 17, -16, "0.2em");

  // contornos dos itens marcados: ilhas = contorno real; demais = zona aproximada
  var contourG = mk("g", {}, svg), contours = {};
  Object.keys(MP.contours || {}).forEach(function (k) {
    var c = MP.contours[k];
    contours[k] = mk("path", { d: c.d, fill: "rgba(194,59,51,.10)", stroke: RED, "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-dasharray": c.t === "zona" ? "6 5" : "none", opacity: .32, "pointer-events": "none" }, contourG);
    contours[k].dataset.t = c.t;
  });

  // marcos
  var pinG = mk("g", {}, svg), pins = {}, labels = [], radii = [];
  var cp = P.centro, cg = mk("g", {}, pinG);
  var ct = mk("text", { x: cp.x - 9, y: cp.y + 4, "text-anchor": "end", fill: INK, "font-family": "DM Serif Display, serif", "font-style": "italic", "font-size": 13, stroke: "#E6D3A5", "paint-order": "stroke" }, cg); ct.textContent = "Paraty"; labels.push({ el: ct, px: 15, st: 3 });
  var cdot = mk("rect", { x: cp.x - 3, y: cp.y - 3, width: 6, height: 6, fill: INK, transform: "rotate(45 " + cp.x + " " + cp.y + ")" }, cg); radii.push({ el: cdot, px: 3.4, sq: true });

  DEST.forEach(function (d, i) {
    var p = P[d.id]; d.x = p.x; d.y = p.y;
    var g = mk("g", { class: "pin", tabindex: 0, role: "button", "aria-label": d.name }, pinG);
    var pulse = mk("circle", { cx: p.x, cy: p.y, r: 12, fill: "none", stroke: RED, "stroke-width": 1.5, class: "pulse", opacity: 0 }, g);
    var home = d.id === "farol";
    var c = mk("circle", { class: "c", cx: p.x, cy: p.y, r: 10, fill: home ? RED : "#0A2350", stroke: "#fff", "stroke-width": 2 }, g);
    var n = mk("text", { x: p.x, y: p.y + 4, "text-anchor": "middle", fill: "#fff", "font-family": "Jost, sans-serif", "font-weight": 600, "font-size": 11, "pointer-events": "none" }, g);
    n.setAttribute("class", "pn"); n.textContent = home ? "⚓" : String(i);
    var t = mk("text", { x: p.x + 16, y: p.y + 5, fill: "#0A2350", "font-family": "Jost, sans-serif", "font-weight": 600, "font-size": 14, stroke: "#fff", "paint-order": "stroke", "stroke-linejoin": "round" }, g);
    t.textContent = d.name.replace("Marina ", "");
    if (home) { t.textContent = "Marina Farol de Paraty"; t.setAttribute("y", p.y + 28); t.setAttribute("x", p.x + 4); }
    if (d.id === "velha") { t.setAttribute("x", p.x + 4); t.setAttribute("y", p.y + 28); }
    if (d.id === "lagoa") { t.setAttribute("y", p.y - 14); }
    if (d.id === "algodao") { t.setAttribute("y", p.y - 14); t.setAttribute("x", p.x + 2); }
    pins[d.id] = { g: g, c: c, t: t, n: n, pulse: pulse };
    radii.push({ el: c, px: home ? 13 : 10.5 }); labels.push({ el: t, px: 14.5, st: 4.6 }); labels.push({ el: n, px: 11.5, st: 0 });
    g.addEventListener("click", function () { var st = $('.mstep[data-i="' + i + '"]'); if (st) st.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); g.dispatchEvent(new MouseEvent("click", { bubbles: true })); } });
  });
  var routeL = mk("line", { stroke: RED, "stroke-dasharray": "2 7", "stroke-linecap": "round", opacity: 0 }, svg);
  svg.insertBefore(routeL, pinG);
  var distLbl = mk("text", { "text-anchor": "middle", fill: RED, "font-family": "Jost, sans-serif", "font-weight": 600, stroke: "#fff", "paint-order": "stroke", "stroke-linejoin": "round", opacity: 0, "pointer-events": "none" }, svg);

  // escala (2 km)
  var kmU = VW / (Math.abs(G.LON1 - G.LON0) * 111.32 * Math.cos(23.24 * Math.PI / 180));
  var scale = mk("g", {}, svg), sl = mk("line", { stroke: INK }, scale), st0 = mk("text", { fill: INK, "font-family": "Jost, sans-serif" }, scale); st0.textContent = "2 km";

  var vb = { x: 0, y: 0, w: VW, h: VH }, raf = 0;
  function aspect() { var r = svg.getBoundingClientRect(); return r.width && r.height ? r.width / r.height : VW / VH; }
  function fit(cx, cy, w) { var a = aspect(), h = w / a; return { x: cx - w / 2, y: cy - h / 2, w: w, h: h }; }
  function applyVB(v) {
    svg.setAttribute("viewBox", v.x.toFixed(1) + " " + v.y.toFixed(1) + " " + v.w.toFixed(1) + " " + v.h.toFixed(1));
    var u = v.w / (svg.getBoundingClientRect().width || 800);
    labels.forEach(function (l) { l.el.setAttribute("font-size", (l.px * u).toFixed(2)); if (l.st !== 0) l.el.setAttribute("stroke-width", ((l.st || 4) * u).toFixed(2)); });
    tlabels.forEach(function (l) { l.el.setAttribute("font-size", (l.px * u).toFixed(2)); });
    radii.forEach(function (r) { var rr = r.px * u; if (r.sq) { var cx = r.el.getAttribute("x") * 1 + 3, cy = r.el.getAttribute("y") * 1 + 3; r.el.setAttribute("width", rr * 2); r.el.setAttribute("height", rr * 2); r.el.setAttribute("x", cp.x - rr); r.el.setAttribute("y", cp.y - rr); r.el.setAttribute("transform", "rotate(45 " + cp.x + " " + cp.y + ")"); } else r.el.setAttribute("r", rr.toFixed(2)); });
    for (var id in pins) { var pn = pins[id]; pn.c.setAttribute("stroke-width", (2 * u).toFixed(2)); pn.pulse.setAttribute("r", (13 * u).toFixed(2)); pn.pulse.setAttribute("stroke-width", (1.6 * u).toFixed(2)); }
    glabels.forEach(function (g) { g.el.setAttribute("font-size", (11 * u).toFixed(2)); if (g.kind === "lon") { g.el.setAttribute("x", g.v); g.el.setAttribute("y", v.y + 14 * u); } else { g.el.setAttribute("x", v.x + 6 * u); g.el.setAttribute("y", g.v - 4 * u); } });
    grid.setAttribute("stroke-width", (0.8 * u).toFixed(2));
    for (var ck in contours) { var cel = contours[ck], isCur = cel.getAttribute("data-cur") === "1"; cel.setAttribute("stroke-width", ((isCur ? 2.6 : 1.9) * u).toFixed(2)); if (cel.dataset.t === "zona") cel.setAttribute("stroke-dasharray", (6 * u) + " " + (5 * u)); }
    distLbl.setAttribute("font-size", (13 * u).toFixed(2)); distLbl.setAttribute("stroke-width", (4.5 * u).toFixed(2));
    routeL.setAttribute("stroke-width", (3 * u).toFixed(2)); routeL.setAttribute("stroke-dasharray", (2 * u) + " " + (7 * u));
    var px = v.x + 26 * u, py = v.y + v.h - 24 * u, len = kmU * 2;
    sl.setAttribute("x1", px); sl.setAttribute("x2", px + len); sl.setAttribute("y1", py); sl.setAttribute("y2", py); sl.setAttribute("stroke-width", 2.4 * u);
    st0.setAttribute("x", px); st0.setAttribute("y", py - 7 * u); st0.setAttribute("font-size", 12 * u);
    scale.setAttribute("opacity", len / v.w > 0.6 ? 0 : 1);
  }
  function flyTo(t, instant) {
    cancelAnimationFrame(raf);
    if (instant || reduce) { vb = t; applyVB(vb); return; }
    var s0 = { x: vb.x, y: vb.y, w: vb.w, h: vb.h }, t0 = performance.now(), D = 1200;
    (function step(now) {
      var k = clamp((now - t0) / D, 0, 1), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      vb = { x: s0.x + (t.x - s0.x) * e, y: s0.y + (t.y - s0.y) * e, w: s0.w + (t.w - s0.w) * e, h: s0.h + (t.h - s0.h) * e };
      applyVB(vb); if (k < 1) raf = requestAnimationFrame(step);
    })(t0);
  }
  var preSteps = $$(".mstep", stepsEl);
  DEST.forEach(function (d, i) {
    var km = dist(d), el = preSteps[i];
    if (!el) {
      el = document.createElement("div");
      el.className = "mstep"; el.dataset.i = i;
      el.innerHTML = '<span class="mstep__n">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="mstep__tag">' + esc(d.tag) + "</span><h3>" + esc(d.name) + "</h3><p>" + esc(d.text) + "</p>" +
        '<span class="mstep__d">' + (i === 0 ? "Ponto de partida" : "Distância aprox.: " + approx(km).replace("≈ ", "") + " · " + approxMn(km).replace("≈ ", "") + " em linha reta") + "</span>";
      stepsEl.appendChild(el);
    }
    d.km = km;
  });
  function setStep(i, instant) {
    if (i === curStep) return; curStep = i;
    var d = DEST[i], home = P.farol;
    $$(".mstep").forEach(function (el, k) { el.classList.toggle("is-on", k === i); });
    for (var id in pins) { var on = id === d.id; pins[id].pulse.setAttribute("opacity", on ? 1 : 0); pins[id].c.setAttribute("fill", on ? "#66C8F5" : (id === "farol" ? RED : "#0A2350")); pins[id].n.setAttribute("fill", on ? "#0A2350" : "#fff"); }
    $("#mapN").textContent = String(i + 1).padStart(2, "0") + " / " + String(DEST.length).padStart(2, "0");
    $("#mapName").textContent = d.name;
    $("#mapDist").textContent = i === 0 ? "Ponto de partida" : "Distância aprox.: " + approx(d.km).replace("≈ ", "") + " em linha reta";
    for (var ck2 in contours) { var on2 = ck2 === d.id; contours[ck2].setAttribute("data-cur", on2 ? "1" : "0"); contours[ck2].setAttribute("opacity", i === 0 ? .8 : (on2 ? 1 : .22)); contours[ck2].setAttribute("fill", on2 ? "rgba(194,59,51,.20)" : "rgba(194,59,51,.08)"); }
    if (i === 0) { routeL.setAttribute("opacity", 0); distLbl.setAttribute("opacity", 0); }
    else { distLbl.textContent = approx(d.km).replace("≈ ", "") + " aprox."; distLbl.setAttribute("x", (home.x + d.x) / 2); distLbl.setAttribute("y", (home.y + d.y) / 2 - 8); distLbl.setAttribute("opacity", 1);
      routeL.setAttribute("x1", home.x); routeL.setAttribute("y1", home.y); routeL.setAttribute("x2", d.x); routeL.setAttribute("y2", d.y); routeL.setAttribute("opacity", .9); }
    var target;
    if (i === 0) { target = fit(VW * 0.5, VH * 0.5, VW); }
    else { var mx = (home.x + d.x) / 2, my = (home.y + d.y) / 2, span = Math.max(Math.abs(home.x - d.x), Math.abs(home.y - d.y) * aspect()); target = fit(mx, my, clamp(span * 1.9, 330, VW)); }
    flyTo(target, instant);
  }
  var startStep = SHOT && Q.get("step") ? clamp(Number(Q.get("step")), 0, DEST.length - 1) : 0;
  setStep(startStep, true);
  if ("IntersectionObserver" in window && !(SHOT && Q.get("step"))) {
    var mio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setStep(Number(e.target.dataset.i)); });
    }, { rootMargin: "-42% 0px -42% 0px" });
    $$(".mstep").forEach(function (st) { mio.observe(st); });
  }
  window.addEventListener("resize", function () { var k = curStep; curStep = -1; setStep(k < 0 ? 0 : k, true); });

  /* ---------- Galeria arrastável ---------- */
  var SH = [
    ["assets/img/m/gtx-300-1.jpg", "Sea-Doo GTX 300 Limited na baía de Paraty", 1.501],
    ["assets/img/m/infinity-345-4.jpg", "Infinity 345 HT em navegação", 0.75],
    ["assets/img/m/paraty-hero-2.jpg", "Pôr do sol sobre a serra, visto da baía", 1.501],
    ["assets/img/m/wake-170-1.jpg", "Sea-Doo Wake 170 em ação", 0.75],
    ["assets/img/m/conquest-180-1.jpg", "Conquest 180 Open ancorada", 1.333],
    ["assets/img/m/solara-410-3.jpg", "Solara 410 HT na marina, fim de tarde", 0.75],
    ["assets/img/m/paraty-lugar-2.jpg", "Escunas e saveiros ancorados na baía", 1.501],
    ["assets/img/m/gtx-300-5.jpg", "Sea-Doo GTX 300 em contraluz", 1.501],
    ["assets/img/m/paraty-vida-1.jpg", "Jet ski ao pôr do sol", 0.666]
  ];
  var strip = $("#strip");
  SH.forEach(function (s) {
    var f = document.createElement("figure"); f.className = "shot"; f.style.margin = 0; f.style.setProperty("--r", s[2]);
    f.innerHTML = pictureHtml(s[0], esc(s[1]), "(max-width: 640px) 70vw, 560px", null, { w: Math.round(s[2] * 700), h: 700 }) + "<figcaption>" + esc(s[1]) + "</figcaption>";
    strip.appendChild(f);
  });
  (function () {
    var down = false, sx = 0, sl0 = 0, moved = false;
    strip.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") return; down = true; moved = false; sx = e.clientX; sl0 = strip.scrollLeft; strip.classList.add("is-drag"); });
    window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; strip.scrollLeft = sl0 - dx; });
    window.addEventListener("pointerup", function () { down = false; strip.classList.remove("is-drag"); });
    strip.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") strip.scrollBy({ left: 360, behavior: "smooth" }); if (e.key === "ArrowLeft") strip.scrollBy({ left: -360, behavior: "smooth" }); });
  })();

  /* ---------- Reveal ---------- */
  var rv = $$(".reveal");
  if (SHOT || !("IntersectionObserver" in window)) rv.forEach(function (i) { i.classList.add("is-in"); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    rv.forEach(function (i) { io.observe(i); });
  }

  if (SHOT && Q.get("at")) {            // teste: mostra a seção pedida no topo, sem rolar
    var tgt = document.getElementById(Q.get("at"));
    if (tgt) { var sib = tgt.previousElementSibling; while (sib) { sib.style.display = "none"; sib = sib.previousElementSibling; } }
    document.body.classList.add("is-shot-at");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
