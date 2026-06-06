const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { protect, customerOnly } = require('../middleware/auth');

// @route POST /api/reviews
router.post('/', protect, customerOnly, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    if (booking.status !== 'Completed')
      return res.status(400).json({ message: 'Can only review completed bookings' });
    if (booking.hasReview)
      return res.status(400).json({ message: 'You have already reviewed this booking' });

    const review = await Review.create({
      bookingId,
      customerId: req.user._id,
      workerId: booking.workerId,
      rating,
      comment
    });

    booking.hasReview = true;
    await booking.save();

    const allReviews = await Review.find({ workerId: booking.workerId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Worker.findByIdAndUpdate(booking.workerId, { averageRating: Math.round(avg * 10) / 10 });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/reviews/worker/:workerId
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate('customerId', 'name city')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
