"use client";
import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Color, FontFamily, FontSize, TextStyle } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { TEXT_COLORS, TEXT_FONTS, TEXT_SIZES } from "@/lib/textstyles";
import { uploadImage } from "./upload";

// Botões da barra (fora do componente para não serem recriados a cada tecla).
function B({ title, active, onClick, children }) {
  return (
    <button type="button" className={`tb${active ? " on" : ""}`} title={title} aria-label={title} aria-pressed={!!active}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}>{children}</button>
  );
}
function Pick({ label, options, current, onPick, onClear, styleKey }) {
  return (
    <select className="tb-select" aria-label={label} value={current || ""}
      onChange={(e) => (e.target.value ? onPick(e.target.value) : onClear())}>
      <option value="">{label}</option>
      {Object.entries(options).map(([n, v]) => <option key={n} value={v} style={{ [styleKey]: v }}>{styleKey === "color" ? "● " : ""}{n}</option>)}
    </select>
  );
}

// Editor visual (o texto aparece já formatado). Envia o HTML no campo oculto "body";
// o servidor filtra o HTML antes de mostrar no site.
export default function RichEditor({ name = "body", initialHtml = "" }) {
  const [html, setHtml] = useState(initialHtml);
  const [upload, setUpload] = useState(null);
  const file = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
      TableKit.configure({ table: { resizable: false } }),
      TextStyle, Color, FontFamily, FontSize,
      Image,
    ],
    content: initialHtml,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: "rich-content", "aria-label": "Texto da publicação" } },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });

  if (!editor) return <div className="rich-editor"><div className="rich-content">Carregando editor…</div></div>;

  const run = (fn) => () => fn(editor.chain().focus()).run();

  const link = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = prompt("Endereço do link (deixe vazio para remover)", prev);
    if (url === null) return;
    if (!url.trim()) return editor.chain().focus().unsetLink().run();
    if (!/^(https?:\/\/|mailto:|\/)/i.test(url.trim())) return alert("Use um endereço começando com https://");
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  async function onFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setUpload({ msg: `Enviando ${f.name}…` });
    const fd = new FormData();
    fd.append("file", f);
    let r;
    try { r = await uploadImage(fd); } catch { r = { error: "Falha ao enviar (a imagem pode ser grande demais)." }; }
    if (r.error) return setUpload({ error: r.error });
    editor.chain().focus().setImage({ src: r.url, alt: f.name.replace(/\.[^.]+$/, "") }).run();
    setUpload(null);
  }

  const ts = editor.getAttributes("textStyle");
  const inTable = editor.isActive("table");

  return (
    <div className="rich-editor">
      <div className="toolbar" role="toolbar" aria-label="Formatação">
        <B title="Negrito (Ctrl+B)" active={editor.isActive("bold")} onClick={run((c) => c.toggleBold())}><b>B</b></B>
        <B title="Itálico (Ctrl+I)" active={editor.isActive("italic")} onClick={run((c) => c.toggleItalic())}><i>I</i></B>
        <B title="Sublinhado (Ctrl+U)" active={editor.isActive("underline")} onClick={run((c) => c.toggleUnderline())}><u>U</u></B>
        <B title="Riscado" active={editor.isActive("strike")} onClick={run((c) => c.toggleStrike())}><s>S</s></B>
        <span className="tb-sep" />
        <B title="Título" active={editor.isActive("heading", { level: 2 })} onClick={run((c) => c.toggleHeading({ level: 2 }))}>H2</B>
        <B title="Subtítulo" active={editor.isActive("heading", { level: 3 })} onClick={run((c) => c.toggleHeading({ level: 3 }))}>H3</B>
        <B title="Lista" active={editor.isActive("bulletList")} onClick={run((c) => c.toggleBulletList())}>• Lista</B>
        <B title="Lista numerada" active={editor.isActive("orderedList")} onClick={run((c) => c.toggleOrderedList())}>1. Lista</B>
        <B title="Citação" active={editor.isActive("blockquote")} onClick={run((c) => c.toggleBlockquote())}>❝</B>
        <B title="Código" active={editor.isActive("code")} onClick={run((c) => c.toggleCode())}>{"</>"}</B>
        <B title="Link (selecione o texto)" active={editor.isActive("link")} onClick={link}>🔗</B>
        <B title="Inserir tabela" active={inTable} onClick={run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }))}>▦</B>
        <B title="Linha divisória" onClick={run((c) => c.setHorizontalRule())}>―</B>
        <B title="Inserir foto" onClick={() => file.current.click()}>📷</B>
        <span className="tb-sep" />
        <Pick label="Cor" styleKey="color" options={TEXT_COLORS} current={ts.color}
          onPick={(v) => editor.chain().focus().setColor(v).run()} onClear={() => editor.chain().focus().unsetColor().run()} />
        <Pick label="Fonte" styleKey="fontFamily" options={TEXT_FONTS} current={ts.fontFamily}
          onPick={(v) => editor.chain().focus().setFontFamily(v).run()} onClear={() => editor.chain().focus().unsetFontFamily().run()} />
        <Pick label="Tamanho" styleKey="fontSize" options={TEXT_SIZES} current={ts.fontSize}
          onPick={(v) => editor.chain().focus().setFontSize(v).run()} onClear={() => editor.chain().focus().unsetFontSize().run()} />
        <span className="tb-grow" />
        <B title="Desfazer (Ctrl+Z)" onClick={run((c) => c.undo())}>↶</B>
        <B title="Refazer (Ctrl+Y)" onClick={run((c) => c.redo())}>↷</B>
      </div>
      {inTable && (
        <div className="toolbar table-bar" aria-label="Tabela">
          <span className="meta">Tabela:</span>
          <B title="Linha acima" onClick={run((c) => c.addRowBefore())}>+ linha acima</B>
          <B title="Linha abaixo" onClick={run((c) => c.addRowAfter())}>+ linha abaixo</B>
          <B title="Coluna à esquerda" onClick={run((c) => c.addColumnBefore())}>+ coluna ←</B>
          <B title="Coluna à direita" onClick={run((c) => c.addColumnAfter())}>+ coluna →</B>
          <B title="Remover linha" onClick={run((c) => c.deleteRow())}>− linha</B>
          <B title="Remover coluna" onClick={run((c) => c.deleteColumn())}>− coluna</B>
          <B title="Cabeçalho liga/desliga" onClick={run((c) => c.toggleHeaderRow())}>Cabeçalho</B>
          <B title="Excluir tabela" onClick={run((c) => c.deleteTable())}><span className="err">Excluir tabela</span></B>
        </div>
      )}
      <EditorContent editor={editor} />
      <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFile} hidden />
      {upload && <p className={upload.error ? "err" : "meta"} style={{ margin: "6px 0 0" }}>{upload.error || upload.msg}</p>}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
