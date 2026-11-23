/* Catálogo e destinos da Boatlux Paraty.
   Fonte: fichas de venda e lista de frota enviadas pela Boatlux Paraty (19/11/2026).
   Valores de cota NÃO estão neste arquivo de propósito: o site não exibe preços por enquanto,
   e tudo que está aqui fica público no código da página. */

/* ===== CONFIGURAÇÃO CENTRAL: altere aqui os dados de contato e localização =====
   (o domínio final fica em index.html, robots.txt e sitemap.xml: use `sh set-domain.sh https://seudominio.com.br`) */
window.BOATLUX = {
  whatsapp: "5524999542603",
  whatsappLabel: "(24) 99954-2603",
  phoneTel: "+5524999542603",                 // link tel: do rodapé
  instagram: "https://www.instagram.com/boatlux.paraty/",
  marina: "Farol de Paraty",
  marinaCoord: { lat: -23.2322, lon: -44.6942 },   // ponto da marina (OpenStreetMap)
  // ENDEREÇO COMPLETO da Marina Farol de Paraty: preencha quando tiver (rua, número, bairro, CEP).
  // Enquanto estiver vazio, o rodapé mostra só "Paraty, RJ". Não invente.
  address: "",
  // Link do Google Maps: troque por o link exato do Google Maps da marina, se preferir.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=-23.2322,-44.6942",
};

/* ===== IMAGENS RESPONSIVAS (preparado, desligado) =====
   Quando houver versões otimizadas, registre aqui pelo caminho ORIGINAL da imagem. O site passa a usar <picture>
   com AVIF/WebP e srcset automaticamente. Exemplo:
   window.IMG_VARIANTS["assets/img/m/gtx-300-1.jpg"] = {
     avif: "assets/img/m/gtx-300-1-800.avif 800w, assets/img/m/gtx-300-1-1400.avif 1400w",
     webp: "assets/img/m/gtx-300-1-800.webp 800w, assets/img/m/gtx-300-1-1400.webp 1400w",
     jpg:  "assets/img/m/gtx-300-1-800.jpg 800w, assets/img/m/gtx-300-1.jpg 2200w" }; */
window.IMG_VARIANTS = window.IMG_VARIANTS || {};   // preenchido por assets/js/variants.js (scripts/make-variants.sh)

var I = "assets/img/", M = "assets/img/m/";

