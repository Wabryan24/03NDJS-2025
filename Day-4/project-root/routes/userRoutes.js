const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  register,
  login,
  getMe,
  getUsers,
  deleteUser
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/users', auth, getUsers);
router.delete('/users/:id', auth, deleteUser);

module.exports = router;
