"use client";
import { remove } from "./actions";

// Pede confirmação antes de excluir (a ação revalida a sessão no servidor).
export default function DeleteButton({ id, title, action = remove, field = "id", className = "danger", children = "Excluir" }) {
  return (
    <form action={action} style={{ display: "inline" }}
      onSubmit={(e) => { if (!confirm(`Excluir "${title}"? Isso não pode ser desfeito.`)) e.preventDefault(); }}>
      <input type="hidden" name={field} value={id} />
      <button type="submit" className={className}>{children}</button>
    </form>
  );
}
