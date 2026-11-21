#!/usr/bin/env node
// Sammelt alle app.json unter lessons/ und schreibt apps.js für die Übersichtsseite.
// Aufruf: node scripts/build-index.mjs
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED = ['title', 'description', 'subject'];

function* findManifests(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* findManifests(p);
    else if (name === 'app.json') yield p;
  }
}

const apps = [];
let failed = false;
for (const file of findManifests(join(root, 'lessons'))) {
  const dir = dirname(file);
  const rel = relative(root, dir).split(sep).join('/');
  const m = JSON.parse(readFileSync(file, 'utf8'));
  const missing = REQUIRED.filter(k => !m[k]);
  if (missing.length) { console.error(`${rel}/app.json: fehlt ${missing.join(', ')}`); failed = true; continue; }
  if (!existsSync(join(dir, 'index.html'))) { console.error(`${rel}: index.html fehlt`); failed = true; continue; }
  apps.push({
    id: rel.replace(/^lessons\//, ''),
    path: `${rel}/`,
    tags: [],
    ...m,
    thumbnail: m.thumbnail && existsSync(join(dir, m.thumbnail)) ? `${rel}/${m.thumbnail}` : null,
  });
}
if (failed) process.exit(1);

apps.sort((a, b) => (b.added || '').localeCompare(a.added || '') || a.title.localeCompare(b.title, 'de'));
writeFileSync(join(root, 'apps.js'),
  `// Automatisch erzeugt von scripts/build-index.mjs – nicht von Hand bearbeiten.\nwindow.APPS = ${JSON.stringify(apps, null, 2)};\n`);
console.log(`${apps.length} App(s) in apps.js geschrieben.`);
