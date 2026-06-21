import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categories: {
      type: String,
      required: true,
      trim: true,
    },
    categoriesImg: {
      type: String,
    },
    subcategories: [
      {
        name: {
          type: String,
        },
        brands: [{
          type: String,
        }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
