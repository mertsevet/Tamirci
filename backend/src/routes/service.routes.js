const express = require('express');
const serviceController = require('../controllers/service.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Servis talebi oluştur
router.post('/', protect, authorize('customer'), serviceController.createService);

// Tüm servis taleplerini getir
router.get('/', protect, serviceController.getAllServices);

// Servis detayını getir
router.get('/:id', protect, serviceController.getServiceById);

// Servis talebini güncelle
router.put('/:id', protect, serviceController.updateService);

// Servis talebini iptal et
router.put('/:id/cancel', protect, serviceController.cancelService);

// Servis talebini tamamla
router.put('/:id/complete', protect, authorize('technician'), serviceController.completeService);

// Servis talebine teknisyen ata
router.put('/:id/assign', protect, serviceController.assignTechnician);

// Servise değerlendirme ekle
router.post('/:id/rate', protect, authorize('customer'), serviceController.rateService);

module.exports = router; 