window.FROTA = [
  { id: "solara-410", kind: "lancha", code: "L10", name: "Solara 410 HT", alias: "Refúgio", badge: "Premium",
    tagline: "Navegar com estilo, conforto e segurança",
    paxDay: 14, paxNight: 6, motor: "2x Mercury 350 hp", cotas: 6,
    card: I + "solara-410-hero.jpg",
    gallery: [I + "solara-410-hero.jpg", M + "solara-410-3.jpg", M + "solara-410-2.jpg", M + "solara-410-4.jpg", M + "solara-410-5.jpg", M + "solara-410-6.jpg"],
    items: ["Área gourmet com churrasqueira, fogão indução e micro-ondas", "Boiler de água quente, frigobar, geleira e pia", "2 TVs, som Bluetooth, antena Starlink e desumidificador", "Gerador, plataforma submergível, joystick, Stobag e passagem lateral", "Mesa, cadeiras, 2 quartos e teto retrátil", "Bote de apoio e capota de fechamento na popa"] },

  { id: "infinity-380", kind: "lancha", code: "L8", name: "Infinity 380 HT", alias: "Hakuna Matata",
    tagline: "Luxo, autonomia e conforto",
    paxDay: 14, paxNight: 6, motor: "2x 220 hp diesel", cotas: 8,
    card: M + "infinity-380-card.jpg",
    gallery: [M + "infinity-380-card.jpg", M + "infinity-380-3.jpg", M + "infinity-380-5.jpg", M + "infinity-380-6.jpg", M + "infinity-380-4.jpg"],
    items: ["Área gourmet com churrasqueira, fogão indução e micro-ondas", "Boiler de água quente, frigobar, geleira e pia", "2 TVs, som Bluetooth, antena Starlink e desumidificador", "Gerador, plataforma submergível e joystick", "Bote de apoio e capota de fechamento na popa"] },

  { id: "infinity-345", kind: "lancha", code: "L9", name: "Infinity 345 HT", alias: "Almare",
    tagline: "Navegação, conforto e desempenho",
    paxDay: 13, paxNight: 4, motor: "1x Mercury 380 hp gasolina", cotas: 8,
    card: M + "infinity-345-card.jpg",
    gallery: [M + "infinity-345-card.jpg", M + "infinity-345-1.jpg", M + "infinity-345-3.jpg", M + "infinity-345-5.jpg", M + "infinity-345-4.jpg"],
    items: ["Área gourmet com churrasqueira", "Fogão indução e micro-ondas", "Frigobar, geleira e pia", "Hardtop eletrônico", "TV, som Bluetooth e antena Starlink", "Acesso lateral à proa, piso EVA e escada", "Bote de apoio"] },

  { id: "real-330", kind: "lancha", code: "L1", name: "Real 330 Special Edition", alias: "Golden Island", badge: "Chega em 15/12", soon: true,
    tagline: "Conforto, lazer e tecnologia",
    paxDay: 12, paxNight: 4, motor: "1x Mercury 380 hp gasolina", cotas: 6,
    card: I + "real-330-hero.jpg",
    gallery: [I + "real-330-hero.jpg", M + "real-330-2.jpg", M + "real-330-1.jpg", M + "real-330-4.jpg", M + "real-330-6.jpg", M + "real-330-5.jpg"],
    items: ["Churrasqueira inox", "Micro-ondas, frigobar, geleira elétrica e pia", "Sistema de som Bluetooth", "Banheiro completo", "Deck beach", "GPS e bússola", "Capota e escada retrátil"] },

  { id: "triton-300-sport", kind: "lancha", code: "L5", name: "Triton 300 Sport",
    tagline: "Conforto, lazer e tecnologia",
    paxDay: 10, paxNight: 4, motor: "1x Mercury 300 hp gasolina", cotas: 8,
    card: I + "triton-300-sport-hero.jpg",
    gallery: [I + "triton-300-sport-hero.jpg", I + "triton-300-sport-1.jpg", I + "triton-300-sport-2.jpg"],
    items: ["Área gourmet com churrasqueira", "Micro-ondas, frigobar, geleira elétrica e pia", "Ar-condicionado na cabine e ombrelone no cockpit", "Antena Starlink e sistema de som Bluetooth", "Banheiro completo", "Bote de apoio", "Capota de fechamento total"] },

  { id: "conquest-180", kind: "lancha", code: "L7", name: "Conquest 180 Open",
    tagline: "Compacta, completa, prática",
    paxDay: 8, paxNight: 0, motor: "1x Mercury 100 hp (popa)", cotas: 6,
    card: I + "conquest-180-hero.jpg",
    gallery: [I + "conquest-180-hero.jpg", M + "conquest-180-1.jpg", I + "conquest-180-1.jpg", I + "conquest-180-2.jpg"],
    items: ["Churrasqueira", "Geleira e pia", "Capota", "Sistema de som Bluetooth", "Equipada com torre de wake", "Salvatagem completa", "Comando eletrônico"] },

  { id: "gtx-300", kind: "jet", code: "J4", name: "Sea-Doo GTX 300 Limited", alias: "Silver Shark", badge: "Premium",
    tagline: "Navegação de alta performance",
    paxDay: 3, paxNight: 0, motor: "Rotax 1630 ACE Supercharged · 300 hp", cotas: 6,
    card: M + "gtx-300-1.jpg",
    gallery: [M + "gtx-300-1.jpg", M + "gtx-300-2.jpg", M + "gtx-300-3.jpg", M + "gtx-300-4.jpg", M + "gtx-300-5.jpg"],
    items: ["Motor supercharged 1630 ACE de 300 hp", "Painel com tela LCD", "Sistemas de reverso iBR e iDF anti-detritos", "Som Bluetooth 100 W", "Compartimento de 152 L e porta-objetos seco", "Escada, retrovisores, cabos e âncora", "Casco ST3"] },

  { id: "wake-170", kind: "jet", code: "J5", name: "Sea-Doo Wake 170",
    tagline: "Desempenho, versatilidade e diversão",
    paxDay: 3, paxNight: 0, motor: "Rotax 1630 ACE · 170 hp", cotas: 8,
    card: M + "wake-170-card.jpg",
    gallery: [M + "wake-170-card.jpg", M + "wake-170-capa-1.jpg", M + "wake-170-1.jpg"],
    items: ["Rotax 1630 ACE de 170 hp", "Sistemas de reverso iBR e iDF anti-detritos", "Torre de wake retrátil", "Som Bluetooth 100 W", "Compartimento de 152 L e porta-objetos seco", "Escada, retrovisores, cabos e âncora", "Casco Polytech"] },

  { id: "wake-pro-230", kind: "jet", code: "J6", name: "Sea-Doo Wake Pro 230",
    tagline: "Potência, desempenho e diversão",
    paxDay: 3, paxNight: 0, motor: "Rotax 1630 ACE · 230 hp", cotas: 8,
    card: I + "wake-pro-230-hero.jpg",
    gallery: [I + "wake-pro-230-hero.jpg", I + "wake-pro-230-1.jpg", I + "wake-pro-230-2.jpg"],
    items: ["Rotax 1630 ACE de 230 hp", "Sistemas de reverso iBR e iDF anti-detritos", "Torre de wake retrátil", "Som Bluetooth 100 W", "Compartimento de 153 L e porta-objetos seco", "Escada, retrovisores e cabos", "Casco Polytech"] },
];

