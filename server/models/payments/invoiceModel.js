import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        name: String,
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],

    totalAmount: Number,
    paymentId: String,
    orderIdRazorpay: String,

    billingAddress: String,

    status: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("invoices", invoiceSchema);