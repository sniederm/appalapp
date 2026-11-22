# Appalapp

Sammlung kleiner, eigenständiger Lern-Webapps für die 5. Klasse. Die Übersichtsseite `index.html` listet automatisch alle Apps
mit Beschreibung und Vorschaubild auf; ein Klick öffnet die App in einem neuen Tab.

Appalapp ist ein kostenloses, privates Projekt ohne geschäftsmäßige Nutzung (siehe `nutzungsvereinbarung.html`).

## Aufbau

```
index.html                  Übersichtsseite (rendert window.APPS, Suche + Fachfilter)
apps.js                     generiert aus allen app.json – nicht von Hand bearbeiten
logo.svg                    Logo und Favicon
datenschutz.html            Datenschutzerklärung (Platzhalter ausfüllen!)
nutzungsvereinbarung.html   Gewähr und Haftung (Platzhalter ausfüllen!)
fonts/                      lokale Schriften + fonts.css – generiert
shared/back.js              einheitlicher Zurück-Pfeil <appalapp-back>
scripts/build-index.mjs     erzeugt apps.js
scripts/fetch-fonts.mjs     lädt Schriften nach fonts/
lessons/<fach>/<app>/       index.html, app.json, thumbnail.svg
```

## Regeln für alle Apps

Diese Regeln gelten für jede App unter `lessons/`. Sie halten die Seite einheitlich, datenschutzfreundlich und ohne Build-Schritt
veröffentlichbar.

### 1. Eigenständig und statisch

- Eine App ist **eine `index.html`** in ihrem eigenen Ordner, CSS und JavaScript stehen inline.
  Bilder, Töne usw. liegen bei Bedarf im selben Ordner.
- Keine Abhängigkeit zu anderen Apps. Gemeinsam genutzt werden dürfen nur `fonts/fonts.css` und `shared/back.js`.
- Kein Build-Schritt, kein Framework, kein Server-Code. Die Seite muss als reine Datei funktionieren.
- **Alle Pfade relativ** (`../../../fonts/fonts.css`), nie mit `/` beginnend. So läuft die App per Doppelklick (`file://`),
  unter `https://<user>.github.io/appalapp/` und unter einer eigenen Domain.
- Kein `fetch()` auf lokale Dateien – das blockiert der Browser bei `file://`. Daten gehören als JavaScript in die Seite.

### 2. Keine externen Verbindungen (DSGVO)

- **Nichts von fremden Servern laden:** keine Google Fonts, keine CDNs (auch nicht für Bibliotheken), keine Analytics,
  keine Einbettungen (YouTube, Karten, Social Media), keine Bilder von anderen Seiten.
- Schriften: nur die lokalen aus `fonts/` verwenden. Neue Schrift → Familie in `scripts/fetch-fonts.mjs` ergänzen,
  `node scripts/fetch-fonts.mjs` ausführen und `fonts/` mitcommitten.
- Prüfen vor dem Commit: `grep -rnE "https?://" lessons/<fach>/<app>/` darf keine geladenen Ressourcen finden
  (normale Links zum Anklicken und XML-Namespaces wie `http://www.w3.org/2000/svg` sind in Ordnung).
- Die Sprachausgabe des Browsers (`speechSynthesis`) ist erlaubt, sie läuft auf dem Gerät.

### 3. Keine persönlichen Daten

- Keine Formulare, Konten, Logins, Namenseingaben oder Uploads.
- Speichern nur im Browser über `localStorage`, und nur für Lernfortschritt und Einstellungen (Sterne, Rekorde, zuletzt geübte Wörter).
- Jeder Speicher-Schlüssel enthält den App-Namen, damit sich Apps nicht in die Quere kommen
  (bestehend: `qw_best`, `qw_seen`, `pluralProfi`, `pluralProfiSeen`).
- Jeder Zugriff auf `localStorage` steht in `try/catch`; die App muss auch ohne Speicher (privates Fenster) laufen.
- Kommt eine neue Art von Datenverarbeitung dazu, muss `datenschutz.html` angepasst werden.

### 4. Kein kommerzieller Inhalt

- Keine Werbung, Spendenaufrufe, Affiliate-Links oder Verkäufe. Sonst gilt die Seite als geschäftsmäßig und braucht ein
  Impressum mit Anschrift – darauf ist die Seite bewusst nicht ausgelegt.

### 5. Einheitliche Navigation

- Jede App hat **links in ihrer Kopfzeile den Zurück-Pfeil**, auf jedem Bildschirm der App:

  ```html
  <head>
    …
    <link rel="stylesheet" href="../../../fonts/fonts.css">
    <script src="../../../shared/back.js"></script>
  </head>
  …
  <header><appalapp-back></appalapp-back> <h1>Meine App</h1></header>
  ```

- Ohne weiteres Zutun führt er zur Übersicht. Hat die App eigene Menüs, führt er zuerst eine Ebene zurück:

  ```js
  // true = App hat selbst navigiert, false = weiter zur Übersicht
  window.appBack = () => { if (imMenü) return false; zeigeMenü(); return true; };
  ```

