# Appalapp

Sammlung kleiner, eigenständiger Lern-Webapps. Die Übersichtsseite `index.html` listet automatisch alle Apps auf.

## Neue App hinzufügen

1. Ordner anlegen: `lessons/<fach>/<app-name>/` mit einer eigenständigen `index.html`
   (alle Pfade **relativ**, keine Abhängigkeit zu anderen Apps).
2. Daneben eine `app.json` und optional ein `thumbnail.svg`/`.png` (16:10) ablegen:

   ```json
   {
     "title": "Question Words",
     "description": "Kurzbeschreibung in ein bis zwei Sätzen.",
     "subject": "Englisch",
     "level": "Klasse 5",
     "tags": ["Vokabeln", "Spiel"],
     "thumbnail": "thumbnail.svg",
     "added": "2026-11-21"
   }
   ```
   Pflicht sind `title`, `description`, `subject`.
3. Übersicht neu erzeugen: `node scripts/build-index.mjs` (schreibt `apps.js`, bitte mitcommitten).

## Lokal ansehen

`python3 -m http.server 8000` im Repo-Root, dann http://localhost:8000. (`index.html` funktioniert auch per Doppelklick.)

## Schriften (DSGVO)

Die Seite lädt keine Schriften von Google. Alle Fonts liegen lokal in `fonts/`, jede App bindet `fonts/fonts.css` relativ ein
(`../../../fonts/fonts.css`). Neue Schrift verwenden: Familie in `scripts/fetch-fonts.mjs` ergänzen und
`node scripts/fetch-fonts.mjs` ausführen. Keine externen CDNs, Tracker oder Einbettungen verwenden.

## Aufbau

```
datenschutz.html, nutzungsvereinbarung.html   rechtliche Seiten (Platzhalter ausfüllen!)
fonts/                lokale Schriften + fonts.css
index.html            Übersichtsseite (rendert window.APPS, Suche + Fachfilter)
apps.js               generiert aus allen app.json
scripts/build-index.mjs
lessons/<fach>/<app>/ index.html, app.json, thumbnail.svg
```

Hosting: rein statisch, z. B. GitHub Pages (Branch `main`, Root). Alle Links sind relativ und funktionieren auch unter `/<repo>/`.
