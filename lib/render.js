import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { TEXT_COLORS, TEXT_FONTS, TEXT_SIZES } from "./textstyles";

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const oneOf = (values) => new RegExp("^(" + values.map(escape).join("|") + ")$", "i");

// Markdown → HTML seguro. Vários autores escrevem no site, então só passa
// a formatação conhecida (nada de <script>, onclick, iframes etc.).
export function renderMarkdown(md) {
  return sanitizeHtml(marked.parse(String(md || "")), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "del", "ins"]),
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"],
      th: ["align", "style"],
      td: ["align", "style"],
      code: ["class"],
    },
    allowedStyles: {
      span: {
        color: [oneOf(Object.values(TEXT_COLORS))],
        "font-family": [oneOf(Object.values(TEXT_FONTS))],
        "font-size": [oneOf(Object.values(TEXT_SIZES))],
      },
      th: { "text-align": [/^(left|right|center)$/] },
      td: { "text-align": [/^(left|right|center)$/] },
    },
    allowedClasses: { code: [/^language-[\w-]+$/] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
}
