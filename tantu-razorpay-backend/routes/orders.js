import express from 'express';
import Order from '../models/Order.js';
import { sendOrderEmail, sendAdminNotification } from '../config/emailService.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;
    const orderNumber = `TT${Date.now()}`;
    const order = new Order({ orderNumber, customer, items, totalAmount, paymentMethod });
    await order.save();

    // Send emails to customer and admin
    await sendOrderEmail(customer.email, orderNumber, customer.name, totalAmount);
    await sendAdminNotification(orderNumber, customer.name, totalAmount);
    
    res.json({ success: true, orderNumber: order.orderNumber, orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;