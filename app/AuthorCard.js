import { titleLabel } from "@/lib/avatar";
import PixelAvatar from "./PixelAvatar";

// Cartão pequeno do autor, na lateral direita do post.
export default function AuthorCard({ author }) {
  return (
    <section className="card author-card">
      <h2>Autor</h2>
      <div className="author-row">
        <PixelAvatar avatar={author.avatar} size={64} title={author.name} />
        <div>
          <strong>{author.name}</strong>
          <span className="author-title">{titleLabel(author.title, author.avatar?.body)}</span>
          {author.posts != null && <span className="meta">{author.posts} publicação(ões)</span>}
        </div>
      </div>
    </section>
  );
}
