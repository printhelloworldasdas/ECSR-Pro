// =============================
// 📂 ECS:R Pro - content.js
// =============================

// 🔹 Crear contenedor del fondo si no existe
let bgContainer = document.getElementById("ecsr-pro-bg");
if (!bgContainer) {
  bgContainer = document.createElement("div");
  bgContainer.id = "ecsr-pro-bg";
  bgContainer.style.position = "fixed";
  bgContainer.style.top = "0";
  bgContainer.style.left = "0";
  bgContainer.style.width = "100%";
  bgContainer.style.height = "100%";
  bgContainer.style.zIndex = "-9999"; // detrás de todo
  bgContainer.style.pointerEvents = "none";
  bgContainer.style.overflow = "hidden";
  document.body.prepend(bgContainer);
}

// 🔹 Función para aplicar fondo
function applyBackground(bgData) {
  if (!bgData) return;

  // Limpiar fondo anterior
  bgContainer.innerHTML = "";
  bgContainer.style.backgroundImage = "";
  bgContainer.style.backgroundSize = "";
  bgContainer.style.backgroundPosition = "";

  if (bgData.startsWith("data:video")) {
    const video = document.createElement("video");
    video.src = bgData;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    bgContainer.appendChild(video);
  } else if (bgData.startsWith("data:image")) {
    bgContainer.style.backgroundImage = `url(${bgData})`;
    bgContainer.style.backgroundSize = "cover";
    bgContainer.style.backgroundPosition = "center";
    bgContainer.style.backgroundRepeat = "no-repeat";
  }
}

// 🔹 Aplicar fondo inicial
chrome.storage.sync.get("background", (data) => {
  applyBackground(data.background);
});

// 🔹 Escuchar cambios en tiempo real
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.background) {
    applyBackground(changes.background.newValue);
  }
});

// 🔹 Extraer userId de la URL
const match = window.location.pathname.match(/\/users\/(\d+)\/profile/);
let currentUserId = null;
if (match) currentUserId = match[1];

// 🔹 Mostrar Discord en perfiles desde JSON de GitHub como embed
if (currentUserId) {
  fetch("https://raw.githubusercontent.com/printhelloworldasdas/ECSR-Pro/refs/heads/main/ecsr-discords.json")
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar JSON de Discords");
      return res.json();
    })
    .then(data => {
      const user = data.users.find(u => u.id === currentUserId);
      if (user) {
        const embed = document.createElement("div");
        embed.style.cssText = `
          background: #2f3136;
          color: #ffffff;
          border-left: 4px solid #7289da;
          padding: 12px;
          margin-top: 12px;
          border-radius: 6px;
          font-weight: 500;
          max-width: 300px;
        `;
        embed.innerHTML = `
          <strong>Discord:</strong> <span style="color:#7289da">${user.discord}</span>
        `;
        let parent = document.querySelector(".profile-header");
        if (!parent) parent = document.body;
        parent.appendChild(embed);
      }
    })
    .catch(err => console.error("ECS:R Pro - error al cargar Discords JSON:", err));
}

// 🔹 Cambiar todos los botones a color rojo
const style = document.createElement("style");
style.textContent = `
  button, .btn-0-2-138, .buyButton-0-2-132 {
    background-color: #ff0000 !important;
    border-color: #ff0000 !important;
    color: #fff !important;
  }
`;
document.head.appendChild(style);

// 🔹 currentUserId disponible para webhook o JSON
console.log("ECS:R Pro - Current user ID:", currentUserId);
