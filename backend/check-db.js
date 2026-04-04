require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pincode')
  .then(async () => {
    const doc = await mongoose.connection.collection('pincodes').findOne();
    if (!doc) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      if (collections.length > 0) {
        const firstCol = collections[0].name;
        const fallbackDoc = await mongoose.connection.collection(firstCol).findOne();
        fs.writeFileSync('out.json', JSON.stringify({
          collectionName: firstCol,
          document: fallbackDoc
        }, null, 2));
      }
    } else {
        fs.writeFileSync('out.json', JSON.stringify({
          collectionName: 'pincodes',
          document: doc
        }, null, 2));
    }
    process.exit(0);
  });
