const BASE_URL = "https://provinces.open-api.vn/api/v2"; // Đổi sang HTTPS để tránh lỗi network

class Http {
  send(method, url, body) {
    return fetch(url, {
      method: method,
      body: body ? JSON.stringify(body) : null,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    });
  }

  get(url) {
    return this.send("GET", url, null);
  }
}

class Store {
  constructor() {
    this.http = new Http();
  }

  getProvinces() {
    return this.http
      .get(`${BASE_URL}/p/`)
      .then((provinces) => {
        return provinces;
      })
      .catch((error) => {
        console.log("Quá trình getProvinces thất bại : " + error);
      });
  }

  getWards(code) {
    return this.http
      .get(`${BASE_URL}/p/${code}/?depth=2`)
      .then((province) => {
        return province.wards;
      })
      .catch((error) => {
        console.log("Quá trình getWards thất bại : " + error);
      });
  }
}

class RenderUI {
  renderProvinces(provinces) {
    let content = "";
    provinces.forEach((province) => {
      content += `<option value=${province.code} style="font-size: 2rem;">${province.name}</option>`;
    });
    document.querySelector("select#province").innerHTML = content;
  }

  renderWards(wards) {
    let content = "";
    // Check kỹ nếu wards có dữ liệu mới chạy loop
    if (wards && wards.length > 0) {
      wards.forEach((ward) => {
        content += `<option value=${ward.code} style="font-size: 2rem;">${ward.name}</option>`;
      });
    }
    document.querySelector("select#ward").innerHTML = content;
  }

  renderInfor(information) {
    const { province, ward, address } = information;
    document.querySelector(
      "#information"
    ).innerHTML = `${province}, ${ward}, ${address}`;
  }
}

// Sự kiện load trang
document.addEventListener("DOMContentLoaded", (event) => {
  let store = new Store();
  let renderUI = new RenderUI();

  store
    .getProvinces()
    .then((provinces) => {
      renderUI.renderProvinces(provinces);
      let provinceCurrentCode = document.querySelector("select#province").value;
      // Gọi getWards ngay khi có province đầu tiên
      if (provinceCurrentCode) {
        return store.getWards(provinceCurrentCode);
      }
    })
    .then((wards) => {
      if (wards) {
        renderUI.renderWards(wards);
      }
    });
});

// Khi người dùng đổi province
document
  .querySelector("select#province")
  .addEventListener("change", (event) => {
    let store = new Store();
    let renderUI = new RenderUI();
    let provinceCurrentCode = document.querySelector("select#province").value;

    store.getWards(provinceCurrentCode).then((wards) => {
      renderUI.renderWards(wards);
    });
  });

// Khi người dùng submit
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let province = document.querySelector("#province option:checked").innerHTML;
  let ward = document.querySelector("#ward option:checked").innerHTML;
  let address = document.querySelector("#address").value;

  let information = {
    province,
    ward,
    address,
  };

  let renderUI = new RenderUI();
  renderUI.renderInfor(information);
});

// Sự kiện click cho nút Submit mới
document.querySelector(".btn-submit").addEventListener("click", (event) => {
  event.preventDefault();
  // Danh sách các ID của input/select cần kiểm tra
  const fieldsToCheck = [
    "name",
    "phone",
    "email",
    "province",
    "ward",
    "address",
  ];
  let isValid = true; // Cờ kiểm tra, mặc định là đúng

  fieldsToCheck.forEach((fieldId) => {
    const element = document.getElementById(fieldId);
    if (!element) return;

    const val = element.value.trim();
    let isFieldValid = true;
    let errorMessage = "";

    // 1. Kiểm tra Rỗng (Empty) trước
    if (!val) {
      isFieldValid = false;
      // Viết hoa chữ cái đầu
      const fieldName = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
      errorMessage = `${fieldName} mustn't be empty`;
    }
    // 2. Kiểm tra riêng cho Phone (nếu không rỗng)
    else if (fieldId === "phone") {
      // Regex: Bắt đầu bằng 0, theo sau là 9 chữ số bất kỳ (tổng 10 số)
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(val)) {
        isFieldValid = false;
        errorMessage = "Phonenumber invalid";
      }
    }
    // 3. Kiểm tra riêng cho Email (nếu không rỗng)
    else if (fieldId === "email") {
      // Regex: Kiểm tra định dạng email cơ bản (text@domain.extension)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        isFieldValid = false;
        errorMessage = "Email invalid";
      }
    }

    // Xử lý hiển thị lỗi hoặc thành công
    if (!isFieldValid) {
      isValid = false; // Đánh dấu form bị lỗi
      element.classList.add("input-error");
      element.value = ""; // Xóa nội dung sai
      element.placeholder = errorMessage; // Hiện thông báo lỗi
    } else {
      element.classList.remove("input-error");
    }
  });

  // Nếu tất cả đều hợp lệ
  if (isValid) {
    const modal = document.getElementById("successModal");
    modal.classList.add("show");
  }
});

// --- THÊM ĐOẠN NÀY ĐỂ XỬ LÝ NÚT OK ---
document.getElementById("btn-modal-ok").addEventListener("click", () => {
  // Khi nhấn OK mới chuyển trang
  window.location.href = "../page_orderList/orderList.html";
});

// Thêm sự kiện để khi người dùng bắt đầu gõ lại, màu đỏ tự mất đi (tùy chọn cho UX tốt hơn)
const inputs = document.querySelectorAll("input, select, textarea");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
    // Tùy chọn: trả lại placeholder gốc nếu muốn, ở đây chỉ cần xóa viền đỏ là đủ
  });
});

console.log("checkout.js loaded");

const form = document.querySelector(".customer-section form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Lấy dữ liệu từ form
  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    province: document.getElementById("province").value,
    ward: document.getElementById("ward").value,
    address: document.getElementById("address").value.trim(),
    note: document.getElementById("note").value.trim(),
  };

  console.log("Submitting data:", data);

  try {
    const res = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log("Server response:", result);

    if (res.ok) {
      alert("Submit thành công! Dữ liệu đã được lưu vào database.");
      form.reset();
    } else {
      alert("Lỗi rồi: " + result.error);
    }
  } catch (error) {
    console.error("Error gửi form:", error);
    alert("Không thể gửi dữ liệu!");
  }
});
