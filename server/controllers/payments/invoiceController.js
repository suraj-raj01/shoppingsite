import Invoice from "../../models/payments/invoiceModel.js";
import Product from "../../models/products/productModel.js";


// get invoice by id
export const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id,'id')
        const invoice = await Invoice.findOne({
            $or: [
                { orderId: id },
                { invoiceNumber: id },
                { userId: id },
                { paymentId: id },
                { orderIdRazorpay: id },
                { status: id },
            ]
        }).populate({
            path: 'items.productId',
            select: 'name images',
        }).populate('userId','name email').populate('orderId','paymentStatus')
        // console.log(invoice,'invoice')
        res.status(200).json({ data: invoice , success:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const generateInvoice = async (order) => {
    try {

        // 🔥 check if invoice already exists
        const existing = await Invoice.findOne({ orderId: order._id });
        if (existing) return existing;

        // 🔥 generate unique invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 🔥 populate product details
        const items = await Promise.all(
            order.items.map(async (item) => {
                const product = await Product.findById(item.productId);
                    return {
                    productId: item.productId,
                    name: product?.name || "Product",
                    quantity: item.quantity,
                    price: item.price,
                    total: item.quantity * item.price,
                };
            })
        );

        const invoice = await Invoice.create({
            orderId: order._id,
            userId: order.userId,
            invoiceNumber,
            items,
            totalAmount: order.totalAmount,
            paymentId: order.razorpay_payment_id,
            orderIdRazorpay: order.razorpay_order_id,
            billingAddress: order.shippingAddress,
            status: "paid",
        });

        return invoice;

    } catch (error) {
        console.error("Invoice generation failed:", error);
        throw error;
    }
};