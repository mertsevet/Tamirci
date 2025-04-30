const Service = require('../models/service.model');
const User = require('../models/user.model');

// Yeni servis talebi oluştur
exports.createService = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      location, 
      urgency,
      images 
    } = req.body;

    // Kullanıcı ID'si
    const customerId = req.user.id;

    // Müşteri mi kontrol et
    const user = await User.findById(customerId);
    
    if (!user || user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Sadece müşteriler servis talebi oluşturabilir'
      });
    }

    // Yeni servis oluştur
    const service = await Service.create({
      title,
      description,
      category,
      customerId,
      location,
      urgency: urgency || 'orta',
      images: images || [],
      status: 'beklemede'
    });

    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Tüm servisleri getir
exports.getAllServices = async (req, res) => {
  try {
    // Filtreleme seçenekleri
    const { category, status, city } = req.query;
    
    // Filtre nesnesi
    const filter = {};
    
    // Kategori filtresi
    if (category) {
      filter.category = category;
    }
    
    // Durum filtresi
    if (status) {
      filter.status = status;
    }
    
    // Şehir filtresi
    if (city) {
      filter['location.city'] = city;
    }
    
    // Kullanıcı rolüne göre filtreleme
    if (req.user.role === 'customer') {
      // Müşteriler sadece kendi taleplerini görebilir
      filter.customerId = req.user.id;
    } else if (req.user.role === 'technician') {
      // Teknisyenler atanan veya bekleyen talepleri görebilir
      filter.$or = [
        { technicianId: req.user.id },
        { status: 'beklemede' }
      ];
    }
    // Admin tüm talepleri görebilir
    
    const services = await Service.find(filter)
      .populate('customerId', 'firstName lastName email phone')
      .populate('technicianId', 'firstName lastName email phone expertise rating');
    
    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Servis detayını getir
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('customerId', 'firstName lastName email phone')
      .populate('technicianId', 'firstName lastName email phone expertise rating');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servis talebi bulunamadı'
      });
    }
    
    // Erişim kontrolü
    const user = req.user;
    
    if (user.role === 'customer' && service.customerId._id.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu servis talebine erişim izniniz yok'
      });
    }
    
    if (user.role === 'technician' && 
        service.status !== 'beklemede' && 
        service.technicianId?._id.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bu servis talebine erişim izniniz yok'
      });
    }
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Servis talebini güncelle
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servis talebi bulunamadı'
      });
    }
    
    // Sadece talep sahibi müşteri veya atanan teknisyen güncelleme yapabilir
    const user = req.user;
    
    if (user.role === 'customer' && service.customerId.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sadece talebi oluşturan müşteri güncelleyebilir'
      });
    }
    
    if (user.role === 'technician' && service.technicianId?.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sadece atanan teknisyen güncelleyebilir'
      });
    }
    
    // Güncelleme
    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('customerId', 'firstName lastName email phone')
      .populate('technicianId', 'firstName lastName email phone expertise rating');
    
    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Servis talebini iptal et
exports.cancelService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servis talebi bulunamadı'
      });
    }
    
    // Sadece müşteri veya admin iptal edebilir
    if (req.user.role === 'customer' && service.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sadece talebi oluşturan müşteri iptal edebilir'
      });
    }
    
    // Tamamlanmış talepler iptal edilemez
    if (service.status === 'tamamlandi') {
      return res.status(400).json({
        success: false,
        message: 'Tamamlanmış bir talebi iptal edemezsiniz'
      });
    }
    
    service.status = 'iptal_edildi';
    await service.save();
    
    res.status(200).json({
      success: true,
      message: 'Servis talebi iptal edildi',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Servis talebini tamamla
exports.completeService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servis talebi bulunamadı'
      });
    }
    
    // Sadece atanan teknisyen tamamlayabilir
    if (req.user.role === 'technician' && service.technicianId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sadece atanan teknisyen tamamlayabilir'
      });
    }
    
    // İptal edilmiş talepler tamamlanamaz
    if (service.status === 'iptal_edildi') {
      return res.status(400).json({
        success: false,
        message: 'İptal edilmiş bir talebi tamamlayamazsınız'
      });
    }
    
    service.status = 'tamamlandi';
    service.completedAt = Date.now();
    await service.save();
    
    // Teknisyenin tamamlanan iş sayısını güncelle
    await User.findByIdAndUpdate(service.technicianId, {
      $inc: { completedJobs: 1 }
    });
    
    res.status(200).json({
      success: true,
      message: 'Servis talebi tamamlandı',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Servis talebine teknisyen ata
exports.assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servis talebi bulunamadı'
      });
    }
    
    // Teknisyen kontrolü
    const technician = await User.findById(technicianId);
    
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz teknisyen'
      });
    }
    
    // Admin veya atama yapan teknisyen olmalı
    if (req.user.role !== 'admin' && req.user.id !== technicianId) {
      return res.status(403).json({
        success: false,
        message: 'Bu işleme izniniz yok'
      });
    }
    
    // Talep beklemede olmalı
    if (service.status !== 'beklemede') {
      return res.status(400).json({
        success: false,
        message: 'Sadece bekleyen talepler atanabilir'
      });
    }
    
    service.technicianId = technicianId;
    service.status = 'atandi';
    await service.save();
    
    res.status(200).json({
      success: true,
      message: 'Teknisyen başarıyla atandı',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Servise değerlendirme ekle
exports.rateService = async (req, res) => {
  try {
    const { score, comment } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servis talebi bulunamadı'
      });
    }
    
    // Sadece hizmeti alan müşteri değerlendirme yapabilir
    if (service.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Sadece hizmeti alan müşteri değerlendirme yapabilir'
      });
    }
    
    // Talep tamamlanmış olmalı
    if (service.status !== 'tamamlandi') {
      return res.status(400).json({
        success: false,
        message: 'Sadece tamamlanmış talepler değerlendirilebilir'
      });
    }
    
    // Daha önce değerlendirme yapılmış mı?
    if (service.rating && service.rating.score) {
      return res.status(400).json({
        success: false,
        message: 'Bu talep zaten değerlendirilmiş'
      });
    }
    
    // Değerlendirme ekle
    service.rating = {
      score,
      comment,
      createdAt: Date.now()
    };
    
    await service.save();
    
    // Teknisyen puanını güncelle
    const technician = await User.findById(service.technicianId);
    
    if (technician) {
      // Mevcut tüm değerlendirmeleri bul
      const completedServices = await Service.find({
        technicianId: service.technicianId,
        status: 'tamamlandi',
        'rating.score': { $exists: true }
      });
      
      // Ortalama puanı hesapla
      const totalRating = completedServices.reduce((sum, service) => sum + service.rating.score, 0);
      const avgRating = totalRating / completedServices.length;
      
      // Teknisyen puanını güncelle
      technician.rating = parseFloat(avgRating.toFixed(1));
      await technician.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Değerlendirme başarıyla eklendi',
      service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
}; 