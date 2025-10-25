// server/models/MenuItem.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'] // Added 'Specials'
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Food+Item'
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
