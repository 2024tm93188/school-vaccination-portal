const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/user.model');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      password: 'password123',
      role: 'admin'
    });
    
    // Create coordinator user
    const coordinatorUser = new User({
      username: 'coordinator',
      password: 'password123',
      role: 'coordinator'
    });
    
    await adminUser.save();
    await coordinatorUser.save();
    
    console.log('Database seeded successfully!');
    console.log('Admin credentials: username: admin, password: password123');
    console.log('Coordinator credentials: username: coordinator, password: password123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();