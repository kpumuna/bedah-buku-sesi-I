// Small fetch helpers shared by every page. Depends on config.js (API_BASE).

async function apiGet(path) {
  let res;
  try {
    res = await fetch(API_BASE + path);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error("Tidak dapat menghubungi server. Pastikan backend sedang berjalan.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
  return data;
}
