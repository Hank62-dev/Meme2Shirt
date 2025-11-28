// ==================== 0. GLOBAL VARIABLES ====================
// Lưu trữ dữ liệu của 2 ô drop zone
let canvasData = {
  zone1: null, // Dữ liệu ô bên trái
  zone2: null, // Dữ liệu ô bên phải
};

// Biến cache cho API Meme
let cachedMemes = null;
let currentLimit = 30;

// ==================== 1. IMGFLIP API INTEGRATION ====================
async function fetchMemesFromImgflip() {
  if (cachedMemes) return cachedMemes;

  try {
    console.log("Fetching memes from Imgflip...");
    const response = await fetch("https://api.imgflip.com/get_memes");

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (data.success && data.data.memes) {
      cachedMemes = data.data.memes;
      console.log(`Load successful ${cachedMemes.length} memes`);
      return cachedMemes;
    } else {
      throw new Error("API error");
    }
  } catch (error) {
    console.error("Error fetch memes:", error);
    return [];
  }
}

async function renderMemePanel(limit = 40) {
  const gridContainer = document.querySelector(
    "#panel-meme .grid-container-2col"
  );
  if (!gridContainer) return;

  gridContainer.innerHTML =
    '<div style="color: white; padding: 20px; text-align: center;">⏳ Đang tải memes...</div>';

  const allMemes = await fetchMemesFromImgflip();

  if (allMemes.length === 0) {
    gridContainer.innerHTML = `
      <div style="color: white; padding: 20px; text-align: center;">
        <p>Cant loaded memes</p>
        <button onclick="location.reload()" style="padding: 8px 16px; cursor: pointer;">Try again</button>
      </div>`;
    return;
  }

  gridContainer.innerHTML = "";
  const memesToShow = allMemes.slice(0, limit);

  memesToShow.forEach((meme) => {
    const div = document.createElement("div");
    div.className = "square-item";
    div.draggable = true;
    div.ondragstart = handleDragStart;
    div.title = meme.name;
    div.innerHTML = `
      <img src="${meme.url}" alt="${meme.name}" loading="lazy"
           style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
    `;
    gridContainer.appendChild(div);
  });
}

// Load memes khi trang tải xong
window.addEventListener("DOMContentLoaded", async () => {
  await renderMemePanel(40);
  setupRealTimeTextSync();
});

// Nút Load More
const loadMoreBtn = document.getElementById("load-more-btn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", async () => {
    currentLimit += 20;
    const allMemes = await fetchMemesFromImgflip();
    const gridContainer = document.querySelector(
      "#panel-meme .grid-container-2col"
    );
    const newMemes = allMemes.slice(currentLimit - 20, currentLimit);

    newMemes.forEach((meme) => {
      const div = document.createElement("div");
      div.className = "square-item";
      div.draggable = true;
      div.ondragstart = handleDragStart;
      div.title = meme.name;
      div.innerHTML = `<img src="${meme.url}" alt="${meme.name}" loading="lazy" style="width:100%; height:100%; object-fit:cover; pointer-events:none;">`;
      gridContainer.appendChild(div);
    });

    if (currentLimit >= allMemes.length) {
      loadMoreBtn.style.display = "none";
    }
  });
}

// ==================== 2. PANEL NAVIGATION ====================
function activatePanel(panelId, element) {
  const panelsContainer = document.getElementById("panels-container");
  const targetPanel = document.getElementById(`panel-${panelId}`);

  // Tắt panel nếu đang active
  if (targetPanel.classList.contains("active")) {
    targetPanel.classList.remove("active");
    element.classList.remove("active");

    // Nếu không còn panel nào active thì ẩn container
    if (!document.querySelector(".control-panel.active")) {
      panelsContainer.style.display = "none";
    }
  } else {
    // Bật panel mới
    document
      .querySelectorAll(".control-panel")
      .forEach((p) => p.classList.remove("active"));
    document
      .querySelectorAll(".tool-box")
      .forEach((t) => t.classList.remove("active"));

    panelsContainer.style.display = "block";
    targetPanel.classList.add("active");
    element.classList.add("active");
  }
}

// ==================== 3. UPLOAD & URL HANDLER (FIXED) ====================
function handlePanelFileUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const parentLabel = input.closest(".square-item");
      if (!parentLabel) return;

      // Xóa tất cả nội dung cũ (icon, text label) trừ input
      const oldElements = parentLabel.querySelectorAll(
        "i, div.panel-image-label, img"
      );
      oldElements.forEach((el) => el.remove());

      // Tạo ảnh preview mới
      const imgHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; pointer-events:none;">`;
      parentLabel.insertAdjacentHTML("beforeend", imgHTML);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function handleUrlInput(element) {
  const url = prompt(
    "Please enter image URL:",
    "https://via.placeholder.com/150"
  );
  if (url) {
    element.innerHTML = "";
    const imgHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover; pointer-events:none;" onerror="this.src=''; alert('Invalid URL');">`;
    element.innerHTML = imgHTML;
  }
}

