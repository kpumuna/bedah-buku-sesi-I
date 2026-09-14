// Shared certificate rendering + download logic, used by presensi.html,
// edit.html, and sertifikat.html. Depends on config.js (API_BASE).
// Requires jsPDF to be loaded on the page for downloadCertPdf to work.

function loadImageViaFetch(url) {
  return new Promise(async (resolve, reject) => {
    try {
      // EXTRA_HEADERS is defined in api.js (ngrok-skip-browser-warning).
      // Without it the image fetch hits ngrok's HTML interstitial and the
      // browser blocks it as a CORS failure even though the server allows *.
      const res = await fetch(url, { mode: "cors", headers: EXTRA_HEADERS });
      if (!res.ok) throw new Error("Gagal memuat gambar template sertifikat.");
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Gagal memuat gambar template sertifikat."));
      img.src = objUrl;
    } catch (e) {
      reject(e);
    }
  });
}

// Draws the certificate (template image + nama + certNo) onto the given
// canvas element, per the sertifikat API response shape.
async function renderCertificateToCanvas(data, canvas) {
  const img = await loadImageViaFetch(API_BASE + data.template.imageUrl);
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const color = data.template.textColor === "light" ? "#FFFFFF" : "#20241F";
  const scale = canvas.width / 1000;
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.font = `700 ${data.template.nameSize * scale}px Georgia, 'Times New Roman', serif`;
  ctx.fillText(data.nama, canvas.width / 2, canvas.height * (data.template.nameY / 100));
  ctx.font = `italic ${data.template.certSize * scale}px Georgia, 'Times New Roman', serif`;
  ctx.fillText("No. " + data.certNo, canvas.width / 2, canvas.height * (data.template.certY / 100));
}

function safeFileName(n) {
  return n.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
}

// Fire-and-forget: records a download for the Statistik tab in the admin
// panel. Never blocks or fails the actual download on the visitor's end.
function logCertDownload(email, type) {
  apiSend("POST", "/api/sertifikat/" + encodeURIComponent(email) + "/download", { type }).catch(() => {});
}

function downloadCertJpg(canvas, nama, email) {
  const link = document.createElement("a");
  link.download = `sertifikat_${safeFileName(nama)}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
  logCertDownload(email, "jpg");
}

function downloadCertPdf(canvas, nama, email) {
  const img = canvas.toDataURL("image/jpeg", 0.95);
  const { jsPDF } = window.jspdf;
  const isLandscape = canvas.width >= canvas.height;
  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  doc.addImage(img, "JPEG", 0, 0, canvas.width, canvas.height);
  doc.save(`sertifikat_${safeFileName(nama)}.pdf`);
  logCertDownload(email, "pdf");
}
