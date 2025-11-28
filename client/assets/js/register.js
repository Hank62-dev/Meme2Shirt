// --- 1. PHẦN ANIMATION & LOGIN---
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".right_frame").classList.add("show");
    document.querySelector(".register_frame").classList.add("show");
  }, 500);
});

document.getElementById("login").addEventListener("click", function () {
  document.querySelector(".right").classList.add("element_slide_out");
  document.querySelector(".left").classList.add("fade_out");

  document.querySelector(".right_frame").classList.remove("show");
  document.querySelector(".register_frame").classList.remove("show");
  setTimeout(function () {
    document.querySelector(".container").classList.add("right_expand");
  }, 1200);

  setTimeout(function () {
    document.querySelector(".container").classList.remove("right_expand");
    document.querySelector(".container").classList.add("prepare_move_to_login");
  }, 2800);

  setTimeout(function () {
    document
      .querySelector(".container")
      .classList.remove("prepare_move_to_login");
    document.querySelector(".container").classList.add("pink_slide_out");
  }, 3000);

  setTimeout(() => {
    window.location.href = "../page_login/login.html";
  }, 4500);
});

// --- 2. LOGIC REGISTER (SỬA THEO CHUẨN CHECKOUT) ---
document
  .getElementById("btn_register")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    // Danh sách các ID cần kiểm tra
    const fieldsToCheck = ["username", "email", "password"];
    let isValid = true; // Cờ kiểm tra tổng

    // Vòng lặp kiểm tra từng ô input
    fieldsToCheck.forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (!element) return;

      const val = element.value.trim();
      let isFieldValid = true;
      let errorMessage = "";

      // A. Kiểm tra Rỗng (Empty)
      if (!val) {
        isFieldValid = false;
        // Viết hoa chữ cái đầu: username -> Username
        const fieldName = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
        errorMessage = `${fieldName} mustn't be empty`;
      }
      // B. Kiểm tra riêng cho Email (nếu không rỗng)
      else if (fieldId === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          isFieldValid = false;
          errorMessage = "Email invalid";
        }
      }

      // C. Xử lý hiển thị lỗi (Giống mẫu Checkout)
      if (!isFieldValid) {
        isValid = false;
        element.classList.add("input-error"); // Thêm viền đỏ
        element.value = ""; // Xóa nội dung sai
        element.placeholder = errorMessage; // Hiện lỗi vào placeholder
      } else {
        // Nếu đúng thì xóa lỗi
        element.classList.remove("input-error");
      }
    });

    // Nếu TẤT CẢ hợp lệ thì mới gửi dữ liệu đi
    if (isValid) {
      // Lấy lại giá trị chính xác lần nữa để gửi
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
          alert(result.message);
          // Chuyển hướng
          setTimeout(() => {
            window.location.href = "../page_login/login.html";
          }, 1000);
        } else {
          alert(result.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration");
      }
    }
  });

// --- 3. SỰ KIỆN FOCUS ĐỂ XÓA LỖI ---
// Khi bấm vào ô input đang đỏ, nó sẽ mất màu đỏ đi
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
  });
});
