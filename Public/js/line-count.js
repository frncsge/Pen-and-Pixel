const paragraph = document.querySelectorAll(".blog-post-description");
const articleWrapper = document.getElementById("article-wrapper");

paragraph.forEach((p) => {
  const style = window.getComputedStyle(p);
  const lineHeight = parseFloat(style.lineHeight);
  const height = p.offsetHeight;
  const numberOfLines = Math.round(height / lineHeight);

  const readMoreBtn = p.closest(".blog-post").querySelector(".read-more-btn");

  if (numberOfLines >= 5) {
    p.classList.add("see-more");
    readMoreBtn.style.display = "block";
  }
});

articleWrapper.addEventListener("click", (event) => {
  if (event.target.classList.contains("read-more-btn")) {
    const p = event.target
      .closest(".blog-post")
      .querySelector(".blog-post-description");

    p.classList.toggle("see-more");

    event.target.innerHTML = p.classList.contains("see-more")
      ? "Read more"
      : "Read less";
  }
});
