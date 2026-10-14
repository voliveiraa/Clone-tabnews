import Link from "next/link";

export default function Pager({ page, total }) {
  if (total <= 1) return null;
  const href = (n) => (n === 1 ? "/" : `/pagina/${n}`);
  return (
    <div className="pager">
      {page > 1 ? <Link href={href(page - 1)}>← Anterior</Link> : <span />}
      {page < total ? <Link href={href(page + 1)}>Próximo →</Link> : <span />}
    </div>
  );
}
