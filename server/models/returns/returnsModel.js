import mongoose from "mongoose";

const returnsSchema = new mongoose.Schema(
  {
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        require: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        require: true   
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    reason:{
        type: String,
        require: true
    },
    images:{
        type: Array,
        default: []
    },
    status:{
        type: String,
        default: "pending"
    },
    message:{
        type: String,
        require: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("Returns", returnsSchema);
