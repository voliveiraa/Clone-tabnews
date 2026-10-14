"use client";
import { useState } from "react";
import { DEFAULT_AVATAR, normalizeAvatar, OPTIONS, PALETTES, TITLES, titleLabel } from "@/lib/avatar";
import PixelAvatar from "./PixelAvatar";

function Choice({ label, options, value, onChange }) {
  return (
    <div className="av-row">
      <span className="av-label">{label}</span>
      <div className="av-chips">
        {Object.entries(options).map(([k, v]) => (
          <button key={k} type="button" className={`chip${value === k ? " on" : ""}`} onClick={() => onChange(k)}>{v}</button>
        ))}
      </div>
    </div>
  );
}

function Swatches({ label, colors, value, onChange }) {
  return (
    <div className="av-row">
      <span className="av-label">{label}</span>
      <div className="av-chips">
        {colors.map((c) => (
          <button key={c} type="button" className={`swatch${value === c ? " on" : ""}`} style={{ background: c }}
            onClick={() => onChange(c)} aria-label={`Cor ${c}`} />
        ))}
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Outra cor" />
      </div>
    </div>
  );
}

// Monta o avatar e o cargo; envia em campos ocultos "avatar" (JSON) e "title".
export default function AvatarBuilder({ initialAvatar, initialTitle = "analista-jr", name = "" }) {
  const [a, setA] = useState(() => normalizeAvatar(initialAvatar || DEFAULT_AVATAR));
  const [title, setTitle] = useState(initialTitle);
  const set = (k) => (v) => setA((p) => ({ ...p, [k]: v }));

  return (
    <div className="av-builder">
      <div className="av-preview">
        <PixelAvatar avatar={a} size={192} />
        <div className="av-name">{name || "Seu nome"}</div>
        <div className="av-title">{titleLabel(title, a.body)}</div>
      </div>
      <div className="av-controls">
        <Choice label="Corpo" options={OPTIONS.body} value={a.body} onChange={set("body")} />
        <Swatches label="Pele" colors={PALETTES.skin} value={a.skin} onChange={set("skin")} />
        <Choice label="Cabelo" options={OPTIONS.hair} value={a.hair} onChange={set("hair")} />
        <Swatches label="Cor do cabelo" colors={PALETTES.hair} value={a.hairColor} onChange={set("hairColor")} />
        <Choice label="Acessório" options={OPTIONS.acc} value={a.acc} onChange={set("acc")} />
        {a.acc !== "nenhum" && a.acc !== "oculos" &&
          <Swatches label="Cor do acessório" colors={PALETTES.colors} value={a.accColor} onChange={set("accColor")} />}
        <Choice label="Camisa" options={OPTIONS.shirt} value={a.shirt} onChange={set("shirt")} />
        <Swatches label="Cor da camisa" colors={PALETTES.colors} value={a.shirtColor} onChange={set("shirtColor")} />
        <Choice label="Calça" options={OPTIONS.bottom} value={a.bottom} onChange={set("bottom")} />
        <Swatches label="Cor da calça" colors={["#9bcf8f", "#3550a0", "#2b2b2b", "#7d7d7d", "#c9a063", "#8c55c4", "#e03c20", "#f2f2f2"]} value={a.bottomColor} onChange={set("bottomColor")} />
        <Swatches label="Tênis" colors={["#c9a063", "#f2f2f2", "#2b2b2b", "#e03c20", "#4c86c6", "#58b05a", "#f2c53d"]} value={a.shoesColor} onChange={set("shoesColor")} />
        <div className="av-row">
          <span className="av-label">Cargo</span>
          <select value={title} onChange={(e) => setTitle(e.target.value)}>
            {Object.keys(TITLES).map((k) => <option key={k} value={k}>{titleLabel(k, a.body)}</option>)}
          </select>
        </div>
      </div>
      <input type="hidden" name="avatar" value={JSON.stringify(a)} />
      <input type="hidden" name="title" value={title} />
    </div>
  );
}
