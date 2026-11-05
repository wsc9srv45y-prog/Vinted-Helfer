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
5. **Freigeben**, dann gibt's zwei Wege zum Hochladen:
   - **📱 Am iPhone:** „Fotos sichern“ → im Teilen-Menü „Bilder sichern“. Die Fotos liegen dann in der Fotos-App unter „Zuletzt“. Titel und Beschreibung kopieren und in der Vinted-App einfügen. Kategorie, Größe, Zustand und Preis stehen unter „Texte“.
   - **💻 Am Mac:** „Zum Mac schicken (AirDrop)“, dann landet die Datei am Mac unter „Downloads“. In Safari auf vinted.de „Artikel verkaufen“ öffnen, unten rechts auf **„Vinted-Helfer“** klicken, Datei wählen und **„Formular ausfüllen“**. Fotos, Titel, Beschreibung, Preis und Marke werden eingetragen. Kategorie, Größe und Zustand klickt ihr noch selbst an, der Helfer zeigt die Werte dazu.
6. **Ist online ✓**, und später **Verkauft ✓** mit dem echten Preis.

**Wo ist was gespeichert?** Alles liegt in der App auf dem jeweiligen Gerät, ihr findet es unter **„Liste“**. Es gibt keine Cloud. Exportiert werden nur die Dinge, die ihr selbst teilt (Fotos, Datei, CSV).

In der **Liste** seht ihr alle Teile und wie viel ihr dieses Jahr verkauft habt. Ab 30 Verkäufen oder 2.000 € im Jahr meldet Vinted euch ans Finanzamt. Private Gebrauchtkleidung bleibt trotzdem steuerfrei, und die CSV-Liste ist euer Nachweis.

## Kosten (ca.)
- Text pro Teil: ~0,01 $
- KI-Bild in mittlerer Qualität, Hochformat: ~0,07 $
- Sprachnotiz: < 0,01 $

Die echten Zahlen stehen auf platform.openai.com unter **Usage**.

## Ausfüll-Helfer für Safari am Mac einrichten (einmalig)
1. Am Mac im App Store die kostenlose App **„Userscripts“** (von Justin Wasack) laden und einmal öffnen.
2. **Safari → Einstellungen → Erweiterungen → Userscripts** anhaken und bei „Website-Zugriff“ vinted.de erlauben (oder „Immer auf allen Websites erlauben“).
3. In Safari **https://wsc9srv45y-prog.github.io/Vinted-Helfer/vinted-helfer.user.js** öffnen, aufs Userscripts-Symbol in der Safari-Leiste klicken und **„Install“** wählen.
   - Falls kein „Install“ kommt: Userscripts-Symbol → „Open Extension Page“ → **+ → New JS**, den ganzen Text der Seite reinkopieren und speichern.
4. Auf vinted.de → **„Artikel verkaufen“** erscheint jetzt unten rechts der Knopf **„🧺 Vinted-Helfer“**.

Es wird nichts automatisch veröffentlicht, das „Hochladen“ auf Vinted klickt ihr immer selbst. Falls etwas nicht richtig ausgefüllt wird: Im Helfer auf **„🔧 Diagnose kopieren“** klicken und den Text an Claude schicken. Damit lässt sich der Helfer an das echte Vinted-Formular anpassen.

## Zwischen iPhone und Mac austauschen
Unter **Liste → Exportieren** könnt ihr alle Teile oder nur einen Filter (z. B. „Bereit“) als Datei exportieren und per AirDrop schicken. Auf dem anderen Gerät importiert ihr sie unter **Liste → Importieren**. Schon vorhandene Teile werden nur ersetzt, wenn die Datei neuer ist. Das taugt auch als Backup.

## Gut zu wissen
- **Daten bleiben pro Gerät.** Rüber geht's per Export/AirDrop (siehe oben).
- **Originalfotos bleiben in der Anzeige.** Das KI-Bild ist nur das Titelbild. So sehen Käufer das echte Teil, und es gibt keinen Ärger mit „Artikel entspricht nicht der Beschreibung“.
- Wenn OpenAI neue Modelle rausbringt, lassen sie sich unter ⚙︎ → Modelle umstellen.

## Nächste Ausbaustufen (Ideen)
- Ausfüll-Helfer an das echte Vinted-Formular anpassen (nach dem ersten Test mit der Diagnose)
- Automatischer Sync über eine Cloud-Datenbank statt AirDrop
- Weitere Plattformen (z. B. Kleinanzeigen)