// ==================== 4. DRAG LOGIC (FIXED) ====================
function handleDragStart(e) {
  const target =
    e.target.closest(".text-style-item") || e.target.closest(".square-item");
  if (!target) return;

  let dragData = { type: "unknown", content: "" };

  // --- A. Kéo Font Chữ ---
  if (target.classList.contains("text-style-item")) {
    dragData.type = "text";
    dragData.content = target.innerText.trim();
    dragData.font = target.style.fontFamily.replace(/['"]/g, ""); // Lấy tên font
  }
  // --- B. Kéo Ảnh / Element ---
  else if (target.classList.contains("square-item")) {
    const imgInside = target.querySelector("img");

    if (imgInside) {
      dragData.type = "image";
      dragData.src = imgInside.src;
    } else {
      dragData.type = "element";
      // Clone để lấy nội dung HTML (Icon, Color box)
      let clone = target.cloneNode(true);
      // Xóa input file để tránh lỗi trùng lặp
      clone.querySelectorAll("input").forEach((i) => i.remove());
      dragData.content = clone.innerHTML;
    }
  }

  e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = "copy";
}

// ==================== 5. DROP LOGIC (FIXED - ADDED TEXT SUPPORT) ====================
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  e.currentTarget.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

function handleDrop(e, zoneId) {
  e.preventDefault();
  const dropZone = e.currentTarget;
  dropZone.classList.remove("drag-over");

  // --- TRƯỜNG HỢP 1: Kéo file từ máy tính ---
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      dropZone.innerHTML = "";
      const img = document.createElement("img");
      img.src = evt.target.result;
      img.className = "dropped-content-img";
      dropZone.appendChild(img);

      // Lưu dữ liệu Base64
      canvasData[zoneId] = { type: "image", src: evt.target.result };
      console.log(`Zone ${zoneId} updated (File)`);
    };
    reader.readAsDataURL(file);
    return;
  }

  // --- TRƯỜNG HỢP 2: Kéo từ Panel (Text, Meme, URL) ---
  try {
    const rawData = e.dataTransfer.getData("text/plain");
    if (!rawData) return;
    const data = JSON.parse(rawData);

    dropZone.innerHTML = ""; // Xóa placeholder cũ

    // A. Xử lý TEXT (Đã thêm mới)
    if (data.type === "text") {
      const textEl = document.createElement("div");
      textEl.className = "dropped-content-text";
      textEl.innerText = data.content;
      textEl.style.fontFamily = data.font;
      textEl.style.width = "100%";
      textEl.style.textAlign = "center";
      textEl.style.fontSize = "3rem";

      dropZone.appendChild(textEl);
      canvasData[zoneId] = {
        type: "text",
        content: data.content,
        font: data.font,
      };
    }
    // B. Xử lý IMAGE
    else if (data.type === "image") {
      const img = document.createElement("img");
      img.src = data.src;
      img.className = "dropped-content-img";
      dropZone.appendChild(img);
      canvasData[zoneId] = { type: "image", src: data.src };
    }
    // C. Xử lý ELEMENT (HTML)
    else if (data.type === "element") {
      const elContainer = document.createElement("div");
      elContainer.style.width = "100%";
      elContainer.style.height = "100%";
      elContainer.style.display = "flex";
      elContainer.style.justifyContent = "center";
      elContainer.style.alignItems = "center";
      elContainer.innerHTML = data.content;
      dropZone.appendChild(elContainer);
      canvasData[zoneId] = { type: "element", content: data.content };
    }

    console.log(`Zone ${zoneId} updated:`, canvasData[zoneId]);
  } catch (err) {
    console.error("Drop error:", err);
  }
}

// ==================== 6. DATA EXPORT FUNCTION ====================
function getMemeSources() {
  return {
    zone1: canvasData.zone1,
    zone2: canvasData.zone2,
    isReady: !!(canvasData.zone1 && canvasData.zone2),
    timestamp: new Date().toISOString(),
  };
}

// ==================== 7. REAL-TIME TEXT SYNC (NEW) ====================
function setupRealTimeTextSync() {
  const inputEl = document.getElementById("global-text-input");

  // Kiểm tra nếu input tồn tại
  if (!inputEl) return;

  // Lắng nghe sự kiện 'input' (tốt hơn 'keydown' vì nó bắt được cả paste, cut, tiếng Việt có dấu)
  inputEl.addEventListener("input", function (e) {
    const newText = e.target.value;

    // Lấy tất cả các thẻ span nằm trong text-style-item
    const textSpans = document.querySelectorAll(".text-style-item span");

    textSpans.forEach((span) => {
      // Nếu input trống thì hiển thị text mặc định, ngược lại thì hiển thị text đang nhập
      span.innerText = newText.trim() === "" ? "Meme shirt" : newText;
    });
  });
}
