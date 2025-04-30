const express = require('express');
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Tüm kullanıcıları getir (Admin için)
router.get('/', protect, authorize('admin'), userController.getAllUsers);

// Teknisyenleri getir
router.get('/technicians', protect, userController.getTechnicians);

// Tek kullanıcıyı ID'ye göre getir
router.get('/:id', protect, userController.getUserById);

// Kullanıcı bilgilerini güncelle
router.put('/:id', protect, userController.updateUser);

// Kullanıcı şifresini güncelle
router.put('/:id/password', protect, userController.updatePassword);

// Kullanıcı sil
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

module.exports = router; 