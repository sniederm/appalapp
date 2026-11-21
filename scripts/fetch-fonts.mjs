#!/usr/bin/env node
// Lädt die verwendeten Google-Fonts einmalig herunter und legt sie lokal unter fonts/ ab,
// damit beim Besuch der Seite keine Verbindung zu Google aufgebaut wird (DSGVO).
// Aufruf: node scripts/fetch-fonts.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'fonts');
const FAMILIES = [
  'Nunito:wght@500;600;700;800;900',
  'Fredoka:wght@500;600;700',
  'Lilita+One',
  'Kalam:wght@400;700',
  'Atkinson+Hyperlegible:wght@400;700',
];
const SUBSETS = new Set(['latin', 'latin-ext']);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36';

mkdirSync(out, { recursive: true });
// Variable Fonts liefert Google pro Gewicht mit derselben Datei – diese Blöcke fassen wir zu einem
// Block mit Gewichtsbereich zusammen.
const faces = new Map();
for (const fam of FAMILIES) {
  const res = await fetch(`https://fonts.googleapis.com/css2?family=${fam}&display=swap`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${fam}: ${res.status}`);
  const text = await res.text();
  for (const m of text.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)) {
    const [, subset, block] = m;
    if (!SUBSETS.has(subset)) continue;
    const url = block.match(/url\((https:[^)]+\.woff2)\)/)[1];
    const weight = Number(block.match(/font-weight:\s*(\d+)/)[1]);
    const face = faces.get(url) ?? { block, subset, weights: [] };
    face.weights.push(weight);
    faces.set(url, face);
  }
}

let css = '/* Automatisch erzeugt von scripts/fetch-fonts.mjs – nicht von Hand bearbeiten. */\n';
for (const [url, { block, subset, weights }] of faces) {
  const family = block.match(/font-family:\s*'([^']+)'/)[1];
  const lo = Math.min(...weights), hi = Math.max(...weights);
  const name = `${family.replace(/\s+/g, '-').toLowerCase()}-${lo === hi ? lo : `${lo}-${hi}`}-${subset}.woff2`;
  writeFileSync(join(out, name), Buffer.from(await (await fetch(url)).arrayBuffer()));
  css += `/* ${subset} */\n` + block
    .replace(url, name)
    .replace(/font-weight:\s*\d+/, `font-weight: ${lo === hi ? lo : `${lo} ${hi}`}`) + '\n';
}
writeFileSync(join(out, 'fonts.css'), css);
console.log(`${faces.size} Schriftdateien, fonts/fonts.css geschrieben.`);
