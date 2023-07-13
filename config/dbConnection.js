const mongoose = require('mongoose');

const userDBUri = 'mongodb+srv://vedant:165%40Deepali@usercluster.szehesc.mongodb.net/UserDB?retryWrites=true&w=majority';
const connectDb = async () => {
  try {
    await mongoose.connect(userDBUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to userdb');
  } catch (error) {
    console.error('Failed to connect to databases:', error);
  }
};

module.exports = connectDb;
