// 1. Điều hướng Panel
function activatePanel(panelId, element) {
  document
    .querySelectorAll(".control-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tool-box")
    .forEach((t) => t.classList.remove("active"));

  document.getElementById("panels-container").style.display = "block";

  const target = document.getElementById(`panel-${panelId}`);
  if (target) target.classList.add("active");
  if (element) element.classList.add("active");
}

// 2. Xử lý Upload & URL trong Panel Image
function handlePanelFileUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const parentLabel = input.closest(".square-item");
      // Xóa icon cũ
      parentLabel.querySelectorAll("i, span").forEach((i) => i.remove());

      // Thêm ảnh vào
      let existingImg = parentLabel.querySelector("img");
      if (existingImg) {
        existingImg.src = e.target.result;
      } else {
        const imgHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; pointer-events:none;">`;
        parentLabel.insertAdjacentHTML("beforeend", imgHTML);
      }
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

// 3. Logic Drag (Kéo)
function handleDragStart(e) {
  const target =
    e.target.closest(".text-style-item") || e.target.closest(".square-item");
  if (!target) return;

  let dragData = { type: "unknown", content: "" };

  // Trường hợp kéo Text
  if (target.classList.contains("text-style-item")) {
    dragData.type = "text";
    dragData.content = target.innerText.trim();
    dragData.font = target.style.fontFamily.replace(/['"]/g, ""); // Lấy tên font
  }
  // Trường hợp kéo Item Vuông (Ảnh hoặc HTML Element)
  else if (target.classList.contains("square-item")) {
    const imgInside = target.querySelector("img");

    if (imgInside) {
      // Nếu là ảnh (do user upload hoặc url)
      dragData.type = "image";
      dragData.src = imgInside.src;
    } else {
      // Nếu là Element HTML (Màu sắc, Icon có sẵn)
      dragData.type = "element";

      // CLONE để tránh kéo theo input file
      let clone = target.cloneNode(true);
      let inputs = clone.querySelectorAll("input");
      inputs.forEach((i) => i.remove());
      dragData.content = clone.innerHTML;

      // Lấy màu nền nếu có
      const coloredDiv = target.querySelector("div[style*='background']");
      if (coloredDiv) {
        dragData.bgColor = coloredDiv.style.backgroundColor;
      }
    }
  }

  e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = "copy";
}

// 4. Logic Drop (Thả)
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

  // A. Thả file từ máy tính
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

      // Lưu state
      canvasData[zoneId] = { type: "image", src: evt.target.result };
    };
    reader.readAsDataURL(file);
    return;
  }

  // B. Thả item từ Sidebar
  try {
    const rawData = e.dataTransfer.getData("text/plain");
    if (!rawData) return;
    const data = JSON.parse(rawData);

    dropZone.innerHTML = ""; // Xóa placeholder

    if (data.type === "text") {
      const textEl = document.createElement("div");
      textEl.className = "dropped-content-text";
      textEl.innerText = data.content;
      textEl.style.fontFamily = data.font;
      dropZone.appendChild(textEl);
      canvasData[zoneId] = data;
    } else if (data.type === "image") {
      const img = document.createElement("img");
      img.src = data.src;
      img.className = "dropped-content-img";
      dropZone.appendChild(img);
      canvasData[zoneId] = data;
    } else if (data.type === "element") {
      const elContainer = document.createElement("div");
      elContainer.style.width = "100%";
      elContainer.style.height = "100%";
      elContainer.style.display = "flex";
      elContainer.style.justifyContent = "center";
      elContainer.style.alignItems = "center";
      elContainer.innerHTML = data.content;
      dropZone.appendChild(elContainer);
      canvasData[zoneId] = data;
    }
  } catch (err) {
    console.error("Drop error:", err);
  }
}
