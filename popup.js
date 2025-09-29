// =============================
// 📂 ECS:R Pro - popup.js
// =============================

// 🔹 Guardar fondo desde archivo
document.getElementById("saveBg").addEventListener("click", () => {
  const fileInput = document.getElementById("bgFile");
  
  if (!fileInput.files.length) {
    alert("❌ Selecciona un archivo primero");
    return;
  }
  
  const file = fileInput.files[0];
  const maxSize = 3 * 1024 * 1024; // 3MB límite
  
  // Validar tamaño
  if (file.size > maxSize) {
    alert("❌ El archivo es muy grande (máx 3MB). Usa un GIF/imagen más pequeña o un enlace URL.");
    return;
  }
  
  // Validar tipo de archivo
  const validTypes = ["image/gif", "image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"];
  if (!validTypes.includes(file.type)) {
    alert("❌ Tipo de archivo no soportado. Usa: GIF, PNG, JPG, WebP, MP4 o WebM");
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const fileData = e.target.result;
    
    // Verificar tamaño de la data URL (chrome.storage.sync tiene límite de 8KB por item)
    const dataSize = new Blob([fileData]).size;
    
    if (dataSize > 102400) { // 100KB (limite seguro para sync)
      alert("⚠️ Advertencia: El archivo es grande. Considera usar chrome.storage.local o una URL externa.");
      
      // Guardar en local storage (sin límite de 8KB)
      chrome.storage.local.set({ background: fileData }, () => {
        alert("✅ Fondo guardado en almacenamiento local (recarga ECSR)");
        console.log("📦 Tipo detectado:", file.type);
        console.log("📏 Tamaño:", (file.size / 1024).toFixed(2), "KB");
      });
    } else {
      // Guardar en sync storage (sincroniza entre dispositivos)
      chrome.storage.sync.set({ background: fileData }, () => {
        alert("✅ Fondo guardado y sincronizado (recarga ECSR)");
        console.log("📦 Tipo detectado:", file.type);
        console.log("📏 Tamaño:", (file.size / 1024).toFixed(2), "KB");
      });
    }
  };
  
  reader.onerror = function() {
    alert("❌ Error al leer el archivo");
  };
  
  reader.readAsDataURL(file);
});

// 🔹 Quitar fondo
document.getElementById("removeBg").addEventListener("click", () => {
  // Eliminar de ambos storages
  chrome.storage.sync.remove("background", () => {
    chrome.storage.local.remove("background", () => {
      alert("❌ Fondo eliminado (recarga ECSR para ver cambios)");
    });
  });
});

// 🔹 Guardar Discord y enviarlo a webhook
document.getElementById("saveDiscord").addEventListener("click", () => {
  const discord = document.getElementById("discordInput").value;
  
  if (!discord.trim()) {
    alert("❌ Escribe tu Discord primero");
    return;
  }
  
  chrome.storage.sync.set({ discord: discord }, () => {
    alert("✅ Tu Discord se guardó");
    
    // Detectar pestaña actual
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      const match = url.match(/\/users\/(\d+)\/profile/);
      let userId = "Desconocido";
      if (match) userId = match[1];
      
      // Enviar al webhook de Discord (reemplaza TU_WEBHOOK)
      const webhookURL = "https://discord.com/api/webhooks/TU_WEBHOOK";
      
      fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📌 **Nuevo registro ECS:R Pro**\n👤 User ID: \`${userId}\`\n💬 Discord: \`${discord}\``
        })
      }).catch(err => {
        console.error("Error al enviar webhook:", err);
      });
    });
  });
});

// 🔹 Mostrar estado actual al abrir popup
window.addEventListener("DOMContentLoaded", () => {
  // Mostrar si hay fondo guardado
  chrome.storage.sync.get("background", (data) => {
    if (data.background) {
      console.log("✅ Fondo encontrado en sync storage");
    } else {
      chrome.storage.local.get("background", (localData) => {
        if (localData.background) {
          console.log("✅ Fondo encontrado en local storage");
        } else {
          console.log("ℹ️ No hay fondo guardado");
        }
      });
    }
  });
  
  // Mostrar Discord guardado
  chrome.storage.sync.get("discord", (data) => {
    if (data.discord) {
      document.getElementById("discordInput").value = data.discord;
      console.log("✅ Discord cargado:", data.discord);
    }
  });
});
