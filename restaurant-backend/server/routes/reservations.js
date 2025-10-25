// server/routes/reservations.js
const express = require('express');
const router = express.Router();
const {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservation,
    deleteReservation,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReservation) // Protected
    .get(protect, admin, getAllReservations); // Admin only to get all reservations

router.route('/my')
    .get(protect, getMyReservations); // Protected, get user's reservations

router.route('/:id')
    .put(protect, updateReservation) // Protected (user can cancel, admin can update status)
    .delete(protect, admin, deleteReservation); // Admin only

module.exports = router;
