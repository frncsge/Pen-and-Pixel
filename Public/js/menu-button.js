const dropDown = document.getElementById("drop-down-nav-container");
const menuBtn = document.querySelector(".container");

function myFunction(x) {
  x.classList.toggle("change");
  dropDown.classList.toggle("show");
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 610) {
    dropDown.classList.remove("show");
    menuBtn.classList.remove("change");
  }
});
