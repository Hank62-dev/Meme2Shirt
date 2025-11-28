function formatNumber(num) {
  return num.toLocaleString("vi-VN");
}

// Parse từ "200.000" → 200000
function parseNumber(str) {
  return Number(str.replace(/\./g, ""));
}

// TÍNH TỔNG TIỀN
function updateSummary() {
  const items = document.querySelectorAll(".cart-item");
  let subtotal = 0;

  items.forEach((item) => {
    const checkbox = item.querySelector(".item-checkbox");

    if (checkbox && checkbox.checked) {
      const priceElement = item.querySelector(".price");
      const qtyElement = item.querySelector(".qty-display");
      const price = parseNumber(priceElement.innerText);
      const qty = Number(qtyElement.innerText);
      subtotal += price * qty;
    }
  });

  const discount = 20000;
  const shipping = 10000;
  let total = 0;
  if (subtotal > 0) {
    total = subtotal + shipping - discount;
  } else {
    total = 0;
  }

  document.getElementById("sub-total").innerText = formatNumber(subtotal);

  document.getElementById("discount-amount").innerText =
    subtotal > 0 ? "-" + formatNumber(discount) : "0";
  document.getElementById("shipping-fee").innerText =
    subtotal > 0 ? formatNumber(shipping) : "0";

  document.getElementById("total-price").innerText = formatNumber(total);
}

//TĂNG GIẢM
function setupQuantityButtons() {
  const increaseBtns = document.querySelectorAll(".btn-increase");
  const decreaseBtns = document.querySelectorAll(".btn-decrease");

  // Tăng
  increaseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".cart-item");
      const display = item.querySelector(".qty-display");
      let qty = Number(display.innerText);
      qty++;
      display.innerText = qty;
      updateSummary();
    });
  });

  // Giảm
  decreaseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".cart-item");
      const display = item.querySelector(".qty-display");
      let qty = Number(display.innerText);
      if (qty > 1) qty--;
      display.innerText = qty;
      updateSummary();
    });
  });
}

//  XÓA
function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll(".remove-btn"); // Bạn bị thiếu dòng này

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".cart-item");
      if (item) {
        item.remove();
        updateItemCount();
        updateSummary();
      }
    });
  });
}

function checkAllItemsByDefault() {
  const checkboxes = document.querySelectorAll(".item-checkbox");
  checkboxes.forEach((cb) => (cb.checked = true));
}

function setupCheckboxEvents() {
  const checkboxes = document.querySelectorAll(".item-checkbox");
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updateSummary);
  });
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      const items = document.querySelectorAll(".cart-item");
      items.forEach((item) => {
        const text = item.querySelector(".details p").innerText.toLowerCase();
        if (text.includes(keyword)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
}

function updateItemCount() {
  const items = document.querySelectorAll(".cart-item");
  const countSpan = document.getElementById("total-items-count");
  if (countSpan) {
    countSpan.innerText = `${items.length} items`;
  }
}

function initCartPage() {
  setupQuantityButtons();
  setupRemoveButtons();
  setupCheckboxEvents();
  checkAllItemsByDefault();
  setupSearch();
  updateItemCount();
  updateSummary();
}

// Chạy khi DOM load xong
document.addEventListener("DOMContentLoaded", initCartPage);
