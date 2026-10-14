"use client";
import { useRef, useState } from "react";
import { uploadImage } from "./upload";

// Envia a foto e insere ![descrição](url) no texto, na posição do cursor.
export default function ImageUpload({ target }) {
  const input = useRef(null);
  const [status, setStatus] = useState(null);

  async function onChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setStatus({ busy: true, msg: `Enviando ${file.name}…` });
    const fd = new FormData();
    fd.append("file", file);
    let r;
    try { r = await uploadImage(fd); } catch { r = { error: "Falha ao enviar (a imagem pode ser grande demais)." }; }
    if (r.error) return setStatus({ error: r.error });

    const ta = document.getElementById(target);
    const alt = file.name.replace(/\.[^.]+$/, "").replace(/[\[\]]/g, "");
    const md = `\n![${alt}](${r.url})\n`;
    const at = ta.selectionStart ?? ta.value.length;
    ta.value = ta.value.slice(0, at) + md + ta.value.slice(ta.selectionEnd ?? at);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = at + md.length;
    setStatus({ msg: "Foto inserida no texto. Troque a descrição entre [ ] se quiser." });
  }

  return (
    <div className="upload">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onChange} hidden />
      <button type="button" className="secondary" onClick={() => input.current.click()} disabled={status?.busy}>
        📷 Inserir foto
      </button>
      {status && <span className={status.error ? "err" : "meta"}>{status.error || status.msg}</span>}
    </div>
  );
}
