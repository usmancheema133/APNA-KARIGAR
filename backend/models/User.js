const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  // Email is optional but must be unique if provided
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,   // allows multiple documents without email
    lowercase: true,
    trim: true
  },

  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['customer', 'worker', 'admin'], default: 'customer' },

  // Phone is the primary unique identifier — one phone = one account
  phone: { type: String, required: true, unique: true, trim: true },

  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);