/* Destinos do mapa. Coordenadas do OpenStreetMap. Textos só com o que tem fonte pública. */
window.DESTINOS = [
  { id: "farol", name: "Marina Farol de Paraty", lat: -23.2322, lon: -44.6942, tag: "Ponto de partida",
    text: "As embarcações da Boatlux ficam aqui. Você chega, encontra tudo pronto e sai para a baía." },
  { id: "jurumirim", name: "Praia do Jurumirim", lat: -23.2094, lon: -44.6659, tag: "Praia",
    text: "Uma das praias que entram nos roteiros de lancha a partir de Paraty." },
  { id: "pescaria", name: "Ilha da Pescaria", lat: -23.1933, lon: -44.6358, tag: "Ilha",
    text: "Aparece entre as paradas dos roteiros de lancha pela baía de Paraty." },
  { id: "lagoa", name: "Lagoa Azul", lat: -23.2045, lon: -44.6213, tag: "Parada clássica",
    text: "Parada tradicional dos passeios de lancha, conhecida pelas águas claras." },
  { id: "velha", name: "Saco da Velha", lat: -23.2104, lon: -44.6198, tag: "Enseada",
    text: "Fica em frente à Ilha do Algodão e costuma ser parada conjunta nos passeios." },
  { id: "algodao", name: "Ilha do Algodão", lat: -23.2128, lon: -44.6001, tag: "Ilha",
    text: "Piscinas naturais e bons pontos para snorkel, em um dos roteiros mais clássicos da baía." },
  { id: "mirim", name: "Paraty-Mirim", lat: -23.2368, lon: -44.6334, tag: "Vilarejo",
    text: "Na entrada do Saco do Mamanguá. É de onde saem muitos dos passeios ao fiorde." },
  { id: "mamangua", name: "Saco do Mamanguá", lat: -23.2658, lon: -44.6299, tag: "Fiorde tropical",
    text: "Um braço de mar longo e estreito entre montanhas de mata atlântica. Um dos destinos mais procurados de lancha em Paraty." },
];

/* cache-bust: força o navegador a buscar as imagens novas */
(function () { var v = "?v=11"; window.FROTA.forEach(function (f) { f.card += v; f.gallery = f.gallery.map(function (g) { return g + v; }); }); })();
