import { model, Schema } from "mongoose";

const PostCategoriesSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const PostCategories = model("PostCategories", PostCategoriesSchema);

export default PostCategories;
