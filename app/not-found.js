import Link from "next/link";
export const metadata = { title: "Página não encontrada" };
export default function NotFound() {
  return (<><h1>Página não encontrada</h1><p className="lead">Volte para as <Link href="/" style={{textDecoration:"underline"}}>publicações</Link>.</p></>);
}
