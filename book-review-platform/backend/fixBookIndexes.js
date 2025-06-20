// Run this script with: node fixBookIndexes.js
// It will drop all text indexes on the books collection and create a single compound text index for search.

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function fixIndexes() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  const books = db.collection('books');

  // Drop all non-_id indexes
  const indexes = await books.indexes();
  for (const idx of indexes) {
    if (idx.name !== '_id_') {
      await books.dropIndex(idx.name);
      console.log(`Dropped index: ${idx.name}`);
    }
  }

  // Create a single compound text index
  await books.createIndex({ title: 'text', author: 'text', description: 'text' });
  console.log('Created compound text index on title, author, description');

  await mongoose.disconnect();
  console.log('Done!');
}

fixIndexes().catch(err => {
  console.error(err);
  process.exit(1);
});
