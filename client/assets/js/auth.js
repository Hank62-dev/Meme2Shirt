// Logic cho nút Register
document
  .getElementById("btn_register")
  .addEventListener("click", async function (e) {
    e.preventDefault(); // Ngăn form reload

    // Lấy giá trị từ input và loại bỏ khoảng trắng thừa ở đầu/cuối
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // --- PHẦN VALIDATION MỚI ---

    // 1. Kiểm tra Username
    if (!username) {
      alert("Username cannot be empty");
      document.getElementById("username").focus(); // Trỏ chuột vào ô lỗi
      return;
    }

    // 2. Kiểm tra Password
    if (!password) {
      alert("Password cannot be empty");
      document.getElementById("password").focus();
      return;
    }

    // 3. Kiểm tra Email (Regex)
    // Cú pháp regex: chuỗi + @ + chuỗi + . + chuỗi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email is invalid (Example: user@email.com)");
      document.getElementById("email").focus();
      return;
    }

    // --- KẾT THÚC PHẦN VALIDATION ---

    // Nếu mọi thứ ok thì gửi POST request
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
        alert(result.message); // Thông báo thành công

        // Chuyển hướng sau khi đăng ký thành công
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
  });
