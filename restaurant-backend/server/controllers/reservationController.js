// server/controllers/reservationController.js
const Reservation = require('../models/Reservation');
const asyncHandler = require('express-async-handler');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = asyncHandler(async (req, res) => {
    const { date, time, guests, specialRequests } = req.body;

    if (!date || !time || !guests) {
        res.status(400);
        throw new Error('Please fill all required fields: date, time, and number of guests');
    }

    const reservation = new Reservation({
        userId: req.user._id, // User ID from protect middleware
        date: new Date(date), // Ensure date is stored as a Date object
        time,
        guests,
        specialRequests,
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
});

// @desc    Get reservations for logged-in user
// @route   GET /api/reservations/my
// @access  Private
const getMyReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ userId: req.user._id }).sort({ date: 1, time: 1 });
    res.json(reservations);
});

// @desc    Get all reservations (Admin only)
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({}).populate('userId', 'username email').sort({ date: 1, time: 1 });
    res.json(reservations);
});

// @desc    Update reservation status (Admin only) or allow user to cancel
// @route   PUT /api/reservations/:id
// @access  Private (User can cancel, Admin can change status)
const updateReservation = asyncHandler(async (req, res) => {
    const { status } = req.body; // Only status can be updated by admin
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        // Allow user to cancel their own reservation
        if (req.user._id.toString() === reservation.userId.toString() && status === 'cancelled') {
            reservation.status = status;
        } else if (req.user.isAdmin && status) { // Admin can change any status
            reservation.status = status;
        } else {
            res.status(403);
            throw new Error('Not authorized to update this reservation status');
        }

        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    } else {
        res.status(404);
        throw new Error('Reservation not found');
    }
});

// @desc    Delete a reservation (Admin only)
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
const deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        await Reservation.deleteOne({ _id: reservation._id });
        res.json({ message: 'Reservation removed' });
    } else {
        res.status(404);
        throw new Error('Reservation not found');
    }
});

module.exports = {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservation,
    deleteReservation,
};
