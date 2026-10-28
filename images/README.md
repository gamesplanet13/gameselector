# Games Planet local cover artwork

These JPEG contact sheets contain the cover images used by the game selectors. Each tile is 160 × 224 pixels, arranged in an 8 × 8 grid. `cover-catalog.js` maps the exact catalog name to its sheet and tile coordinates. Artwork is served only from this folder; external sources are listed solely for provenance in `artwork-sources.json` and are never contacted by the preview code.

The preview appears only after a game is successfully selected, stays visible for 2 seconds after loading, and never changes the selected list. Unknown or failed images show an explicit unavailable message. `missing-covers.json` lists entries needing a verified cover.

The service worker saves selector pages and these assets for offline revisits after one complete online visit. Sending lists through WhatsApp/email and other online services still needs connectivity. Game artwork belongs to its respective publishers.
