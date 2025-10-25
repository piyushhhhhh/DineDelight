// server/routes/menu.js
const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    getMenuItemById,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMenuItems) // Publicly accessible
    .post(protect, admin, addMenuItem); // Admin only

router.route('/:id')
    .get(getMenuItemById) // Publicly accessible
    .put(protect, admin, updateMenuItem) // Admin only
    .delete(protect, admin, deleteMenuItem); // Admin only

module.exports = router;
