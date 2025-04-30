const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Kimlik doğrulama kontrolü
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Token'ı header'dan al
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Token yoksa hata döndür
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bu işlem için giriş yapmanız gerekiyor'
      });
    }
    
    try {
      // Token doğrulama
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kullanıcıyı bul
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }
      
      // Kullanıcıyı request'e ekle
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Rol tabanlı erişim kontrolü
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `${req.user.role} rolünün bu işleme erişim izni yok`
      });
    }
    next();
  };
}; 