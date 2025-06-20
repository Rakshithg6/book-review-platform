// Script to delete all reviews by dummy users (Alice Johnson, Brian Lee, Priya Patel)
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Review = require('../models/Review');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Find dummy users
  const emails = [
    'alice.johnson@example.com',
    'brian.lee@example.com',
    'priya.patel@example.com'
  ];
  const users = await User.find({ email: { $in: emails } });
  const userIds = users.map(u => u._id);

  // Delete reviews by these users
  const result = await Review.deleteMany({ user: { $in: userIds } });
  console.log(`Deleted ${result.deletedCount} dummy reviews.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
