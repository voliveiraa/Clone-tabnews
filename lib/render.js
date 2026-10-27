import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { TEXT_COLORS, TEXT_FONTS, TEXT_SIZES } from "./textstyles";

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Aceita só os valores da lista; aspas e espaços podem variar ("Times New Roman" ou 'Times New Roman').
const flexible = (v) => escape(v)
  .replace(/\s*,\s*/g, "<COMMA>").replace(/ /g, "\\s+").replace(/'/g, "[\"']?").replace(/<COMMA>/g, "\\s*,\\s*");
const oneOf = (values) => new RegExp("^\\s*(" + values.map(flexible).join("|") + ")\\s*$", "i");
// A mesma cor pode chegar como #e5534b ou rgb(229, 83, 75).
const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };

const OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "del", "ins"]),
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    th: ["align", "style", "colspan", "rowspan"],
    td: ["align", "style", "colspan", "rowspan"],
    code: ["class"],
  },
  allowedStyles: {
    span: {
      color: [oneOf(Object.values(TEXT_COLORS).flatMap((c) => [c, rgb(c)]))],
      "font-family": [oneOf(Object.values(TEXT_FONTS))],
      "font-size": [oneOf(Object.values(TEXT_SIZES))],
    },
    th: { "text-align": [/^(left|right|center)$/] },
    td: { "text-align": [/^(left|right|center)$/] },
  },
  allowedClasses: { code: [/^language-[\w-]+$/] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
};

// HTML seguro do post. Vários autores escrevem no site, então só passa
// a formatação conhecida (nada de <script>, onclick, iframes etc.).
export const sanitizeBody = (html) => sanitizeHtml(String(html || ""), OPTIONS);

// format "md" = posts antigos em Markdown; "html" = editor visual.
export function renderBody(body, format = "md") {
  return sanitizeBody(format === "html" ? body : marked.parse(String(body || "")));
}

export const renderMarkdown = (md) => renderBody(md, "md");

// Texto puro (para contar palavras e ver se o post está vazio).
export const plainText = (html) =>
  String(html || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
