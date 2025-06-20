import express from "express";
import multer from "multer";
import sanitize from "sanitize-html";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import blogPostArr from "./blogData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const date = new Date();
const currentDate = date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

let idNum = 0; //id number for the blog posts

app.set("view engine", "ejs");
app.use(express.static("Public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const imgUpload = multer({ storage });

app.get("/", (req, res) => {
  res.render("landingpage", { isLandingPage: true });
});

app.get("/home", (req, res) => {
  res.render("homepage", { blogPostArr });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/api/blogPosts", (req, res) => {
  res.json(blogPostArr);
});

app.post("/submit", imgUpload.single("img"), (req, res) => {
  idNum++;

  //purpose of this is to prevent other tags from the user input like <script>, etc.
  const rawUserInput = req.body.content;
  const cleanUserInput = sanitize(rawUserInput, {
    allowedTags: [
      "h2",
      "h3",
      "strong",
      "em",
      "u",
      "ol",
      "ul",
      "li",
      "a",
      "p",
      "br",
      "div",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  const blogPostObj = {
    id: idNum,
    title: req.body.title,
    date: currentDate,
    content: cleanUserInput,
    img: req.file
      ? req.file.path.replace(/^public[\\/]/, "").replace(/\\/g, "/") //puspose ani is to change the path of the image (before: example\file\\blabla after: example/file/blabla)
      : "",
  };

  blogPostArr.unshift(blogPostObj);
  res.redirect("/home");
});

app.delete("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = blogPostArr.findIndex((post) => post.id === postId);
  const imgName = blogPostArr[postIndex].img.replace(/^uploads\//, "");

  if (postIndex === -1) return res.sendStatus(404);

  fs.readdir(__dirname + "/Public/uploads", (err, files) => {
    //purpose of readdir is to look into the uploads directory
    if (err) {
      console.error(err);
      return;
    }

    if (files.includes(imgName)) {
      fs.unlink(__dirname + `/Public/uploads/${imgName}`, (err) => {
        if (err) throw err;
        console.log(__dirname + `/Public/uploads/${imgName}` + " is deleted.");
      });
    } else {
      console.log(`No image was found.`);
    }
  });

  blogPostArr.splice(postIndex, 1);
  res.sendStatus(200);
});

app.patch("/post/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = blogPostArr.findIndex((post) => post.id === id);
  if (postIndex === -1) return res.sendStatus(404);

  const { updatedTitle, updatedContent } = req.body;

  const rawUpdatedContent = updatedContent;
  const cleanUpdatedContent = sanitize(rawUpdatedContent, {
    allowedTags: [
      "h2",
      "h3",
      "strong",
      "em",
      "u",
      "ol",
      "ul",
      "li",
      "a",
      "p",
      "br",
      "div",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  //this updates what the user changed in their blog post
  blogPostArr[postIndex] = {
    ...blogPostArr[postIndex],
    title: updatedTitle,
    content: cleanUpdatedContent,
  };

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});
