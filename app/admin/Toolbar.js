"use client";
import { useEffect, useState } from "react";
import { TEXT_COLORS, TEXT_FONTS, TEXT_SIZES } from "@/lib/textstyles";
import { previewMarkdown } from "./preview";

// Barra de formatação do editor. O texto continua em Markdown; cor, fonte e
// tamanho viram <span style="…">, que o site aceita (só com os valores da lista).
export default function Toolbar({ target }) {
  const [preview, setPreview] = useState(null);
  const ta = () => document.getElementById(target);

  // Troca a seleção por before + texto + after e mantém o texto selecionado.
  const wrap = (before, after = before, placeholder = "texto") => {
    const el = ta();
    const { selectionStart: s, selectionEnd: e, value } = el;
    const sel = value.slice(s, e) || placeholder;
    el.setRangeText(before + sel + after, s, e, "end");
    el.setSelectionRange(s + before.length, s + before.length + sel.length);
    el.focus();
  };

  // Aplica um prefixo no começo de cada linha selecionada (títulos, listas, citação).
  const linePrefix = (prefix) => {
    const el = ta();
    const { selectionStart: s, selectionEnd: e, value } = el;
    const start = value.lastIndexOf("\n", s - 1) + 1;
    const end = value.indexOf("\n", e) === -1 ? value.length : value.indexOf("\n", e);
    const lines = value.slice(start, end).split("\n");
    const out = lines.map((l, i) => (typeof prefix === "function" ? prefix(i) : prefix) + l.replace(/^(#{1,6} |> |- |\d+\. )/, "")).join("\n");
    el.setRangeText(out, start, end, "select");
    el.focus();
  };

  const insert = (text) => {
    const el = ta();
    el.setRangeText(text, el.selectionStart, el.selectionEnd, "end");
    el.focus();
  };

  const link = () => {
    const url = prompt("Endereço do link (https://…)");
    if (url && /^(https?:\/\/|mailto:|\/)/i.test(url.trim())) wrap("[", `](${url.trim()})`, "texto do link");
  };

  const span = (style) => (e) => {
    const v = e.target.value;
    e.target.value = "";
    if (v) wrap(`<span style="${style}:${v}">`, "</span>");
  };

  // Atalhos: Ctrl+B negrito, Ctrl+I itálico, Ctrl+K link.
  useEffect(() => {
    const el = ta();
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "b") { e.preventDefault(); wrap("**"); }
      if (k === "i") { e.preventDefault(); wrap("*"); }
      if (k === "k") { e.preventDefault(); link(); }
    };
    el?.addEventListener("keydown", onKey);
    return () => el?.removeEventListener("keydown", onKey);
  });

  async function togglePreview() {
    if (preview !== null) return setPreview(null);
    setPreview("…");
    setPreview(await previewMarkdown(ta().value));
  }

  const B = ({ title, onClick, children }) => (
    <button type="button" className="tb" title={title} aria-label={title} onClick={onClick} disabled={preview !== null}>{children}</button>
  );

  return (
    <>
      <div className="toolbar" role="toolbar" aria-label="Formatação">
        <B title="Negrito (Ctrl+B)" onClick={() => wrap("**")}><b>B</b></B>
        <B title="Itálico (Ctrl+I)" onClick={() => wrap("*")}><i>I</i></B>
        <B title="Sublinhado" onClick={() => wrap("<ins>", "</ins>")}><u>U</u></B>
        <B title="Riscado" onClick={() => wrap("~~")}><s>S</s></B>
        <span className="tb-sep" />
        <B title="Título" onClick={() => linePrefix("## ")}>H2</B>
        <B title="Subtítulo" onClick={() => linePrefix("### ")}>H3</B>
        <B title="Lista" onClick={() => linePrefix("- ")}>• Lista</B>
        <B title="Lista numerada" onClick={() => linePrefix((i) => `${i + 1}. `)}>1. Lista</B>
        <B title="Citação" onClick={() => linePrefix("> ")}>❝</B>
        <B title="Código" onClick={() => wrap("`")}>{"</>"}</B>
        <B title="Link (Ctrl+K)" onClick={link}>🔗</B>
        <B title="Tabela" onClick={() => insert("\n| Coluna 1 | Coluna 2 |\n|---|---|\n| valor | valor |\n")}>▦</B>
        <B title="Linha divisória" onClick={() => insert("\n\n---\n\n")}>―</B>
        <span className="tb-sep" />
        <select className="tb-select" aria-label="Cor do texto" defaultValue="" onChange={span("color")} disabled={preview !== null}>
          <option value="" disabled>Cor</option>
          {Object.entries(TEXT_COLORS).map(([n, c]) => <option key={c} value={c} style={{ color: c }}>● {n}</option>)}
        </select>
        <select className="tb-select" aria-label="Fonte" defaultValue="" onChange={span("font-family")} disabled={preview !== null}>
          <option value="" disabled>Fonte</option>
          {Object.entries(TEXT_FONTS).map(([n, f]) => <option key={n} value={f} style={{ fontFamily: f }}>{n}</option>)}
        </select>
        <select className="tb-select" aria-label="Tamanho" defaultValue="" onChange={span("font-size")} disabled={preview !== null}>
          <option value="" disabled>Tamanho</option>
          {Object.entries(TEXT_SIZES).map(([n, s]) => <option key={n} value={s}>{n}</option>)}
        </select>
        <span className="tb-grow" />
        <button type="button" className={`tb tb-preview${preview !== null ? " on" : ""}`} onClick={togglePreview}>
          {preview !== null ? "✎ Voltar a editar" : "👁 Pré-visualizar"}
        </button>
      </div>
      {preview !== null && <article className="preview" dangerouslySetInnerHTML={{ __html: preview }} />}
      <style>{`#${target}{display:${preview !== null ? "none" : "block"}}`}</style>
    </>
  );
}
