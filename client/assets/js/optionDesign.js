function setupToggle(buttons) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) {
        btn.classList.remove("active");
      } else {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
    });
  });
}

setupToggle(document.querySelectorAll(".buttonOrder"));
setupToggle(document.querySelectorAll(".buttonPrint"));
setupToggle(document.querySelectorAll(".buttonSize"));

// color selected
const buttonColors = document.querySelectorAll(".buttonColor");
const colorSelected = document.querySelector(".colorSelected");
buttonColors.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      btn.classList.remove("active");
      colorSelected.style.backgroundColor = "";
    } else {
      buttonColors.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      colorSelected.style.backgroundColor = btn.style.backgroundColor;
    }
  });
});

const minusBtn = document.querySelector(".chooseQuantity .minus");
const plusBtn = document.querySelector(".chooseQuantity .plus");
const numberDiv = document.querySelector(".chooseQuantity .number");

let quantity = parseInt(numberDiv.textContent); // khởi tạo số ban đầu

minusBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    numberDiv.textContent = quantity;
  }
});

plusBtn.addEventListener("click", () => {
  quantity++;
  numberDiv.textContent = quantity;
});
