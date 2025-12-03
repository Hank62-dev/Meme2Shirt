// optionDesign.js

// 1. KHỞI TẠO STATE (Dữ liệu sẽ gửi đi)
let selectionData = {
  idProduct: "",
  nameProduct: "",
  imageURL: "",
  newPrice: 0,
  isDesign: true,
  printSide: "",
  color: "",
  size: "",
  quantities: 1,
};

document.addEventListener("DOMContentLoaded", async () => {
  // --- A. LẤY DỮ LIỆU TỪ URL & API ---
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    showToast("Missing product ID in the URL!", "error");
    return;
  }

  // Lưu ID vào state
  selectionData.idProduct = productId;

  try {
    // Gọi API lấy thông tin gốc
    // SỬA: Dùng đường dẫn tương đối và đảm bảo đúng route /api/products/
    const response = await fetch(`/api/product/${productId}`);
    if (!response.ok) throw new Error("Lỗi tải sản phẩm");

    const productDefault = await response.json();

    // Gọi hàm fill dữ liệu dựa trên class name
    renderProductByClass(productDefault);
  } catch (error) {
    console.error(error);
    document.querySelector(".nameProduct").innerText =
      "Lỗi kết nối hoặc không tìm thấy sản phẩm";
  }
  const btnSelf = document.querySelector(".selfDesign");
  const btnNo = document.querySelector(".noDesign");
  const sectionPrint = document.querySelector(".choosePrintSide");
  const btnDesignNow = document.querySelector(".designNow"); // Thẻ a
  const btnCart = document.querySelector(".addCartButton");

  btnSelf.classList.add("active");
  // Mở khóa UI
  btnCart.classList.add("disabled");
  // --- B. GÁN SỰ KIỆN CLICK (LOGIC UI & DATA) ---
  setupEventHandlers();
});

// --- HÀM 1: Đổ dữ liệu vào HTML dựa trên Class Name ---
function renderProductByClass(product) {
  // Cập nhật State gốc từ API
  selectionData.nameProduct = product.nameProduct;
  selectionData.imageURL = product.imageURL;
  selectionData.newPrice = product.newPrice;

  // 1. Map tên sản phẩm
  const nameEl = document.querySelector(".nameProduct");
  if (nameEl) nameEl.innerText = product.nameProduct;

  // 2. Map giá tiền
  const priceEl = document.querySelector(".priceProduct");
  if (priceEl) {
    priceEl.innerText =
      Number(product.newPrice).toLocaleString("vi-VN") + " VND";
  }

  // 3. Map ảnh
  const imgEl = document.querySelector(".mainProduct img");
  if (imgEl) imgEl.src = product.imageURL;

  // 4. MAP MÀU SẮC (Code thêm mới)
  if (product.color) {
    // Chuyển màu về chữ thường để khớp với id trong HTML (ví dụ: "White" -> "white")
    const colorId = product.color.toLowerCase();

    // Tìm nút màu có id trùng với màu của sản phẩm
    const targetColorBtn = document.getElementById(colorId);

    if (targetColorBtn) {
      // A. Cập nhật State dữ liệu gửi đi
      selectionData.color = colorId;

      // B. Cập nhật giao diện (Thêm class active cho nút đó)
      // Trước tiên xóa active ở các nút khác (nếu có)
      document
        .querySelectorAll(".buttonColor")
        .forEach((b) => b.classList.remove("active"));
      targetColorBtn.classList.add("active");

      // C. Cập nhật ô tròn hiển thị màu đã chọn
      const colorSelectedDisplay = document.querySelector(".colorSelected");
      if (colorSelectedDisplay) {
        colorSelectedDisplay.style.backgroundColor =
          targetColorBtn.style.backgroundColor;
      }
    }
  }
}

