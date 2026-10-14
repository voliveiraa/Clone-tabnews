// Avatares em pixel art: uma grade 16x24 montada em camadas (corpo, roupa, cabelo, acessório).
// Cada camada é um desenho em texto; cada letra é um papel de cor e "." é transparente.
//   O contorno  S pele  s pele (sombra)  E olho  M boca  K cílios  W branco
//   T roupa  t roupa (sombra)  P calça  p calça (sombra)  F tênis  f tênis (sombra)
//   H cabelo  h cabelo (sombra)  C acessório  c acessório (sombra)  G lente

export const W = 16, H = 24;

const BASE = [
  "................",
  "................",
  "................",
  "....OOOOOOOO....",
  "...OSSSSSSSSO...",
  "...OSSSSSSSSO...",
  "...OSSESSESSO...",
  "...OSSESSESSO...",
  "...OSSSSSSSSO...",
  "...OSSSMMSSSO...",
  "...OsSSSSSSsO...",
  "....OOOssOOO....",
  "..OTTTTTTTTTTO..",
  ".OTTTTTTTTTTTTO.",
  ".OTTOTTTTTTOTTO.",
  ".OTTOTTTTTTOTTO.",
  ".OSSOttttttOSSO.",
  ".OOOOPPPPPPOOOO.",
  "....OPPPPPPO....",
  "....OPPOOPPO....",
  "....OPPOOPPO....",
  "....OppOOppO....",
  "...OFFFOOFFFO...",
  "...OOOOOOOOOO...",
];

// Detalhes do corpo feminino: cílios e boca colorida.
const FEMALE = { 5: "......K..K......", 9: ".......MM......." };

const SHIRTS = {
  lisa: { label: "Lisa", rows: {} },
  estampa: { label: "Com estampa", rows: { 14: ".....WtWtWt.....", 15: "......tWtW......" } },
  listrada: { label: "Listrada", rows: { 13: ".OttttttttttttO.", 15: ".OttOttttttOttO." } },
  gola: { label: "Gola V", rows: { 12: "..OTTTTSSTTTTO..", 13: ".OTTTTTsTTTTTTO." } },
};

const BOTTOMS = {
  calca: { label: "Calça", rows: {} },
  bermuda: { label: "Bermuda", rows: { 21: "....OSSOOSSO...." } },
  saia: {
    label: "Saia",
    rows: {
      18: "...OPPPPPPPPO...",
      19: "...OppppppppO...",
      20: "....OSSOOSSO....",
      21: "....OSSOOSSO....",
    },
  },
};

const HAIRS = {
  careca: { label: "Careca", rows: {} },
  curto: {
    label: "Curto",
    rows: { 2: "....OOOOOOOO....", 3: "...OHHHHHHHHO...", 4: "...OHHhHHHHhO...", 5: "....H......H...." },
  },
  topete: {
    label: "Topete",
    rows: {
      0: "......OOOO......", 1: ".....OHHHHO.....", 2: "....OOHHHHOO....",
      3: "...OHHHHHHHHO...", 4: "...OHhHHHHhHO...", 5: "....H......H....",
    },
  },
  cacheado: {
    label: "Cacheado",
    rows: {
      0: ".....OOOOOO.....", 1: "...OOHHHHHHOO...", 2: "..OHHhHHHHhHHO..", 3: "..OHHHHHHHHHHO..",
      4: "..OHhHHHHHHhHO..", 5: "..OHH......HHO..", 6: "..OH........HO..", 7: "..OO........OO..",
    },
  },
  longo: {
    label: "Longo",
    rows: {
      2: "....OOOOOOOO....", 3: "...OHHHHHHHHO...", 4: "..OHHHhHHhHHHO..", 5: "..OHH......HHO..",
      6: "..OH........HO..", 7: "..OH........HO..", 8: "..OH........HO..", 9: "..OH........HO..",
      10: "..OH........HO..", 11: "..OHO......OHO..", 12: "..OhO......OhO..", 13: "..OO........OO..",
    },
  },
  chanel: {
    label: "Chanel",
    rows: {
      2: "....OOOOOOOO....", 3: "...OHHHHHHHHO...", 4: "..OHHhHHHHhHHO..", 5: "..OHH......HHO..",
      6: "..OH........HO..", 7: "..OH........HO..", 8: "..OH........HO..", 9: "..OOO......OOO..",
    },
  },
  coque: {
    label: "Coque",
    rows: {
      0: ".....OOOOOO.....", 1: ".....OHhHHO.....", 2: "....OOOOOOOO....",
      3: "...OHHHHHHHHO...", 4: "...OHhHHHHhHO...", 5: "....H......H....",
    },
  },
  rabo: {
    label: "Rabo de cavalo",
    rows: {
      2: "....OOOOOOOO....", 3: "...OHHHHHHHHOO..", 4: "...OHhHHHHhHOHO.", 5: "....H......HOHO.",
      6: "............OHO.", 7: "............OhO.", 8: "............OO..",
    },
  },
};

