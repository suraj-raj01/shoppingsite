
import { Router } from "express";
const router = Router();
import { createOrder, deleteOrder, getOrder, getOrderById, getOrderView, verifyPayment } from "../../controllers/payments/paymentControllers.js";
import { getInvoice } from "../../controllers/payments/invoiceController.js";

//Creating Order
router.post("/orders", createOrder);
//Verifying the payment
router.post("/verify", verifyPayment);
//get all orders
router.get("/orders", getOrder);
//get order by id
router.get("/orders/:id", getOrderById);
// get order view
router.get("/orders/view/:id", getOrderView);
//get invoice by id (order id, invoice number, user id, payment id, order id razorpay, status)
router.get("/invoice/:id", getInvoice);
//delete order
router.delete("/orders/:id", deleteOrder)

export default router;