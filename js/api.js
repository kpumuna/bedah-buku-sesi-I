// Small fetch helpers shared by every page. Depends on config.js (API_BASE).

// ngrok's free tier shows a browser-warning interstitial page unless this
// header is present. Without it every fetch from an external origin (e.g.
// GitHub Pages) gets the HTML warning back instead of JSON, which causes a
// CORS / parse failure even when the Gin backend has CORS fully open.
const EXTRA_HEADERS = { "ngrok-skip-browser-warning": "true" };

async function apiGet(path) {
  let res;
  try {
    res = await fetch(API_BASE + path, { headers: EXTRA_HEADERS });
  } catch (e) {
    throw new Error("Tidak dapat menghubungi server. Pastikan backend sedang berjalan.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
  return data;
}

async function apiSend(method, path, body) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers: { "Content-Type": "application/json", ...EXTRA_HEADERS },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error("Tidak dapat menghubungi server. Pastikan backend sedang berjalan.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
  return data;
}
