const BASE_URL = "https://provinces.open-api.vn/api"; // Đổi sang HTTPS để tránh lỗi network

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
        // API trả về mảng districts ở level này, return nó về để renderWards nhận được mảng
        return province.districts;
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
      content += `<option value=${province.code}>${province.name}</option>`;
    });
    document.querySelector("select#province").innerHTML = content;
  }

  renderWards(wards) {
    let content = "";
    // Check kỹ nếu wards có dữ liệu mới chạy loop
    if (wards && wards.length > 0) {
      wards.forEach((ward) => {
        content += `<option value=${ward.code}>${ward.name}</option>`;
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

    // Kiểm tra nếu element tồn tại và không có giá trị (rỗng)
    if (element && !element.value.trim()) {
      isValid = false; // Đánh dấu là có lỗi

      // 1. Thêm class để hiện viền đỏ (đã định nghĩa bên CSS)
      element.classList.add("input-error");

      // 2. Hiện dòng thông báo bên trong (thay đổi placeholder)
      // Lấy tên field viết hoa chữ cái đầu cho đẹp
      const fieldName = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
      element.value = ""; // Xóa sạch để hiện placeholder
      element.placeholder = `${fieldName} can't valid`;
    } else if (element) {
      // Nếu đã nhập đúng thì bỏ class lỗi đi
      element.classList.remove("input-error");
    }
  });

  // Nếu tất cả đều hợp lệ
  if (isValid) {
    alert("Order Successful! Redirecting...");

    // Chuyển trang (bạn thay đổi đường dẫn bên dưới)
    window.location.href = "../page_orderList/orderList.html";
  }
});

// Thêm sự kiện để khi người dùng bắt đầu gõ lại, màu đỏ tự mất đi (tùy chọn cho UX tốt hơn)
const inputs = document.querySelectorAll("input, select, textarea");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
    // Tùy chọn: trả lại placeholder gốc nếu muốn, ở đây chỉ cần xóa viền đỏ là đủ
  });
});
