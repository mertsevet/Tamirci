const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', authController.register);

// Kullanıcı girişi
router.post('/login', authController.login);

// Şifremi unuttum
router.post('/forgot-password', authController.forgotPassword);

// Şifre sıfırlama
router.post('/reset-password', authController.resetPassword);

// Kullanıcı bilgilerini getir
router.get('/me', protect, authController.getMe);

module.exports = router; 