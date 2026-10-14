"use client";
import { remove } from "./actions";

// Pede confirmação antes de excluir (a ação revalida a sessão no servidor).
export default function DeleteButton({ id, title, className = "danger", children = "Excluir" }) {
  return (
    <form action={remove} style={{ display: "inline" }}
      onSubmit={(e) => { if (!confirm(`Excluir "${title}"? Isso não pode ser desfeito.`)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>{children}</button>
    </form>
  );
}
