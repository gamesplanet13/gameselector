(function () {
  'use strict';
  const platform = document.documentElement.dataset.coverPlatform;
  const catalog = (window.GP_COVER_CATALOG || {})[platform] || {};
  const style = document.createElement('style');
  style.textContent = `
    #gp-cover-preview{position:fixed;inset:0;z-index:50000;display:grid;place-items:center;padding:20px;background:rgba(3,9,20,.8);backdrop-filter:blur(5px);pointer-events:none}
    #gp-cover-preview[hidden]{display:none!important}
    .gp-cover-card{position:relative;width:min(280px,72vw);padding:12px;border-radius:18px;background:#121c30;color:white;box-shadow:0 20px 80px #0009;text-align:center;font-family:system-ui,sans-serif}
    .gp-cover-art{width:100%;aspect-ratio:5/7;border-radius:9px;background-color:#1e293b;background-repeat:no-repeat;background-size:800% 800%}
    .gp-cover-caption{margin:10px 2px 3px;font-size:15px;line-height:1.35;font-weight:700;overflow-wrap:anywhere}
    .gp-cover-platform{display:block;color:#a7f3d0;font-size:11px;letter-spacing:1px;margin-bottom:8px}
    .gp-cover-missing{display:grid;place-content:center;gap:12px;padding:24px;color:#cbd5e1;font-size:14px;background-image:none!important}
    .gp-cover-missing b{font-size:44px;color:#fff}
  `;
  document.head.append(style);
  const overlay = document.createElement('div');
  overlay.id = 'gp-cover-preview';
  overlay.hidden = true;
  overlay.setAttribute('aria-live', 'polite');
  overlay.setAttribute('role', 'status');
  const card = document.createElement('div'); card.className = 'gp-cover-card';
  const label = document.createElement('small'); label.className = 'gp-cover-platform'; label.textContent = platform.toUpperCase() + ' · SELECTED';
  const art = document.createElement('div'); art.className = 'gp-cover-art'; art.setAttribute('role', 'img');
  const caption = document.createElement('p'); caption.className = 'gp-cover-caption';
  card.append(label, art, caption); overlay.append(card); document.body.append(overlay);
  let timer, request = 0;
  const sheets = new Map();
  function loadSheet(path) {
    if (!sheets.has(path)) sheets.set(path, new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(path); image.onerror = reject; image.src = path;
    }));
    return sheets.get(path);
  }
  function hide() { clearTimeout(timer); request++; overlay.hidden = true; }
  async function show(name) {
    clearTimeout(timer);
    const current = ++request;
    overlay.hidden = true;
    const cover = catalog[name];
    caption.textContent = name.replace(/\.(iso|zip|rar|7z|chd)$/i, '');
    art.setAttribute('aria-label', caption.textContent + ' cover art');
    art.className = 'gp-cover-art'; art.replaceChildren();
    let available = false;
    if (cover) {
      try {
        await loadSheet(cover[0]);
        if (current !== request) return;
        art.style.backgroundImage = 'url("' + cover[0] + '")';
        art.style.backgroundPosition = (cover[1] / 7 * 100) + '% ' + (cover[2] / 7 * 100) + '%';
        available = true;
      } catch (_) { /* A failed local image never blocks game selection. */ }
    }
    if (current !== request) return;
    if (!available) {
      art.classList.add('gp-cover-missing');
      const icon = document.createElement('b'); icon.textContent = '🎮';
      const note = document.createElement('span'); note.textContent = 'Cover art unavailable';
      art.append(icon, note);
    }
    overlay.hidden = false;
    timer = setTimeout(() => { if (current === request) overlay.hidden = true; }, 2000);
  }
  window.GPCoverPreview = { show, hide };
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  // Warm only the first sheet; other local sheets are loaded on demand and cached offline.
  const first = Object.values(catalog)[0]; if (first) loadSheet(first[0]).catch(() => {});
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('cover-sw.js').catch(() => {});
  }
})();
