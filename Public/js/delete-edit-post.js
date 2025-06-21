const editBlogModal = document.getElementById("edit-blog-modal");
const editFormTitle = document.getElementById("edit-form-title");
const editImgPreviewContainer = document.getElementById(
  "edit-img-preview-container"
);
const editImgPreview = document.getElementById("edit-img-preview");
const editTitleTextCount = document.getElementById("edit-title-text-count");
const exitEditModalBtn = document.getElementById("exit-edit-modal-container");

const saveBtn = document.getElementById("save-btn");

const article_wrapper = document.getElementById("article-wrapper");
const deleteMethod = "DELETE";
const patchMethod = "PATCH";

let nOfTitleChar;
let nOfContentChar;

const editQuill = new Quill("#edit-blog-editor", {
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

function sendDeleteReq(id, typeOfMethod) {
  fetch(`/post/${id}`, {
    //used fetch to fire up a delete request in my experss server
    method: typeOfMethod,
  }).then((response) => {
    if (response.ok) {
      window.location.reload();
    }
  });
}

function sendPatchReq(id, typeOfMethod) {
  fetch(`/post/${id}`, {
    //used fetch to fire up a delete request in my experss server
    method: typeOfMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      updatedTitle: editFormTitle.value,
      updatedContent: editQuill.root.innerHTML,
    }),
  }).then((response) => {
    if (response.ok) {
      window.location.reload();
    }
  });
}

function openEditBlogModal() {
  removeScrollBar(); //this function is located in text-editor.js

  editBlogModal.style.display = "flex";
  editBlogModal.classList.add("fade-in");
  editFormTitle.focus();

  //purpose of these 2 lines is to display how many characters there are in the blog post title
  nOfTitleChar = editFormTitle.value.trim().length;
  editTitleTextCount.innerHTML = nOfTitleChar;
}

article_wrapper.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn = e.target.closest(".edit-btn");

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;

    Swal.fire({
      //i used an npm called swal fire to replace the built in promt() or confirm()!
      title: "Just to be clear...",
      text: "Are you sure you want to delete this post?",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#dc3545",
      denyButtonText: "No",
      denyButtonColor: "#28a745",
    }).then((res) => {
      if (res.isConfirmed) {
        sendDeleteReq(id, deleteMethod);
      }
    });
  } else if (editBtn) {
    const id = editBtn.dataset.id;
    const parsedId = parseInt(id);

    // fetched the blogPostArr so I can use it
    fetch("/api/blogPosts")
      .then((res) => res.json())
      .then((data) => {
        //locate the index of the post using its id
        const blogPostIndex = data.findIndex(
          (blogPost) => blogPost.id === parsedId
        );

        function isChanged() {
          if (
            editFormTitle.value === data[blogPostIndex].title &&
            editQuill.root.innerHTML === data[blogPostIndex].content
          ) {
            return false;
          } else {
            return true;
          }
        }

        function resetBodyAfterModal() {
          editBlogModal.style.display = "none ";
          document.body.style.overflowY = "visible";
          document.body.style.overflowX = "hidden";
          document.body.style.paddingRight = 0;
        }

        //this is the function that double checks if the user wants to exit the modal (they loose what they changed without saving)
        function exitEditModal() {
          if (!isChanged()) {
            resetBodyAfterModal();
          } else {
            Swal.fire({
              title: "Exit without saving?",
              text: "The changes you made will be lost if you leave.",
              icon: "warning",
              showDenyButton: true,
              confirmButtonText: "Yes, exit",
              confirmButtonColor: "#dc3545",
              denyButtonText: "No, stay",
              denyButtonColor: "#28a745",
            }).then((res) => {
              if (res.isConfirmed) {
                resetBodyAfterModal();
              }
            });
          }
        }

        //i put the value of the title, image src, and the content of the blog post that the user wants to edit (the image cannot be edited by the user though)
        editFormTitle.value = data[blogPostIndex].title;
        if (data[blogPostIndex].img !== "") {
          editImgPreview.src = data[blogPostIndex].img;
          editImgPreviewContainer.style.display = "flex";
        } else if (data[blogPostIndex].img === "") {
          editImgPreviewContainer.style.display = "none";
        }
        editQuill.root.innerHTML = data[blogPostIndex].content;

        //opens the modal after putting all the necessary values
        openEditBlogModal();

        //closes the modal when user clicks the X button
        exitEditModalBtn.addEventListener("click", exitEditModal);

        //purpose of this is to exit the edit-blog-post modal when user presses the ESC key
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && editBlogModal.style.display === "flex") {
            exitEditModal();
          }
        });

        //this is when the "Save Changes" button is clicked. It fires up the patch request using the fetch method
        saveBtn.addEventListener("click", () => {
          sendPatchReq(id, patchMethod);
        });

        editFormTitle.addEventListener("input", () => {
          //purpose of this is to count how many characters are inputted in the blog title
          nOfTitleChar = editFormTitle.value.trim().length;

          editTitleTextCount.innerHTML = nOfTitleChar;
          if (nOfTitleChar >= 70) {
            editTitleTextCount.style.color = "red";
          } else {
            editTitleTextCount.style.color = "black";
          }

          if (isChanged()) {
            saveBtn.disabled = false;
          } else {
            saveBtn.disabled = true;
          }
        });

        editQuill.on("text-change", () => {
          if (isChanged()) {
            saveBtn.disabled = false;
          } else {
            saveBtn.disabled = true;
          }
        });
      });
  }
});
