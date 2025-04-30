// Hata işleyici middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose hatalı ID
  if (err.name === 'CastError') {
    const message = `Geçersiz ID: ${err.value}`;
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Bu e-posta adresi zaten kullanılıyor';
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Sunucu hatası'
  });
};

module.exports = errorHandler; 