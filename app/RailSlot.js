"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Coloca o conteúdo de uma página no topo da lateral direita (que fica no layout).
export default function RailSlot({ children }) {
  const [el, setEl] = useState(null);
  useEffect(() => setEl(document.getElementById("rail-slot")), []);
  return el ? createPortal(children, el) : null;
}
