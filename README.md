# SMY Concierge – Website

Statische Website (HTML + CSS, kein Build-Tool nötig). Vier Seiten, orientiert an der Service-Logik von RAS, aber bewusst dagegen positioniert: **persönlicher, flexibler, smarter – ohne Konzern-Aufschlag.**

## Aufbau

Aufbau orientiert an der Konkurrenz (RAS), Inhalte/Texte aber eigenständig formuliert.

```
SMY Concierge Website/
├── index.html                    # Startseite → /
├── unternehmen/index.html        # Story, Mission, Werte → /unternehmen/
├── leistungen/index.html         # Übersicht der 6 Services → /leistungen/
│   ├── reception-services/       # Firmenempfang
│   ├── office-management/        # Büroorganisation
│   ├── residential-concierge/    # Wohn-Concierge
│   ├── quartiers-concierge/      # Quartiers-Concierge
│   ├── loyalty-concierge/        # Mitarbeiter-Benefit
│   └── security-services/        # Zugang & Sicherheit
├── service-app/index.html        # geplante App (in Vorbereitung)
├── after-sales/index.html        # Übergabe → Einzug
├── consulting/index.html         # Beratung → /consulting/
├── karriere/index.html           # Stellen + Bewerbung
├── kontakt/index.html            # Kontakt + Anfrage-Formular
├── impressum/index.html          # Impressum
├── datenschutz/index.html        # Datenschutzerklärung
├── partials/
│   ├── header.html               # Navigation inkl. Leistungen-Dropdown (einmal pflegen)
│   └── footer.html               # gemeinsamer Footer (einmal pflegen)
├── js/
│   └── main.js                   # lädt Partials, aktiver Menüpunkt, Dropdown, Mobile-Menü, Formular
├── css/
│   └── style.css                 # komplettes Design-System
└── README.md
```

**Saubere URLs ohne `.html`:** Jede Seite liegt als `index.html` in einem eigenen Ordner. Hoster (Netlify, Vercel, GitHub Pages …) liefern dann automatisch `/leistungen/` statt `/leistungen.html`. Links und CSS sind wurzel-relativ (`/leistungen/`, `/css/style.css`).

**Gemeinsame Bausteine (Partials):** Header und Footer stehen je **einmal** in `partials/`. `js/main.js` lädt sie per `fetch()` in die Platzhalter `<div id="site-header">` / `<div id="site-footer">` jeder Seite und markiert den aktiven Menüpunkt automatisch anhand der URL. Navigation oder Footer also nur noch an **einer** Stelle ändern – nicht auf jeder der 15 Seiten.

> Weil Partials per `fetch()` geladen werden, läuft die Seite über einen Webserver bzw. die Domain-Wurzel (Live Server, Hosting) – **nicht** per Doppelklick via `file://`.

## In VS Code öffnen & ansehen

1. VS Code öffnen → **Datei → Ordner öffnen** → diesen Ordner wählen.
2. Schnell-Vorschau: Erweiterung **„Live Server"** installieren (Marketplace), dann Rechtsklick auf `index.html` → **„Open with Live Server"**. Seite öffnet sich im Browser und lädt bei jeder Änderung neu.
3. Hinweis: Wegen der sauberen URLs (wurzel-relative Pfade) bitte **Live Server** o. ä. nutzen – ein reiner Doppelklick (`file://`) zeigt das CSS nicht korrekt an.

## Anpassen

- **Texte/Inhalte:** direkt im jeweiligen Seiten-`index.html` ändern.
- **Navigation / Footer:** zentral in `partials/header.html` bzw. `partials/footer.html` – wirkt auf allen Seiten.
- **Farben, Schriften, Abstände:** zentral oben in `css/style.css` unter `:root` (z. B. `--gold` = Akzentfarbe, `--ink` = Dunkel).
- **Logo:** aktuell Text „SMY Concierge". Für ein Bild-Logo den `.brand`-Link durch ein `<img>` ersetzen.
- **Bilder:** RAS arbeitet stark mit Fotos. Du kannst echte Bilder in einen Ordner `img/` legen und einbinden – das hebt die Wirkung deutlich. Aktuell bewusst clean/textbasiert für schnellen Start.

## Noch zu erledigen (Pflicht vor Live-Gang)

1. ~~**Telefonnummer** eintragen~~ ✓ erledigt (`+49 1523 6137216` in `kontakt/index.html`, Impressum & Datenschutz).
2. ~~**Impressum & Datenschutz** anlegen~~ ✓ erledigt (`impressum/`, `datenschutz/`, im Footer verlinkt) – siehe Hinweis unten.
3. **Formular aktivieren** (siehe unten).
4. **Echte Referenzen/Cases** ergänzen, sobald der erste Pilot läuft (ersetzen die Platzhalter bei Insights, Testimonials, Partner-Logos).
5. **Datenschutz prüfen:** Die Erklärung ist auf den aktuellen Stand der Seite zugeschnitten (Google Fonts, Kontaktformular, keine Tracker). **Sobald** du Analyse-/Marketing-Tools (z. B. Google Analytics, Meta Pixel, Hotjar) oder Cookies ergänzt, müssen die entsprechenden Abschnitte ergänzt werden. Im Zweifel rechtlich prüfen lassen.
6. **E-Mail-Adresse vereinheitlichen:** Impressum/Datenschutz nutzen `info@smy-concierge.de` (wie auf smyagency.de), die Kontaktseite/Footer nutzen `info.smyagency@gmail.com`. Bei Bedarf auf eine Adresse festlegen.

## Formular aktivieren

Das Kontaktformular ist aktuell eine Demo (zeigt nur einen Hinweis). Zum echten Versand drei einfache Optionen:

- **Formspree** (am schnellsten): Konto anlegen, `<form>`-Tag in `kontakt/index.html` auf `action="https://formspree.io/f/DEIN-CODE" method="POST"` setzen, das `onsubmit` entfernen.
- **Web3Forms:** kostenlos, ähnliches Prinzip mit Access-Key.
- Oder über deine SMY-Agency-Infrastruktur an ein CRM/E-Mail anbinden.

## Hinweis zu Preisen

Bewusst **keine** konkreten Preise auf der Website – die internen Kalkulationszahlen aus dem Geschäftsmodell sind ungeprüfte Annahmen. Stattdessen Wertargument + CTA „individuelles Angebot". Erst mit realer Kalkulation ggf. „ab"-Preise ergänzen.
