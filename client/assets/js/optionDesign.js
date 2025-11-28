const buttonOrder = document.querySelectorAll(".buttonOrder");
const buttonPrint = document.querySelectorAll(".buttonPrint");
const buttonSize = document.querySelectorAll(".buttonSize");
const buttonColor = document.querySelectorAll(".buttonColor");

buttonOrder.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttonOrder.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

buttonPrint.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttonPrint.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

buttonSize.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttonSize.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

buttonColor.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttonColor.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
