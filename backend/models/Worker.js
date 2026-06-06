const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cnic: { type: String, required: true, unique: true },
  serviceCategory: {
    type: String,
    enum: ['Electrician', 'Plumber', 'Welder', 'Carpenter'],
    required: true
  },
  experience: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  cnicFrontPhoto: { type: String, default: '' },
  cnicBackPhoto: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Worker', workerSchema);