- Den Pfeil nicht nachbauen oder umstylen und keine zusätzlichen Zurück-/Home-Knöpfe oben links einbauen.
  Große „Menü“- oder „Nochmal“-Knöpfe auf Ergebnisseiten sind in Ordnung.

### 6. Zielgruppe und Sprache

- Zielgruppe ist die **5. Klasse**; in `app.json` steht `"level": "Klasse 5"`.
- Bedienung, Anleitungen und Tipps auf **Deutsch**, Schülerinnen und Schüler werden mit **du** angesprochen.
  Lerninhalte stehen in der Fachsprache (z. B. Englisch).
- Ermutigende Rückmeldung: Bei Fehlern gibt es einen Tipp und einen zweiten Versuch statt nur „falsch“.
- Inhalte sorgfältig prüfen – es gibt keine Gewähr, aber falsche Lerninhalte schaden am meisten.

### 7. Abwechslung

- Aufgaben aus einem **großen Pool** ziehen, nicht aus festen Listen. Richtwert: mindestens drei- bis viermal so viele
  Wörter/Sätze, wie eine Runde braucht.
- Zuletzt gespielte Inhalte merken (`localStorage`) und bevorzugt andere auswählen – Vorbild sind `freshShuffle()` und
  `markSeen()` in Question Words und Plural-Profi.

### 8. Handy, Tablet, Barrierefreiheit

- `<meta name="viewport" content="width=device-width, initial-scale=1">` ist Pflicht.
- Ab 360 px Breite ohne horizontales Scrollen nutzbar, auf Tablet und Desktop gut lesbar.
- Bedienbar per Antippen; Tipp- und Klickflächen mindestens 44 × 44 px. Drag & Drop nur mit einer Tipp-Alternative.
- Gut lesbare Schriftgrößen (Fließtext mindestens 16 px) und ausreichender Kontrast.
- Animationen respektieren `prefers-reduced-motion`.
- Knöpfe sind `<button>`, Symbole ohne Text bekommen ein `aria-label`.

### 9. Steckbrief und Vorschaubild

- Jede App hat eine `app.json` (Pflicht: `title`, `description`, `subject`):

  ```json
  {
    "title": "Question Words",
    "description": "Kurzbeschreibung in ein bis zwei Sätzen: was geübt wird und wie.",
    "subject": "Englisch",
    "level": "Klasse 5",
    "tags": ["Vokabeln", "Spiel"],
    "thumbnail": "thumbnail.svg",
    "added": "2026-11-21"
  }
  ```

- `subject` ist der Fachfilter auf der Übersicht – bestehende Schreibweisen verwenden (`Englisch`, `Mathe`).
- Ordnername = Fach (englisch, klein) und App-Name (klein, mit Bindestrichen): `lessons/english/plural-profi/`.
- `thumbnail.svg` im Format **640 × 400** (16:10) im Farbstil der App. Im SVG nur Systemschriften verwenden
  (`system-ui, sans-serif`) – als Bild eingebunden kann ein SVG keine Webfonts laden.

## Neue App hinzufügen

1. Ordner `lessons/<fach>/<app-name>/` mit `index.html` anlegen und die Regeln oben umsetzen
   (Schriften, Zurück-Pfeil, keine externen Ressourcen).
2. `app.json` und `thumbnail.svg` daneben legen.
3. Übersicht neu erzeugen: `node scripts/build-index.mjs` – schreibt `apps.js`, bitte mitcommitten.
   Das Skript bricht ab, wenn Pflichtfelder oder die `index.html` fehlen.

### Checkliste vor dem Commit

- [ ] `node scripts/build-index.mjs` ausgeführt, App erscheint auf der Übersicht
- [ ] App per Doppelklick auf `index.html` (ohne Server) getestet
- [ ] In schmalem Fenster (Handy-Breite) getestet
- [ ] Zurück-Pfeil führt auf jedem Bildschirm ins vorherige Menü bzw. zur Übersicht
- [ ] Keine Fehler in der Browser-Konsole
- [ ] Keine externen Ressourcen (siehe Regel 2), keine persönlichen Daten (Regel 3)

## Lokal ansehen

`index.html` per Doppelklick öffnen – oder `python3 -m http.server 8000` im Repo-Root und http://localhost:8000 aufrufen.

## Veröffentlichen

Rein statisch über GitHub Pages: Settings → Pages → „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
Für eine eigene Domain die Domain dort eintragen (legt die Datei `CNAME` an) und beim Domain-Anbieter einen CNAME
(Subdomain) bzw. die A-Einträge von GitHub (Hauptdomain) setzen; danach „Enforce HTTPS“ aktivieren.

Vor der ersten Veröffentlichung die Platzhalter in `datenschutz.html` und `nutzungsvereinbarung.html` ausfüllen.
