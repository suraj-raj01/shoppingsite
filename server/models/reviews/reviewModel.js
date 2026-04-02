import mongoose from "mongoose";

const reviewShema = new mongoose.Schema(
  {
    ratings:{
        type: Number,
        require: true
    },
    message:{
        type: String,
        require: true
    },
    images:{
        type: Array,
        default: []
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        require: true   
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reviews", reviewShema);
