import mongoose from 'mongoose';

// User şemasını tanımla
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen bir isim giriniz'],
  },
  email: {
    type: String,
    required: [true, 'Lütfen bir e-posta giriniz'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Lütfen bir şifre giriniz'],
    minlength: [8, 'Şifre en az 8 karakter olmalıdır'],
  },
  image: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Oyuncu bilgileri
  gameProfile: {
    characters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    }],
    gamesPlayed: {
      type: Number,
      default: 0
    },
    lastLogin: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Mongoose modeli mevcut ise onu kullan, değilse yeni model oluştur
export default mongoose.models.User || mongoose.model('User', UserSchema);