const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/auth-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB est connecté');
  } catch (err) {
    console.error('La connexion a MongoDB a échoué:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
