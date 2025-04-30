const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Hizmet başlığı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Hizmet açıklaması zorunludur'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: [
      'ev_aletleri',
      'elektronik',
      'bilgisayar',
      'telefon',
      'elektrik',
      'su_tesisati',
      'mobilya',
      'isi_sistemleri',
      'beyaz_esya',
      'diger'
    ]
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['beklemede', 'atandi', 'devam_ediyor', 'tamamlandi', 'iptal_edildi'],
    default: 'beklemede'
  },
  location: {
    address: String,
    city: {
      type: String,
      required: [true, 'Şehir bilgisi zorunludur']
    },
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  price: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  },
  urgency: {
    type: String,
    enum: ['dusuk', 'orta', 'yuksek'],
    default: 'orta'
  },
  images: [String],
  rating: {
    score: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 