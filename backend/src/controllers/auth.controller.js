const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    // E-posta kontrolü
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu e-posta adresi zaten kullanılıyor' 
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'customer'
    });

    if (user) {
      // Başarılı kayıt, token oluştur
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // E-posta ve şifre kontrolü
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen e-posta ve şifre girin'
      });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Şifremi unuttum
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı'
      });
    }

    // Burada normalde bir şifre sıfırlama tokeni oluşturulur ve e-posta gönderilir
    // Şimdilik sadece bir onay kodu oluşturalım
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash tokeni ve veritabanına kaydet
    const resetPasswordToken = await bcrypt.hash(resetToken, 10);
    
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 saat
    
    await user.save();

    // Gerçek uygulamada burada e-posta gönderimi yapılır
    res.status(200).json({
      success: true,
      message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi',
      // Sadece geliştirme amaçlı, gerçek projede bu bilgi gönderilmez
      resetToken: resetToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Şifre sıfırlama
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // E-posta ile kullanıcıyı bul
    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı'
      });
    }

    // Token doğrulaması
    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz şifre sıfırlama kodu'
      });
    }

    // Yeni şifreyi ayarla
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Şifreniz başarıyla değiştirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error.message
    });
  }
};

// Kullanıcı bilgilerini getir
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

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