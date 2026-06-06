const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

// @route GET /api/admin/workers/pending
router.get('/workers/pending', protect, adminOnly, async (req, res) => {
  try {
    const workers = await Worker.find({ isVerified: false }).populate('userId', 'name email phone city');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/admin/workers/:id/verify
router.patch('/workers/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body;
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    if (action === 'approve') {
      worker.isVerified = true;
      await worker.save();
      res.json({ message: 'Worker approved successfully', worker });
    } else if (action === 'reject') {
      await User.findByIdAndDelete(worker.userId);
      await Worker.findByIdAndDelete(worker._id);
      res.json({ message: 'Worker rejected and removed' });
    } else {
      res.status(400).json({ message: 'Invalid action. Use approve or reject' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/admin/workers
router.get('/workers', protect, adminOnly, async (req, res) => {
  try {
    const workers = await Worker.find().populate('userId', 'name email phone city createdAt');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/admin/users/:id
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/admin/workers/:id
router.delete('/workers/:id', protect, adminOnly, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    await User.findByIdAndDelete(worker.userId);
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await Worker.countDocuments();
    const verifiedWorkers = await Worker.countDocuments({ isVerified: true });
    const pendingWorkers = await Worker.countDocuments({ isVerified: false });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });
    const totalReviews = await Review.countDocuments();

    res.json({ totalUsers, totalWorkers, verifiedWorkers, pendingWorkers, totalBookings, completedBookings, totalReviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
