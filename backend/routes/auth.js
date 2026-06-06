const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Worker = require('../models/Worker');
const { protect } = require('../middleware/auth');

// ── Multer setup ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.fieldname + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, png, webp) are allowed'));
  }
});

const uploadCNIC = upload.fields([
  { name: 'cnicFrontPhoto', maxCount: 1 },
  { name: 'cnicBackPhoto',  maxCount: 1 }
]);

// ── Token generator ───────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

// ── Validators ────────────────────────────────────────────────────────────────
const phoneRegex = /^03[0-9]{9}$/;
const cnicRegex  = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;

// @route  POST /api/auth/register
router.post('/register', uploadCNIC, async (req, res) => {
  try {
    const {
      name, email, password, role,
      phone, city,
      cnic, serviceCategory, experience, description
    } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error. Contact admin.' });
    }

    const cleanPhone = phone ? phone.replace(/-/g, '').trim() : '';
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        message: 'Phone must be a valid Pakistani number (03XXXXXXXXX) — 11 digits.'
      });
    }

    const phoneExists = await User.findOne({ phone: cleanPhone });
    if (phoneExists) {
      return res.status(400).json({
        message: `This phone number is already registered as a ${phoneExists.role}. One person can only have one account.`
      });
    }

    if (email && email.trim() !== '') {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
    }

    if (role === 'worker') {
      if (!cnic || !cnicRegex.test(cnic)) {
        return res.status(400).json({ message: 'CNIC must be in format: XXXXX-XXXXXXX-X (13 digits).' });
      }
      if (!serviceCategory || experience === undefined || experience === '') {
        return res.status(400).json({ message: 'Service category and experience are required for workers.' });
      }
      const cnicFrontPhoto = req.files?.cnicFrontPhoto?.[0]?.filename || '';
      const cnicBackPhoto  = req.files?.cnicBackPhoto?.[0]?.filename  || '';
      if (!cnicFrontPhoto || !cnicBackPhoto) {
        return res.status(400).json({ message: 'Both CNIC front and back photos are required for worker registration.' });
      }
    }

    const user = await User.create({
      name,
      email: email && email.trim() !== '' ? email.toLowerCase().trim() : undefined,
      password,
      role: role || 'customer',
      phone: cleanPhone,
      city
    });

    if (role === 'worker') {
      const cnicFrontPhoto = req.files?.cnicFrontPhoto?.[0]?.filename || '';
      const cnicBackPhoto  = req.files?.cnicBackPhoto?.[0]?.filename  || '';
      await Worker.create({
        userId: user._id,
        cnic,
        serviceCategory,
        experience: Number(experience),
        description: description || '',
        cnicFrontPhoto,
        cnicBackPhoto
      });
    }

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      phone: user.phone,
      city:  user.city,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide phone/email and password.' });
    }

    const isPhone = phoneRegex.test(identifier.replace(/-/g, '').trim());
    const query   = isPhone
      ? { phone: identifier.replace(/-/g, '').trim() }
      : { email: identifier.toLowerCase().trim() };

    const user = await User.findOne(query);

    if (user && (await user.matchPassword(password))) {
      let workerData = null;
      if (user.role === 'worker') {
        workerData = await Worker.findOne({ userId: user._id });
      }
      res.json({
        _id:           user._id,
        name:          user.name,
        email:         user.email,
        role:          user.role,
        phone:         user.phone,
        city:          user.city,
        workerProfile: workerData,
        token:         generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Please check your phone/email and password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let workerData = null;
    if (user.role === 'worker') {
      workerData = await Worker.findOne({ userId: user._id });
    }
    res.json({ ...user.toObject(), workerProfile: workerData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  PUT /api/auth/update
// Both customers and workers can update their basic info
router.put('/update', protect, async (req, res) => {
  try {
    const { name, email, city, password, newPassword, experience, description } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // ── Verify current password before allowing any update ──
    if (!password) {
      return res.status(400).json({ message: 'Please enter your current password to save changes.' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // ── Update name ──
    if (name && name.trim() !== '') user.name = name.trim();

    // ── Update email (check uniqueness) ──
    if (email && email.trim() !== '') {
      const emailTaken = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: user._id } });
      if (emailTaken) return res.status(400).json({ message: 'This email is already used by another account.' });
      user.email = email.toLowerCase().trim();
    }

    // ── Update city ──
    if (city && city.trim() !== '') user.city = city.trim();

    // ── Update password ──
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' });
      }
      user.password = newPassword; // pre-save hook will hash it
    }

    await user.save();

    // ── Update worker-specific fields ──
    if (user.role === 'worker') {
      const worker = await Worker.findOne({ userId: user._id });
      if (worker) {
        if (experience !== undefined && experience !== '') worker.experience = Number(experience);
        if (description !== undefined) worker.description = description;
        await worker.save();
      }
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      phone: user.phone,
      city:  user.city,
      message: 'Profile updated successfully!'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;