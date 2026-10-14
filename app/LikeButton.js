"use client";
import { useState, useTransition } from "react";
import { toggleLike } from "./likes";

export default function LikeButton({ id, initialTotal, initialLiked }) {
  const [state, setState] = useState({ liked: initialLiked, total: initialTotal });
  const [pending, start] = useTransition();
  const click = () => start(async () => {
    const r = await toggleLike(id);
    if (r) setState(r);
  });
  return (
    <button type="button" className={`like${state.liked ? " on" : ""}`} onClick={click} disabled={pending}
      aria-pressed={state.liked} title={state.liked ? "Desfazer curtida" : "Curtir"}>
      <span aria-hidden="true">👍</span> {state.total} {state.total === 1 ? "curtida" : "curtidas"}
    </button>
  );
}
