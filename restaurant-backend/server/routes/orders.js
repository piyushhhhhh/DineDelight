// server/routes/orders.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createOrder) // Protected
    .get(protect, admin, getAllOrders); // Admin only to get all orders

router.route('/pastOrders')
    .get(protect, getMyOrders); // Protected, get user's orders

router.route('/item/:id')
    .get(protect, getOrderById) // Protected (user can get their own, admin can get any)
    .put(protect, admin, updateOrderStatus) // Admin only
    .delete(protect, admin, deleteOrder); // Admin only

module.exports = router;
