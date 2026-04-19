import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    razorpay_order_id: {
        type: String,
        required: false
    },
    razorpay_payment_id: {
        type: String,
        required: false
    },
    razorpay_signature: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Orders = mongoose.model("Orders", orderSchema);

export default Orders;
