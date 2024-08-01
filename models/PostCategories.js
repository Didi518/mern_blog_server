import { model, Schema } from "mongoose";

const PostCategoriesSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const PostCategories = model("PostCategories", PostCategoriesSchema);

export default PostCategories;
