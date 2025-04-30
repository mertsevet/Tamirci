// Varsayılan konfigürasyon ayarları
const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tamirci_db',
  JWT_SECRET: process.env.JWT_SECRET || 'tamirci_guvenli_jwt_gizli_anahtar',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config; 