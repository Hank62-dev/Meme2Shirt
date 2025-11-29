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
    window.location.href = "/page_register";
  }, 4000);
});

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// --- 3. LOGIC NÚT LOGIN (CẬP NHẬT VALIDATION) ---
document
  .getElementById("btn_login")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const fieldsToCheck = ["username", "password"];
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
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      try {
        // Thêm URL đầy đủ với /api
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        console.log("Response:", result);

        if (response.ok) {
          showToast(result.message, "success");
          setTimeout(() => {
            window.location.href = "/page_home";
          }, 1000);
        } else {
          showToast(result.message || "Login failed", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login");
      }
    }
  });

// --- 4. SỰ KIỆN FOCUS ĐỂ XÓA LỖI ---
const inputs = document.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.classList.remove("input-error");
  });
});
