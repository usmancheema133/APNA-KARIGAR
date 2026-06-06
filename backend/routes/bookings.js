const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { protect, customerOnly } = require('../middleware/auth');

// @route POST /api/bookings
router.post('/', protect, customerOnly, async (req, res) => {
  try {
    const { workerId, serviceType, scheduledDate, address, notes } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    if (!worker.isVerified) return res.status(400).json({ message: 'Worker is not verified yet' });

    const booking = await Booking.create({
      customerId: req.user._id,
      workerId,
      serviceType,
      scheduledDate,
      address,
      notes: notes || ''
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bookings/my (customer's own bookings)
router.get('/my', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'customer') {
      bookings = await Booking.find({ customerId: req.user._id })
        .populate({ path: 'workerId', populate: { path: 'userId', select: 'name phone city' } })
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ userId: req.user._id });
      if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
      bookings = await Booking.find({ workerId: worker._id })
        .populate('customerId', 'name phone city email')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name phone city email')
      .populate({ path: 'workerId', populate: { path: 'userId', select: 'name phone city' } });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/bookings/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ userId: req.user._id });
      if (!worker || booking.workerId.toString() !== worker._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
      if (!['Confirmed', 'Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Workers can only set: Confirmed, Completed, Cancelled' });
      }
    } else if (req.user.role === 'customer') {
      if (booking.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      if (status !== 'Cancelled') {
        return res.status(400).json({ message: 'Customers can only cancel bookings' });
      }
    }

    booking.status = status;

    if (status === 'Completed') {
      const worker = await Worker.findById(booking.workerId);
      if (worker) {
        worker.totalJobs = (worker.totalJobs || 0) + 1;
        await worker.save();
      }
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/bookings (admin - all bookings)
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const bookings = await Booking.find()
      .populate('customerId', 'name email city')
      .populate({ path: 'workerId', populate: { path: 'userId', select: 'name phone' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
