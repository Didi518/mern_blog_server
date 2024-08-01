import { v4 as uuidv4 } from "uuid";

import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { uploadPicture } from "../middlewares/uploadPictureMiddleware.js";
import { fileRemover } from "../utils/fileRemover.js";

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "exemple de titre",
      caption: "exemple de description",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });

    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post introuvable");
      next(error);
      return;
    }

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      const { title, caption, slug, body, tags, categories } = JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;
      const updatedPost = await post.save();
      return res.json(updatedPost);
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "Une erreur inconnue est survenue lors du chargement " + err.message
        );
        next(error);
      } else {
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post introuvable");
      return next(error);
    }

    await Comment.deleteMany({ post: post._id });

    return res.json({
      message: "Le post a bien été supprimé",
    });
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost };
