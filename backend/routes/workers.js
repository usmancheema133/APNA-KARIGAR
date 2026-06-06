const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Review = require('../models/Review');
const { protect, workerOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// @route GET /api/workers
router.get('/', async (req, res) => {
  try {
    const { category, city, search } = req.query;
    let workerFilter = { isVerified: true };
    if (category) workerFilter.serviceCategory = category;

    let workers = await Worker.find(workerFilter).populate('userId', 'name phone city email');

    if (city) {
      workers = workers.filter(w => w.userId && w.userId.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (search) {
      const s = search.toLowerCase();
      workers = workers.filter(w =>
        w.userId && (
          w.userId.name.toLowerCase().includes(s) ||
          w.serviceCategory.toLowerCase().includes(s) ||
          w.userId.city.toLowerCase().includes(s)
        )
      );
    }

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/workers/:id
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('userId', 'name phone city email');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const reviews = await Review.find({ workerId: worker._id })
      .populate('customerId', 'name city')
      .sort({ createdAt: -1 });

    res.json({ worker, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/workers/profile
router.put('/profile', protect, workerOnly, async (req, res) => {
  try {
    const { experience, description } = req.body;
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    if (experience !== undefined) worker.experience = experience;
    if (description !== undefined) worker.description = description;
    await worker.save();

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/workers/my/profile
router.get('/my/profile', protect, workerOnly, async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id }).populate('userId', 'name phone city email');
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
