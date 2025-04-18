const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connexion à MongoDB Atlas réussie');
  } catch (err) {
    console.error('Erreur de connexion MongoDB Atlas:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
