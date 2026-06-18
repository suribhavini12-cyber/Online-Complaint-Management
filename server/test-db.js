require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("FAILURE: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE: Connection Error");
    console.error(err.message);
    if (err.message.includes('ETIMEOUT') || err.message.includes('ServerSelectionError')) {
      console.log("\nTIP: This usually means your IP is not whitelisted in MongoDB Atlas.");
      console.log("Go to 'Network Access' in Atlas and add your current IP.");
    }
    process.exit(1);
  });

