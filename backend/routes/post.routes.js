import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import {
  createPost,
  getPost,
  like,
  comment,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.post("/create", isAuth, upload.single("image"), createPost);
postRouter.get("/getpost", isAuth, getPost);
postRouter.get("/like/:postId", isAuth, like);
postRouter.post("/comment/:id", isAuth, comment);

export default postRouter;
