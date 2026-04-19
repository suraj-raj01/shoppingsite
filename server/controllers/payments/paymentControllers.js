import Razorpay from "razorpay";
import crypto from "crypto";
import Orders from "../../models/payments/orderModel.js"
import { generateInvoice } from "./invoiceController.js";

export const createOrder = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);

        const items = data.product.map((item) => ({
            productId: item._id,
            quantity: item.qnty || 1,
            price: item.price,
        }));

        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        // ✅ Create Razorpay order FIRST
        const options = {
            amount: data.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const razorpayOrder = await instance.orders.create(options);

        // ✅ Now create DB order with razorpay_order_id
        const order = await Orders.create({
            userId: data.id,
            items,
            totalAmount: data.amount,
            shippingAddress: data.shippingaddress,
            razorpay_order_id: razorpayOrder.id,
            paymentStatus: "pending",
        });

        res.status(200).json({
            success: true,
            order: razorpayOrder,
            dbOrderId: order._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error!",
            success: false,
        });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // ✅ validate body
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                message: "Missing payment details",
                success: false,
            });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const resultSign = crypto
            .createHmac("sha256", process.env.KEY_SECRET)
            .update(sign)
            .digest("hex");

        const isValid = razorpay_signature === resultSign;

        // ✅ Update order
        const order = await Orders.findOneAndUpdate(
            { razorpay_order_id },
            {
                $set: {
                    razorpay_payment_id,
                    razorpay_signature,
                    paymentStatus: isValid ? "success" : "failed",
                },
            }
        );

        // // Invoice Generator function.
        let invoice = null;
        if (isValid && order) {
            invoice = await generateInvoice(order);
        }

        return res.status(isValid ? 200 : 400).json({
            message: isValid
                ? "Payment verified successfully & invoice generated"
                : "Payment failed",
            success: isValid,
            invoice: invoice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error!",
            success: false,
        });
    }
}

export const getOrder = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const orders = await Orders.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Orders.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: orders,
            currentPage: page,
            totalPages: totalPages,
            totalOrders: total
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const orders = await Orders.find({ userId: id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Orders.countDocuments({ userId: id });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: orders,
            currentPage: page,
            totalPages: totalPages,
            totalOrders: total
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const getOrderView = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Orders.findById(id);
        res.status(200).json({ data: order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Orders.findByIdAndDelete(id);
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