const ACCESSORIES = {
  nenhum: { label: "Nenhum", rows: {} },
  bone: {
    label: "Boné",
    rows: { 1: ".....OOOOOO.....", 2: "....OCCCCCCO....", 3: "...OCCWWCCCCO...", 4: "OOOOccccccccO...", 5: "....S......S...." },
  },
  gorro: {
    label: "Gorro",
    rows: { 0: ".......OO.......", 1: ".....OOCCOO.....", 2: "....OCCCCCCO....", 3: "...OCCCCCCCCO...", 4: "...OccccccccO..." },
  },
  oculos: { label: "Óculos", rows: { 6: "...OOGGOOGGOO...", 7: "....OGGOOGGO...." } },
  fone: {
    label: "Fone de ouvido",
    rows: { 1: "....OOOOOOOO....", 2: "...OCCCCCCCCO...", 3: "..OC........CO..", 6: "..OC........CO..", 7: "..OC........CO..", 8: "..OO........OO.." },
  },
};

export const OPTIONS = {
  body: { homem: "Homem", mulher: "Mulher" },
  hair: Object.fromEntries(Object.entries(HAIRS).map(([k, v]) => [k, v.label])),
  acc: Object.fromEntries(Object.entries(ACCESSORIES).map(([k, v]) => [k, v.label])),
  shirt: Object.fromEntries(Object.entries(SHIRTS).map(([k, v]) => [k, v.label])),
  bottom: Object.fromEntries(Object.entries(BOTTOMS).map(([k, v]) => [k, v.label])),
};

export const PALETTES = {
  skin: ["#f6d7b0", "#efc084", "#d9a066", "#b07548", "#8a5a3b", "#5e3b26"],
  hair: ["#2b1d14", "#5a3825", "#a0662f", "#e8c26b", "#c0502c", "#b8b8b8", "#e57aa8", "#4c7bd9"],
  colors: ["#e03c20", "#f08a24", "#f2c53d", "#58b05a", "#2f9e8f", "#4c86c6", "#3550a0", "#8c55c4", "#e57aa8", "#f2f2f2", "#7d7d7d", "#2b2b2b"],
};

// Boneco neutro para começar a montar.
export const DEFAULT_AVATAR = {
  body: "homem", skin: PALETTES.skin[1], hair: "curto", hairColor: PALETTES.hair[1],
  acc: "nenhum", accColor: "#2f9e8f", shirt: "lisa", shirtColor: "#7d7d7d",
  bottom: "calca", bottomColor: "#3550a0", shoesColor: "#f2f2f2",
};

// Cargos: chave salva no banco; o rótulo muda com o corpo escolhido.
export const TITLES = {
  "analista-jr": ["Analista Jr", "Analista Jr"],
  "analista-pleno": ["Analista Pleno", "Analista Plena"],
  "analista-sr": ["Analista Sr", "Analista Sr"],
  "especialista-1": ["Especialista 1", "Especialista 1"],
  "especialista-2": ["Especialista 2", "Especialista 2"],
  coordenador: ["Coordenador", "Coordenadora"],
  gerente: ["Gerente", "Gerente"],
  po: ["P.O.", "P.O."],
};
export const titleLabel = (key, body) => TITLES[key]?.[body === "mulher" ? 1 : 0] || "";

const HEX = /^#[0-9a-f]{6}$/i;

// Aceita só valores conhecidos (o JSON vem do formulário).
export function normalizeAvatar(input) {
  const a = { ...DEFAULT_AVATAR };
  if (!input || typeof input !== "object") return a;
  for (const k of ["body", "hair", "acc", "shirt", "bottom"]) if (input[k] in OPTIONS[k]) a[k] = input[k];
  for (const k of ["skin", "hairColor", "accColor", "shirtColor", "bottomColor", "shoesColor"]) if (HEX.test(input[k] || "")) a[k] = input[k];
  return a;
}

function shade(hex, f = 0.72) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * f));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}

// Monta a grade final: [[cor | null] * 16] * 24
export function avatarPixels(input) {
  const a = normalizeAvatar(input);
  const grid = BASE.map((r) => r.split(""));
  const paint = (rows) => {
    for (const [y, row] of Object.entries(rows)) for (let x = 0; x < W; x++) if (row[x] !== ".") grid[y][x] = row[x];
  };
  paint(SHIRTS[a.shirt].rows);
  paint(BOTTOMS[a.bottom].rows);
  if (a.body === "mulher") paint(FEMALE);
  paint(HAIRS[a.hair].rows);
  paint(ACCESSORIES[a.acc].rows);

  const colors = {
    O: "#3b2414", E: "#3b2414", K: "#3b2414", M: a.body === "mulher" ? "#c4455a" : "#3b2414", W: "#ffffff",
    S: a.skin, s: shade(a.skin, 0.82), T: a.shirtColor, t: shade(a.shirtColor), P: a.bottomColor, p: shade(a.bottomColor),
    F: a.shoesColor, f: shade(a.shoesColor), H: a.hairColor, h: shade(a.hairColor, 0.8),
    C: a.accColor, c: shade(a.accColor), G: "#1d2b3a",
  };
  return grid.map((row) => row.map((ch) => (ch === "." ? null : colors[ch] || null)));
}

// Junta pixels vizinhos da mesma cor em retângulos (SVG menor).
export function avatarRects(input) {
  const px = avatarPixels(input);
  const rects = [];
  px.forEach((row, y) => {
    for (let x = 0; x < W; ) {
      const c = row[x];
      let w = 1;
      while (c && x + w < W && row[x + w] === c) w++;
      if (c) rects.push({ x, y, w, c });
      x += w;
    }
  });
  return rects;
}
