const lightBox = document.getElementById("light-box");
const lightBoxImg = document.getElementById("light-box-img");

function zoomImage(image) {
  const imgSrc = image.src;

  lightBox.style.display = "flex";
  lightBoxImg.src = imgSrc;
  document.body.style.overflow = "hidden";
}

function exitLightBox() {
  lightBox.style.display = "none";
  document.body.style.overflowY = "visible";
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    exitLightBox();
  }
});
