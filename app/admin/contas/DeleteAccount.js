"use client";
import { useState } from "react";
import { removeUser } from "../actions";

// Excluir conta: o admin escolhe na hora o que fazer com as publicações dela.
export default function DeleteAccount({ id, name, posts }) {
  const [open, setOpen] = useState(false);
  if (!open) return <button type="button" className="link danger-link" onClick={() => setOpen(true)}>Excluir</button>;

  const option = (value, label, msg) => (
    <form action={removeUser} style={{ display: "inline" }}
      onSubmit={(e) => { if (!confirm(msg)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="posts" value={value} />
      <button type="submit" className="link danger-link">{label}</button>
    </form>
  );
  const plural = posts === 1 ? "publicação" : "publicações";
  return (
    <span className="delete-choice">
      {posts > 0 ? <>
        {option("apagar", `Excluir conta e ${posts} ${plural}`, `Excluir a conta de ${name} e apagar ${posts} ${plural}? Isso não pode ser desfeito.`)}
        {" · "}
        {option("manter", "Excluir só a conta (manter posts)", `Excluir a conta de ${name}? Os posts continuam no site como "Autor removido".`)}
      </> : option("apagar", "Confirmar exclusão", `Excluir a conta de ${name}? Isso não pode ser desfeito.`)}
      {" · "}
      <button type="button" className="link" onClick={() => setOpen(false)}>Cancelar</button>
    </span>
  );
}
