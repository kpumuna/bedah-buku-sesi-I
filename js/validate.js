// Shared input validation. Names/institutions: letters (incl. accented),
// spaces, and only ' . , as special characters — nothing else.
const NAME_RE = /^[\p{L}\s'.,]+$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidName(v) {
  return v.length >= 3 && NAME_RE.test(v);
}
function isValidInstansi(v) {
  return v.length >= 2 && NAME_RE.test(v);
}
function isValidEmail(v) {
  return EMAIL_RE.test(v);
}

// Live "invalid character" warning as the user types into a name/instansi field.
// Expects the field wrapper to contain an ".err-msg" element with the default
// (empty/too-short) message already in its HTML.
function watchNameLikeField(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const wrapper = input.parentElement;
  const errMsg = wrapper.querySelector(".err-msg");
  const defaultMsg = errMsg ? errMsg.textContent : "";

  input.addEventListener("input", () => {
    const v = input.value;
    const hasBadChar = v.length > 0 && !NAME_RE.test(v);
    wrapper.classList.toggle("error", hasBadChar);
    if (errMsg) {
      errMsg.textContent = hasBadChar
        ? "Karakter tidak diizinkan — hanya huruf, spasi, tanda kutip satu ('), titik (.), dan koma (,) yang diperbolehkan."
        : defaultMsg;
    }
  });
}
