const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./src/middleware/error.middleware');
const config = require('./src/config/config');

// Çevre değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const serviceRoutes = require('./src/routes/service.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);

// Ana rota
app.get('/', (req, res) => {
  res.json({ message: 'TAMIRCI API aktif.' });
});

// Hata yönetimi middleware
app.use(errorHandler);

// PORT
const PORT = config.PORT;

// MongoDB bağlantısı
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  }); 