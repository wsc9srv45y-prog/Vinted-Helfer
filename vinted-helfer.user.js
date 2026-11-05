// ==UserScript==
// @name         Vinted-Helfer: Formular ausfüllen
// @namespace    https://wsc9srv45y-prog.github.io/Vinted-Helfer/
// @version      1.0.0
// @description  Füllt das Vinted-Verkaufsformular mit einer Anzeige aus dem Vinted-Helfer (Fotos, Titel, Beschreibung, Preis, Marke).
// @match        https://www.vinted.de/*
// @match        https://www.vinted.at/*
// @match        https://www.vinted.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// @updateURL    https://wsc9srv45y-prog.github.io/Vinted-Helfer/vinted-helfer.user.js
// @downloadURL  https://wsc9srv45y-prog.github.io/Vinted-Helfer/vinted-helfer.user.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.__vintedHelfer) return;
  window.__vintedHelfer = true;

  const VERSION = '1.0.0';
  const isSellPage = () => /\/items\/(new|[^/]+\/edit)/.test(location.pathname) || /\/sell\b/.test(location.pathname);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtPrice = p => (p === '' || p == null || isNaN(p)) ? '' : (Number.isInteger(+p) ? String(+p) : (+p).toFixed(2).replace('.', ','));

  let host = null, ui = null, data = null, chosen = null;

  /* ---------- Oberfläche (Shadow DOM, damit Vinted-CSS nicht reinfunkt) ---------- */
  function build() {
    host = document.createElement('div');
    host.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;';
    document.documentElement.appendChild(host);
    const sh = host.attachShadow({ mode: 'open' });
    sh.innerHTML = `<style>
      *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
      .fab{border:0;background:#2f6f5e;color:#fff;font-weight:700;font-size:14px;padding:12px 16px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer}
      .panel{position:absolute;right:0;bottom:56px;width:340px;max-height:78vh;overflow:auto;background:#fff;color:#1f2421;border:1px solid #e4e2dc;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.25);padding:14px;font-size:14px;line-height:1.4}
      .panel[hidden]{display:none}
      h3{margin:0 0 8px;font-size:16px}
      .hint{color:#6b716d;font-size:12.5px;margin:4px 0 10px}
      .btn{display:inline-block;border:1px solid #e4e2dc;background:#fff;color:#1f2421;font-weight:600;font-size:13.5px;padding:9px 12px;border-radius:10px;cursor:pointer}
      .btn.p{background:#2f6f5e;border-color:#2f6f5e;color:#fff}
      .btn:disabled{opacity:.5}
      .row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
      .it{display:flex;gap:8px;align-items:center;padding:7px;border:1px solid #e4e2dc;border-radius:10px;margin-top:6px;cursor:pointer}
      .it.on{border-color:#2f6f5e;background:#e6f0ec}
      .it img{width:38px;height:50px;object-fit:cover;border-radius:6px;background:#eee;flex:none}
      .it .t{font-weight:600;font-size:13px;line-height:1.25}
      .it .m{font-size:12px;color:#6b716d}
      .log{margin-top:10px;font-size:13px}
      .log div{padding:2px 0}
      .ok{color:#2f6f5e}.bad{color:#b3261e}.mid{color:#7a5200}
      table{width:100%;border-collapse:collapse;margin-top:6px;font-size:13px}
      td{padding:5px 0;border-top:1px solid #eee;vertical-align:top}
      td:first-child{color:#6b716d;width:30%}
      td:last-child{text-align:right;width:70px}
      .cp{border:1px solid #e4e2dc;background:#fff;color:#2f6f5e;font-size:12px;font-weight:600;border-radius:8px;padding:2px 8px;cursor:pointer}
      textarea{width:100%;height:110px;font:12px ui-monospace,monospace;margin-top:6px}
      .x{float:right;border:0;background:none;font-size:18px;cursor:pointer;color:#6b716d}
    </style>
    <div class="panel" hidden></div>
    <button class="fab">🧺 Vinted-Helfer</button>`;
    ui = { panel: sh.querySelector('.panel'), fab: sh.querySelector('.fab'), root: sh };
    ui.fab.onclick = () => { ui.panel.hidden = !ui.panel.hidden; if (!ui.panel.hidden) render(); };
  }
  function ensure() {
    if (isSellPage()) { if (!host) build(); host.style.display = 'block'; }
    else if (host) { host.style.display = 'none'; }
  }
  setInterval(ensure, 1000); ensure();

  function render(logHtml = '') {
    const p = ui.panel;
    const list = data ? data.items : [];
    p.innerHTML = `<button class="x" data-a="close">×</button><h3>Vinted-Helfer</h3>
      ${!data ? `<p class="hint">Wähle die Datei, die du vom iPhone per AirDrop bekommen hast (liegt meist unter „Downloads“).</p>` : ''}
      <label class="btn ${data ? '' : 'p'}">📂 ${data ? 'Andere Datei' : 'Datei wählen'}<input type="file" accept=".json,application/json" hidden></label>
      ${list.length > 1 ? `<p class="hint" style="margin-top:12px">Welches Teil soll rein?</p>` : ''}
      ${list.map((it, i) => `<div class="it ${chosen === i ? 'on' : ''}" data-i="${i}">
          ${coverOf(it) ? `<img src="${coverOf(it)}">` : '<img>'}
          <div><div class="t">${esc(it.listing?.titel || '(ohne Titel)')}</div><div class="m">${fmtPrice(it.listing?.preis)} € · ${esc(it.status || '')}</div></div></div>`).join('')}
      ${chosen != null ? `<div class="row"><button class="btn p" data-a="fill">✍️ Formular ausfüllen</button><button class="btn" data-a="dl">Fotos herunterladen</button></div>` : ''}
      <div class="log">${logHtml}</div>
      ${chosen != null ? restTable(list[chosen]) : ''}
      <div class="row" style="margin-top:14px"><button class="btn" data-a="diag" title="Falls etwas nicht klappt: Infos fürs Nachbessern">🔧 Diagnose kopieren</button></div>
      <p class="hint" style="margin:8px 0 0">v${VERSION} · Es wird nichts veröffentlicht – das „Hochladen“ klickst du selbst.</p>`;
    p.querySelector('input[type=file]').onchange = onFile;
    p.querySelectorAll('[data-i]').forEach(d => d.onclick = () => { chosen = +d.dataset.i; render(); });
    p.querySelectorAll('[data-cp]').forEach(b => b.onclick = () => copy(b.dataset.cp, b));
    p.onclick = e => {
      const a = e.target.closest('[data-a]')?.dataset.a;
      if (a === 'close') ui.panel.hidden = true;
      if (a === 'fill') fill(list[chosen]);
      if (a === 'dl') downloadPhotos(list[chosen]);
      if (a === 'diag') diagnose();
    };
  }
  function restTable(it) {
    const L = it.listing || {};
    const rows = [['Titel', L.titel], ['Preis', fmtPrice(L.preis)], ['Kategorie', L.kategorie], ['Marke', L.marke], ['Größe', L.groesse], ['Zustand', L.zustand], ['Farbe', L.farbe], ['Material', L.material]].filter(r => r[1]);
    return `<p class="hint" style="margin:12px 0 0"><b>Zum Auswählen auf Vinted:</b></p><table>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${esc(v)}</td><td><button class="cp" data-cp="${esc(v)}">Kopieren</button></td></tr>`).join('')}</table>`;
  }
  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (_) { } t.remove();
    }
    if (btn) { const o = btn.textContent; btn.textContent = '✓'; setTimeout(() => btn.textContent = o, 1200); }
  }

  /* ---------- Datei lesen ---------- */
  const coverOf = it => (it.useGen !== false && it.generated?.length) ? it.generated[it.selectedGen || 0] || it.generated[0] : (it.photos || [])[0];
  function photosOf(it) {
    const gen = (it.useGen !== false && it.generated?.length) ? [it.generated[it.selectedGen || 0] || it.generated[0]] : [];
    return gen.concat(it.photos || []).filter(Boolean);
  }
  async function onFile(e) {
    const f = e.target.files[0]; if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (d?.format !== 'vinted-helfer' || !Array.isArray(d.items) || !d.items.length) throw new Error('keine Vinted-Helfer-Datei');
      // Bereite/Entwürfe zuerst
      const order = { bereit: 0, entwurf: 1, online: 2, verkauft: 3 };
      d.items.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
      data = d; chosen = d.items.length === 1 ? 0 : null; render();
    } catch (err) { render(`<div class="bad">✗ Datei geht nicht: ${esc(err.message)}</div>`); }
  }
  function dataURLToFile(u, name) {
    const i = u.indexOf(','); const type = (u.slice(0, i).match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
    const bin = atob(u.slice(i + 1)); const a = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) a[j] = bin.charCodeAt(j);
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
    return new File([a], `${name}.${ext}`, { type });
  }
  function downloadPhotos(it) {
    photosOf(it).forEach((u, i) => { const f = dataURLToFile(u, `vinted-foto-${i + 1}`); const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); });
  }

  /* ---------- Felder finden ---------- */
  const SKIP_TYPES = ['hidden', 'file', 'checkbox', 'radio', 'submit', 'button', 'image', 'reset'];
  const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const attrs = el => [el.id, el.name, el.getAttribute('data-testid'), el.getAttribute('aria-label'), el.placeholder, el.getAttribute('autocomplete')].filter(Boolean).join(' ').toLowerCase();
  function labelText(el) {
    let t = '';
    if (el.id) { const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) t += ' ' + l.textContent; }
    const lb = el.getAttribute('aria-labelledby'); if (lb) lb.split(/\s+/).forEach(id => { const n = document.getElementById(id); if (n) t += ' ' + n.textContent; });
    const wrap = el.closest('label'); if (wrap) t += ' ' + wrap.textContent;
    // nächste Überschrift/Label im selben Block
    let p = el.parentElement;
    for (let i = 0; i < 4 && p && t.trim().length === 0; i++, p = p.parentElement) {
      const l = p.querySelector('label, [class*="label" i], [class*="title" i]'); if (l && !l.contains(el)) t += ' ' + l.textContent;
    }
    return t.toLowerCase();
  }
  function findField(keys, labels, selector = 'input, textarea') {
    const cands = [...document.querySelectorAll(selector)].filter(e => !SKIP_TYPES.includes((e.type || '').toLowerCase()) && !e.disabled && !e.readOnly && visible(e));
    for (const k of keys) { const f = cands.find(e => attrs(e).split(/[\s\-_.]+|(?=[A-Z])/).some(w => w === k) || attrs(e).includes(k)); if (f) return f; }
    for (const l of labels) { const f = cands.find(e => labelText(e).includes(l)); if (f) return f; }
    return null;
  }
  function setValue(el, val) {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    el.focus();
    setter.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }
  async function setPhotos(it) {
    const files = photosOf(it).map((u, i) => dataURLToFile(u, `vinted-foto-${i + 1}`));
    if (!files.length) return 'keine';
    const inputs = [...document.querySelectorAll('input[type=file]')].filter(i => !i.accept || /image|jpe?g|png|heic/i.test(i.accept));
    const inp = inputs[0];
    if (inp) {
      if (inp.multiple || files.length === 1) {
        const dt = new DataTransfer(); files.forEach(f => dt.items.add(f));
        inp.files = dt.files; inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        for (const f of files) {
          const cur = [...document.querySelectorAll('input[type=file]')].filter(i => !i.accept || /image/i.test(i.accept))[0] || inp;
          const dt = new DataTransfer(); dt.items.add(f); cur.files = dt.files; cur.dispatchEvent(new Event('change', { bubbles: true }));
          await sleep(1500);
        }
      }
      return `${files.length} über Upload-Feld`;
    }
    // Fallback: Drop auf die Foto-Fläche simulieren
    const zone = [...document.querySelectorAll('div, section, label, button')].filter(e => /foto|photo/i.test(e.textContent || '') && visible(e) && e.offsetHeight > 60 && e.offsetHeight < 700).pop();
    if (zone) {
      const dt = new DataTransfer(); files.forEach(f => dt.items.add(f));
      for (const t of ['dragenter', 'dragover', 'drop']) zone.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, dataTransfer: dt }));
      return `${files.length} per Drag & Drop`;
    }
    return null;
  }

  /* ---------- Ausfüllen ---------- */
  async function fill(it) {
    const L = it.listing || {}; const log = [];
    const line = (ok, txt) => log.push(`<div class="${ok === true ? 'ok' : ok === false ? 'bad' : 'mid'}">${ok === true ? '✓' : ok === false ? '✗' : '•'} ${txt}</div>`);
    render('<div class="mid">• Fülle aus…</div>');

    try {
      const ph = await setPhotos(it);
      ph ? line(true, `Fotos: ${ph} – kurz warten, bis Vinted sie hochgeladen hat`) : line(false, 'Foto-Feld nicht gefunden → „Fotos herunterladen“ und reinziehen');
    } catch (e) { line(false, 'Fotos: ' + esc(e.message)); }
    await sleep(800);

    const fields = [
      ['Titel', L.titel, ['title', 'titel'], ['titel', 'title']],
      ['Beschreibung', L.beschreibung, ['description', 'beschreibung'], ['beschreib', 'description'], 'textarea, input'],
      ['Preis', fmtPrice(L.preis), ['price', 'preis'], ['preis', 'price']]
    ];
    for (const [name, val, keys, labels, sel] of fields) {
      if (!val) { line(null, `${name}: leer in der Datei`); continue; }
      const el = findField(keys, labels, sel);
      if (el) { setValue(el, val); line(true, name); } else line(false, `${name}: Feld nicht gefunden → unten kopieren`);
      await sleep(250);
    }
    if (L.marke) {
      const el = findField(['brand', 'marke'], ['marke', 'brand']);
      if (el) { setValue(el, L.marke); line(null, `Marke „${esc(L.marke)}“ eingetippt – bitte den passenden Vorschlag anklicken`); }
      else line(null, 'Marke: bitte selbst auswählen');
    }
    line(null, '<b>Noch selbst wählen:</b> Kategorie, Größe, Zustand (und ggf. Farbe, Material) – Werte stehen unten');
    line(null, 'Alles checken, dann auf Vinted „Hochladen“ klicken');
    render(log.join(''));
  }

  /* ---------- Diagnose ---------- */
  function diagnose() {
    const pick = e => ({ tag: e.tagName.toLowerCase(), type: e.type || '', id: e.id || '', name: e.name || '', testid: e.getAttribute('data-testid') || '', ph: e.placeholder || '', aria: e.getAttribute('aria-label') || '', label: labelText(e).trim().slice(0, 60), multiple: !!e.multiple, accept: e.accept || '', vis: visible(e) });
    const info = {
      helfer: VERSION, url: location.pathname, ua: navigator.userAgent,
      fields: [...document.querySelectorAll('input, textarea, select')].map(pick),
      buttons: [...document.querySelectorAll('button, [role=button]')].filter(visible).map(b => ({ t: (b.textContent || '').trim().slice(0, 40), testid: b.getAttribute('data-testid') || '' })).filter(b => b.t || b.testid).slice(0, 60)
    };
    const txt = JSON.stringify(info, null, 1);
    copy(txt);
    render(`<div class="ok">✓ Diagnose kopiert – einfach Claude in den Chat einfügen.</div><textarea readonly>${esc(txt)}</textarea>`);
  }
})();
