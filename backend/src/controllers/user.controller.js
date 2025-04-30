const User = require('../models/user.model');

// Tüm kullanıcıları getir (Admin için)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Tek kullanıcıyı ID'ye göre getir
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Kullanıcı bilgilerini güncelle
exports.updateUser = async (req, res) => {
  try {
    // Parola güncelleme işlemi bu endpoint üzerinden yapılmaz
    if (req.body.password) {
      delete req.body.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Kullanıcı sil
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Teknisyenleri getir
exports.getTechnicians = async (req, res) => {
  try {
    const { expertise, city, isAvailable } = req.query;
    
    // Filtre oluştur
    const filter = { role: 'technician' };
    
    // Uzmanlık alanına göre filtreleme
    if (expertise) {
      filter.expertise = { $in: [expertise] };
    }
    
    // Şehre göre filtreleme
    if (city) {
      filter['address.city'] = city;
    }
    
    // Uygunluk durumuna göre filtreleme
    if (isAvailable) {
      filter.isAvailable = isAvailable === 'true';
    }
    
    const technicians = await User.find(filter).select('-password');
    
    res.status(200).json({
      success: true,
      count: technicians.length,
      technicians
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Kullanıcının şifresini güncelle
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Kullanıcıyı bul
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    // Mevcut şifreyi kontrol et
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
    }
    
    // Yeni şifreyi ayarla
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Şifre başarıyla güncellendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
}; 