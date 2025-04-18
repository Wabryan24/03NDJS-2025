const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(express.json());

connectDB();

app.use('/api', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
