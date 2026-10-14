import { avatarRects, H, W } from "@/lib/avatar";

// Desenha o avatar em SVG (nítido em qualquer tamanho). size = altura em px.
export default function PixelAvatar({ avatar, size = 48, title }) {
  const rects = avatarRects(avatar);
  return (
    <svg className="pixel-avatar" viewBox={`0 0 ${W} ${H}`} height={size} width={(size * W) / H}
      shapeRendering="crispEdges" role="img" aria-label={title || "Avatar"}>
      {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />)}
    </svg>
  );
}
