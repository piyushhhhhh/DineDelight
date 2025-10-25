// server/controllers/orderController.js
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem'); // To validate menu items
const asyncHandler = require('express-async-handler');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { items, orderType, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Validate menu items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem) {
            res.status(404);
            throw new Error(`Menu item not found: ${item.menuItemId}`);
        }
        if (!menuItem.available) {
            res.status(400);
            throw new Error(`${menuItem.name} is currently not available.`);
        }

        orderItems.push({
            menuItemId: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: item.quantity,
        });
        totalAmount += menuItem.price * item.quantity;
    }

    const order = new Order({
        userId: req.user._id, // User ID from protect middleware
        items: orderItems,
        totalAmount,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        status: 'pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get orders for logged-in user
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
    res.json(orders);
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('userId', 'username email').sort({ orderDate: -1 });
    res.json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (User can get their own, Admin can get any)
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('userId', 'username email');

    if (order) {
        // Check if user is admin or the owner of the order
        if (req.user.isAdmin || order.userId._id.toString() === req.user._id.toString()) {
            res.json(order);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Delete an order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await Order.deleteOne({ _id: order._id });
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
};
