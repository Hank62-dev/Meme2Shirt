// --- 1. PHẦN ANIMATION MỞ ĐẦU (GIỮ NGUYÊN) ---
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".left_frame").classList.add("show");
    document.querySelector(".login_frame").classList.add("show");
  }, 500);
});

// --- 2. LOGIC CHUYỂN TRANG REGISTER (GIỮ NGUYÊN) ---
document.getElementById("register").addEventListener("click", function () {
  document.querySelector(".left").classList.add("element_slide_out");
  document.querySelector(".right").classList.add("fade_out");

  document.querySelector(".left_frame").classList.remove("show");
  document.querySelector(".login_frame").classList.remove("show");
  setTimeout(function () {
    document.querySelector(".container").classList.add("left_expand");
  }, 1200);

  setTimeout(function () {
    document.querySelector(".container").classList.remove("left_expand");
    document
      .querySelector(".container")
      .classList.add("prepare_move_to_register");
  }, 2800);

  setTimeout(function () {
    document
      .querySelector(".container")
      .classList.remove("prepare_move_to_register");
    document.querySelector(".container").classList.add("pink_slide_out");
  }, 3000);

  setTimeout(() => {
    window.location.href = "../page_register/register.html";
  }, 4000);
});

// --- 3. LOGIC NÚT LOGIN (CẬP NHẬT VALIDATION) ---
document
  .getElementById("btn_login")
  .addEventListener("click", async function (e) {
    e.preventDefault(); // Ngăn hành vi mặc định

    // Danh sách các ID cần kiểm tra
    const fieldsToCheck = ["username", "password"];
    let isValid = true; // Cờ kiểm tra tổng

    // Vòng lặp kiểm tra từng ô input
    fieldsToCheck.forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (!element) return;

      const val = element.value.trim();
      let isFieldValid = true;
      let errorMessage = "";

      // Kiểm tra Rỗng (Empty)
      if (!val) {
        isFieldValid = false;
        // Viết hoa chữ cái đầu: username -> Username
        const fieldName = fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
        errorMessage = `${fieldName} mustn't be empty`;
      }

      // Xử lý hiển thị lỗi (Thêm viền đỏ, đổi placeholder)
      if (!isFieldValid) {
        isValid = false;
        element.classList.add("input-error");
        element.value = ""; // Xóa nội dung
        element.placeholder = errorMessage; // Hiện lỗi vào placeholder
      } else {
        element.classList.remove("input-error");
      }
    });

    // Nếu HỢP LỆ thì mới gọi API Login
    if (isValid) {
      // Lấy lại giá trị để gửi đi
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
          alert(result.message); // Thông báo thành công
          // Chuyển hướng sau khi đăng nhập thành công
          setTimeout(() => {
            window.location.href = "../../page_home/index.html";
          }, 1000);
        } else {
          alert(result.message || "Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login");
      }
    }
  });

// --- 4. SỰ KIỆN FOCUS ĐỂ XÓA LỖI ---
// Khi bấm vào ô input, xóa class lỗi đi
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
  });
});
