const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@apnakarigar.com' });
  if (existing) {
    console.log('Admin already exists. Email: admin@apnakarigar.com');
    process.exit(0);
  }

  await User.create({
    name: 'Apna Karigar Admin',
    email: 'admin@apnakarigar.com',
    password: 'admin123',
    role: 'admin',
    phone: '0300-0000000',
    city: 'Karachi'
  });

  console.log('');
  console.log('Admin user created successfully!');
  console.log('Email:    admin@apnakarigar.com');
  console.log('Password: admin123');
  console.log('');
  process.exit(0);
};

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