// --- HÀM 2: Xử lý Click và Logic ---
function setupEventHandlers() {
  // --- 1. Xử lý nút ORDER (Self-design / No Design) ---
  const btnSelf = document.querySelector(".selfDesign");
  const btnNo = document.querySelector(".noDesign");
  const sectionPrint = document.querySelector(".choosePrintSide");
  const btnDesignNow = document.querySelector(".designNow"); // Thẻ a
  const btnCart = document.querySelector(".addCartButton");

  // Helper: Reset active class cho nhóm order
  const resetOrder = () => {
    btnSelf.classList.remove("active");
    btnNo.classList.remove("active");
  };

  btnSelf.addEventListener("click", () => {
    resetOrder();
    btnSelf.classList.add("active");

    selectionData.isDesign = true;

    // Mở khóa UI
    sectionPrint.classList.remove("disabled");
    // Xóa class disabled để nút Design hoạt động
    btnDesignNow.classList.remove("disabled");
    btnCart.classList.add("disabled");

    console.log("Current Data:", selectionData);
  });

  btnNo.addEventListener("click", () => {
    resetOrder();
    btnNo.classList.add("active");

    selectionData.isDesign = false;

    // Khóa UI & Reset Print Side
    sectionPrint.classList.add("disabled");
    // Thêm class disabled để chặn click
    btnDesignNow.classList.add("disabled");
    btnCart.classList.remove("disabled");

    // Reset lựa chọn in
    selectionData.printSide = "";
    document
      .querySelectorAll(".buttonPrint")
      .forEach((b) => b.classList.remove("active"));

    console.log("Current Data:", selectionData);
  });

  // --- 2. Xử lý nút PRINT SIDE ---
  const printBtns = document.querySelectorAll(".buttonPrint");
  printBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Nếu đang bị disable thì không cho click
      if (sectionPrint.classList.contains("disabled")) return;

      // Xử lý active
      printBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Logic lấy value dựa trên class
      if (btn.classList.contains("printFront"))
        selectionData.printSide = "Front";
      else if (btn.classList.contains("printBack"))
        selectionData.printSide = "Back";
      else if (btn.classList.contains("printBothSide"))
        selectionData.printSide = "Both";

      console.log("Current Data:", selectionData);
    });
  });

  // --- 3. Xử lý nút SIZE ---
  const sizeBtns = document.querySelectorAll(".buttonSize");
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Lấy text bên trong nút (S, M, L...)
      selectionData.size = btn.innerText.trim();
      console.log("Current Data:", selectionData);
    });
  });

  // --- 4. Xử lý nút COLOR ---
  const colorBtns = document.querySelectorAll(".buttonColor");
  const colorSelectedDisplay = document.querySelector(".colorSelected");

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Lấy ID màu (white, black...)
      selectionData.color = btn.id;

      // Hiển thị màu lên ô tròn nhỏ
      colorSelectedDisplay.style.backgroundColor = btn.style.backgroundColor;

      console.log("Current Data:", selectionData);
    });
  });

  // --- 5. Xử lý QUANTITY ---
  const btnMinus = document.querySelector(".minus");
  const btnPlus = document.querySelector(".plus");
  const numberDiv = document.querySelector(".number");

  btnMinus.addEventListener("click", () => {
    if (selectionData.quantities > 1) {
      selectionData.quantities--;
      numberDiv.innerText = selectionData.quantities;
    }
  });

  btnPlus.addEventListener("click", () => {
    selectionData.quantities++;
    numberDiv.innerText = selectionData.quantities;
  });

  // --- 6. SUBMIT (Add to Cart) ---
  const btnAddToCart = document.querySelector(".addCartButton");
  btnAddToCart.addEventListener("click", async (e) => {
    // Validation
    if (!selectionData.color) {
      showToast("Color mustn't empty!", "error");
      return;
    }
    if (!selectionData.size) {
      showToast("Size mustn't empty!", "error");
      return;
    }

    console.log("SENDING DATA:", selectionData);
    await saveToCart(selectionData);
  });

  // --- 7. CHUYỂN TRANG DESIGN ---

  btnDesignNow.addEventListener("click", (e) => {
    if (btnDesignNow.classList.contains("disabled")) {
      e.preventDefault();
      return;
    }

    // --- VALIDATION (Kiểm tra xem chọn đủ chưa) ---
    if (!selectionData.color) {
      alert("Color mustn't empty!");
      return;
    }
    if (!selectionData.size) {
      alert("Color mustn't empty!");
      return;
    }

    // Nếu chọn thiết kế riêng thì bắt buộc phải chọn mặt in
    if (selectionData.isDesign && !selectionData.printSide) {
      alert("Choose printSide (Front/Back/Both)!");
      return;
    }

    // --- ĐÓNG GÓI DỮ LIỆU ---
    const dataToSend = {
      idProduct: selectionData.idProduct,
      imageURL: selectionData.imageURL,
      color: selectionData.color,
      printSide: selectionData.printSide,

      size: selectionData.size, // 👈 QUAN TRỌNG: Gửi size đi ở đây
    };

    // Lưu vào localStorage
    localStorage.setItem("pendingDesignData", JSON.stringify(dataToSend));

    // Chuyển trang
    window.location.href = `../page_design/design.html?id=${selectionData.idProduct}`;
  });
}
// Hàm gửi API
async function saveToCart(data) {
  try {
    const response = await fetch("/api/selection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    console.log(res);

    if (response.ok) {
      showToast(res.message, "success");
      setTimeout(() => {
        window.location.href = "../page_cart/cart.html";
      }, 1000);
    }
  } catch (err) {
    console.error(err);
    alert("Disconnect server!");
  }
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
