import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import Product from '../models/Product.js';

const orderRoutes = express.Router();

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice, paymentDetails, userInfo } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items.');
  } else {
    const order = new Order({
      orderItems,
      user: userInfo._id,
      username: userInfo.name,
      email: userInfo.email,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Update product stock after order is created
    for (const item of orderItems) {
      const product = await Product.findById(item.id);
      if (product) {
        product.stock = product.stock - item.qty;
        if (product.stock < 0) {
          product.stock = 0; 
        }
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

const getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
};

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found.');
  }
});

const setDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order could not be updated.');
  }
});

orderRoutes.route('/').post(authMiddleware, createOrder);
orderRoutes.route('/:id').delete(authMiddleware, adminMiddleware, deleteOrder);
orderRoutes.route('/:id').put(authMiddleware, adminMiddleware, setDelivered);
orderRoutes.route('/').get(authMiddleware, adminMiddleware, getOrders);

export default orderRoutes;
