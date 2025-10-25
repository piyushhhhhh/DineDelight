// server/controllers/menuController.js
const MenuItem = require('../models/MenuItem');
const asyncHandler = require('express-async-handler');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
});

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        res.json(menuItem);
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

// @desc    Add a new menu item
// @route   POST /api/menu
// @access  Private/Admin
const addMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, imageUrl, available } = req.body;

    if (!name || !description || !price || !category) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        imageUrl,
        available: available !== undefined ? available : true,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, imageUrl, available } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price || menuItem.price;
        menuItem.category = category || menuItem.category;
        menuItem.imageUrl = imageUrl || menuItem.imageUrl;
        menuItem.available = available !== undefined ? available : menuItem.available;

        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        await MenuItem.deleteOne({ _id: menuItem._id }); // Use deleteOne
        res.json({ message: 'Menu item removed' });
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

module.exports = {
    getMenuItems,
    getMenuItemById,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
};
