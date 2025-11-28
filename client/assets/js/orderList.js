document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("order-search-input");
  const cards = document.querySelectorAll(".order-card");

  // Lắng nghe khi gõ chữ
  searchInput.addEventListener("input", function (e) {
    const keyword = e.target.value.toLowerCase(); // Lấy chữ đang gõ, đổi thành chữ thường

    cards.forEach((card) => {
      // Lấy toàn bộ chữ trong cái thẻ card đó (Tên, giá, qty...)
      const content = card.innerText.toLowerCase();

      // Kiểm tra: Nếu có chứa từ khóa thì hiện, không thì ẩn
      if (content.includes(keyword)) {
        card.style.display = "flex"; // Hiện (dùng flex vì CSS bạn đang set flex)
      } else {
        card.style.display = "none"; // Ẩn
      }
    });
  });
});
