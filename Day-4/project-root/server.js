const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Le serveur tourne sur le port ${PORT}`));
