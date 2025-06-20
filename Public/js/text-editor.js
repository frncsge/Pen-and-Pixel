const quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "Write your story here...",
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  },
});

const createBlogBtn = document.getElementById("create-blog-btn");
const createBlogModal = document.getElementById("create-blog-modal");
const titleTextCount = document.getElementById("title-text-count");
const formTitle = document.getElementById("form-title");

const quillContent = document.getElementById("quill-content");
const submitBtn = document.getElementById("submit-btn");

let numberOfChar;
let numberOfChar2;

const addImgBtn = document.getElementById("img-content-input-icon");
const imgInput = document.getElementById("img-content");
const imgPreviewContainer = document.getElementById("img-preview-container");
const imgPreview = document.getElementById("img-preview");
const cancelPreviewBtn = document.getElementById("cancel-preview-btn");

const blogForm = document.getElementById("blog-form");

//removes the scrollbar seamlessly
function removeScrollBar() {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = scrollBarWidth + "px";
}

function confirmModalExit() {
  if (
    numberOfChar > 1 ||
    numberOfChar2 > 1 ||
    imgPreview.src.startsWith("data:")
  ) {
    removeScrollBar();

    Swal.fire({
      //i used an npm called swal fire to replace the built in promt() or confirm()!
      title: "Exit without posting?",
      text: "Your work will be lost if you leave.",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Yes, exit",
      confirmButtonColor: "#dc3545",
      denyButtonText: "No, stay",
      denyButtonColor: "#28a745",
    }).then((res) => {
      if (res.isConfirmed) {
        formTitle.value = "";
        quill.setText("");
        numberOfChar = 0;
        titleTextCount.innerHTML = numberOfChar;
        createBlogModal.style.display = "none";
        document.body.style.overflowY = "visible";
        document.body.style.overflowX = "hidden";
        document.body.style.paddingRight = 0;

        imgPreview.src = "";
        addImgBtn.style.display = "inline-block";
        imgPreviewContainer.style.display = "none";
      }
    });
  } else {
    createBlogModal.style.display = "none";
    document.body.style.overflowY = "visible";
    document.body.style.overflowX = "hidden";
    document.body.style.paddingRight = 0;
  }
}

//exits the modal via X button
function exitModal() {
  confirmModalExit();
}

//exits the modal if user presses esc
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    confirmModalExit();
  }
});

//the create blog modal pops up when clicked
createBlogBtn.addEventListener("click", () => {
  removeScrollBar();

  createBlogModal.style.display = "flex";
  createBlogModal.classList.add("fade-in");
  formTitle.focus();
});

//this is to track the number of the blog title characters!
formTitle.addEventListener("input", () => {
  numberOfChar = formTitle.value.trim().length;

  titleTextCount.innerHTML = numberOfChar;

  if (numberOfChar >= 70) {
    titleTextCount.style.color = "red";
  } else {
    titleTextCount.style.color = "black";
  }
});

//this is to track the number of characters for the descrption input (where you write your blog)
quill.on("text-change", () => {
  numberOfChar2 = quill.getText().trim().length;
});

submitBtn.addEventListener("click", () => {
  quillContent.value = quill.root.innerHTML;
});

//js for handling the image preview below <------- !importent ugh
imgInput.addEventListener("change", (e) => {
  const img = e.target.files[0];

  if (img) {
    const reader = new FileReader();

    reader.onload = (e) => {
      imgPreview.src = e.target.result;
      addImgBtn.style.display = "none";
      imgPreviewContainer.style.display = "flex";
    };

    reader.readAsDataURL(img);
  }
});

cancelPreviewBtn.addEventListener("click", () => {
  imgInput.value = "";
  imgPreview.src = "";
  addImgBtn.style.display = "inline-block";
  imgPreviewContainer.style.display = "none";
});

blogForm.addEventListener("submit", (e) => {
  const textEditor = quill.getText().trim().length;

  if (textEditor === 0) {
    e.preventDefault();

    Swal.fire({
      //i used an npm called swal fire to replace the built in promt() or confirm()
      title: "Blog Post Incomplete 😞",
      text: "Your description is the treasure map — don’t leave readers lost!",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
    });
  }
});
