# Vinted-Helfer

Kleine Web-App für uns privat: Fotos von einem Kleidungsstück rein, kurze Notiz (getippt oder als Sprachnachricht) dazu. Die KI schreibt die Anzeige und macht aus dem Foto ein sauberes Flatlay-Bild. Beides siehst du in einer Vorschau, gibst es frei und lädst es auf Vinted hoch.

Alles läuft direkt im Browser über unseren OpenAI-API-Key. Es gibt keinen eigenen Server, und die Daten bleiben auf dem jeweiligen Gerät.

---

## Einrichtung (einmalig, ca. 15 Minuten)

### 1. OpenAI-API-Key holen
1. Auf **platform.openai.com** mit dem normalen OpenAI-Login anmelden. Das ist ein anderer Bereich als ChatGPT, das Pro-Abo zählt da nicht mit.
2. **Settings → Billing**: Guthaben aufladen, 10–20 $ reichen für ein paar hundert Teile.
3. **Settings → Limits**: Ein monatliches Ausgabenlimit setzen, z. B. 20 $.
4. **API keys → Create new secret key**, Name z. B. „Vinted-Helfer“. Den Key (`sk-…`) kopieren und gut aufheben.
5. Falls beim ersten Bild ein Fehler wegen „Verifizierung“ kommt: **Settings → Organization → Verify**. OpenAI verlangt das bei manchen Bildmodellen.

### 2. GitHub Pages einschalten
Die Dateien liegen schon im Repo `wsc9srv45y-prog/Vinted-Helfer`, Claude pflegt sie direkt dort.

1. **Wichtig:** Das Repo ist privat. Mit einem kostenlosen GitHub-Konto geht Pages aber nur bei **öffentlichen** Repos. Zwei Wege:
   - **Repo auf Public stellen** (empfohlen): Settings → General → ganz unten „Danger Zone“ → *Change visibility* → Public. Das ist unkritisch, weil im Code kein Key und keine Daten stecken. Der API-Key und alle Teile bleiben nur auf euren Geräten.
   - Privat lassen und GitHub Pro buchen (ca. 4 $/Monat).
2. Im Repo: **Settings → Pages → Source: „Deploy from a branch“ → Branch: `main` / Ordner `/ (root)` → Save**.
3. Nach 1–2 Minuten läuft die App unter **https://wsc9srv45y-prog.github.io/Vinted-Helfer/**

Updates kommen automatisch: Sobald Claude eine Änderung ins Repo pushed, ist sie nach ein, zwei Minuten online. Auf dem iPhone die App dann einmal schließen und neu öffnen.

### 3. Aufs iPhone holen
1. Die Adresse in **Safari** öffnen.
2. **Teilen → Zum Home-Bildschirm**. Danach läuft sie wie eine App, und Safari räumt die Daten nicht nach ein paar Wochen weg.
3. In der App auf **⚙︎** tippen und den API-Key eintragen, dann **„Verbindung testen“**.

---

## So läuft's

1. **Neu**: Fotos machen oder auswählen, am besten das ganze Teil, das Etikett und eventuelle Mängel. Das Foto mit ★ ist die Vorlage fürs KI-Bild.
2. Kurze Notiz dazu, z. B. „H&M Jeans, Gr. 38, kaum getragen, 12 €“. Das geht getippt, per 🎙-Knopf oder mit dem Diktier-Mikro der Tastatur.
3. **Anzeige erstellen**. Nach wenigen Sekunden ist der Text da, das Bild braucht 30–90 Sekunden.
   Bei vielen Teilen: **„Erstellen & gleich nächstes Teil“**. Dann läuft alles im Hintergrund, die App aber offen lassen.
4. **Vorschau checken**: Bild mit dem Original vergleichen (Farbe, Muster, Logo) und Texte bei Bedarf direkt anpassen. Wenn's nicht passt, „Neues KI-Bild“ mit Änderungswunsch.
5. **Freigeben**, dann kommt die Hochlade-Hilfe:
   - **Fotos sichern**: landen über das Teilen-Menü in der Mediathek.
   - Titel und Beschreibung kopieren und in der Vinted-App einfügen.
   - Kategorie, Größe, Zustand und Preis stehen in der App zum Abschreiben bzw. Kopieren.
6. **Ist online ✓**, und später **Verkauft ✓** mit dem echten Preis.

In der **Liste** seht ihr alle Teile und wie viel ihr dieses Jahr verkauft habt. Ab 30 Verkäufen oder 2.000 € im Jahr meldet Vinted euch ans Finanzamt. Private Gebrauchtkleidung bleibt trotzdem steuerfrei, und die CSV-Liste ist euer Nachweis.

## Kosten (ca.)
- Text pro Teil: ~0,01 $
- KI-Bild in mittlerer Qualität, Hochformat: ~0,07 $
- Sprachnotiz: < 0,01 $

Die echten Zahlen stehen auf platform.openai.com unter **Usage**.

## Gut zu wissen
- **Daten bleiben pro Gerät.** Was am iPhone angelegt wurde, sieht man am Laptop nicht. Am einfachsten macht ihr alles am iPhone und ladet über die Vinted-App hoch.
- **Originalfotos bleiben in der Anzeige.** Das KI-Bild ist nur das Titelbild. So sehen Käufer das echte Teil, und es gibt keinen Ärger mit „Artikel entspricht nicht der Beschreibung“.
- Wenn OpenAI neue Modelle rausbringt, lassen sie sich unter ⚙︎ → Modelle umstellen.

## Nächste Ausbaustufen (Ideen)
- Upload-Helfer für Safari am Mac, der das Vinted-Formular automatisch ausfüllt
- Sync zwischen iPhone und Laptop
- Weitere Plattformen (z. B. Kleinanzeigen)
