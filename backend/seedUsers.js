const mongoose = require('mongoose');
const User = require('./models/user.model'); // adjust path as needed

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seed = async () => {
  try {
    const existing = await User.findOne({ username: 'coordinator' });
    if (existing) {
      console.log('Users already exist');
      return mongoose.disconnect();
    }

    const users = [
      {
        username: 'coordinator',
        name: 'Coordinator User',
        role: 'coordinator',
        password: 'password123',
      },
    ];

    await User.insertMany(users);
    console.log('Seeded users:', users);
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.disconnect();
  }
};

seed();
