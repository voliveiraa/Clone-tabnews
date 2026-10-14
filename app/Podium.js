import { titleLabel } from "@/lib/avatar";
import PixelAvatar from "./PixelAvatar";

const MEDALS = ["🥇", "🥈", "🥉"];

// Pódio da semana: top 3 autores (10 pontos por post da semana + 1 por curtida neles).
// Ordem visual 2º · 1º · 3º, como um pódio de verdade.
export default function Podium({ ranking }) {
  if (!ranking.length) return null;
  const order = [ranking[1], ranking[0], ranking[2]];
  return (
    <section className="card podium-card">
      <h2>Pódio da semana</h2>
      <div className="podium">
        {order.map((r, i) => r && (
          <div key={r.name} className={`step step-${[2, 1, 3][i]}`}>
            <PixelAvatar avatar={r.avatar} size={[44, 56, 40][i]} title={r.name} />
            <span className="who" title={r.name}>{r.name.split(" ")[0]}</span>
            <span className="pts">{r.points} pts</span>
            <div className="block">{MEDALS[[1, 0, 2][i]]}</div>
          </div>
        ))}
      </div>
      <ol className="sidelist ranked">
        {ranking.slice(0, 3).map((r) => (
          <li key={r.name}>
            <span>{r.name}<span className="meta"> · {titleLabel(r.title, r.avatar?.body)}</span></span>
            <span className="count">{r.posts} {r.posts === 1 ? "post" : "posts"} · 👍 {r.likes}</span>
          </li>
        ))}
      </ol>
      <p className="meta">Zera toda segunda-feira.</p>
    </section>
  );
}
