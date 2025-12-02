const BASE_URL = "https://provinces.open-api.vn/api/v2";

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
      if (provinceCurrentCode) {
        return store.getWards(provinceCurrentCode);
      }
    })
    .then((wards) => {
      if (wards) {
        renderUI.renderWards(wards);
      }
    });

  console.log("checkout.js loaded");
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
document
  .querySelector(".btn-submit")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const fieldsToCheck = [
      "name",
      "phone",
      "email",
      "province",
      "ward",
      "address",
    ];
    let isValid = true;

    fieldsToCheck.forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (!element) return;

      const val = element.value.trim();
      let isFieldValid = true;
      let errorMessage = "";

      if (!val) {
        isFieldValid = false;
        const fieldName = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
        errorMessage = `${fieldName} mustn't be empty`;
      } else if (fieldId === "phone") {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(val)) {
          isFieldValid = false;
          errorMessage = "Phonenumber invalid";
        }
      } else if (fieldId === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          isFieldValid = false;
          errorMessage = "Email invalid";
        }
      }

      if (!isFieldValid) {
        isValid = false;
        element.classList.add("input-error");
        element.value = "";
        element.placeholder = errorMessage;
      } else {
        element.classList.remove("input-error");
      }
    });

    if (isValid) {
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
          // Hiện modal thành công
          const modal = document.getElementById("successModal");
          modal.classList.add("show");

          // Reset form
          document.getElementById("checkoutForm").reset();
        } else {
          alert("Lỗi rồi: " + result.error);
        }
      } catch (error) {
        console.error("Error gửi form:", error);
        alert("Không thể gửi dữ liệu! Kiểm tra xem server có đang chạy không.");
      }
    }
  });

// Xử lý nút OK
document.getElementById("btn-modal-ok").addEventListener("click", () => {
  window.location.href = "../page_orderList/orderList.html";
});

// Xóa lỗi khi focus
const inputs = document.querySelectorAll("input, select, textarea");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
  });
});
