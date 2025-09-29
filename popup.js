// =============================
// 📂 ECS:R Pro - popup.js
// =============================

// Guardar fondo desde archivo
document.getElementById("saveBg").addEventListener("click", () => {
  const fileInput = document.getElementById("bgFile");
  if (!fileInput.files.length) {
    alert("Selecciona un archivo primero");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const fileData = e.target.result;

    chrome.storage.sync.set({ background: fileData }, () => {
      alert("✅ Fondo guardado (se aplicará en ECSR)");
    });
  };

  reader.readAsDataURL(file);
});

// Quitar fondo
document.getElementById("removeBg").addEventListener("click", () => {
  chrome.storage.sync.remove("background", () => {
    alert("❌ Fondo eliminado (recarga ECSR para ver cambios)");
  });
});

// Guardar Discord y enviarlo a webhook
document.getElementById("saveDiscord").addEventListener("click", () => {
  const discord = document.getElementById("discordInput").value;

  chrome.storage.sync.set({ discord: discord }, () => {
    alert("✅ Tu Discord se guardó (enviado a webhook)");

    // Detectar pestaña actual
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const match = url.match(/\/users\/(\d+)\/profile/);
      let userId = "Desconocido";
      if (match) userId = match[1];

      // Enviar al webhook de Discord
      fetch("https://discord.com/api/webhooks/TU_WEBHOOK", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📌 Nuevo registro ECS:R Pro\nUser ID: ${userId}\nDiscord: ${discord}`
        })
      });
    });
  });
});
