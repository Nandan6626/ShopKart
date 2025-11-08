const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected user routes
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Admin only routes
router.route('/')
  .get(protect, admin, getAllUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;