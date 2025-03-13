import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Lütfen tüm gerekli alanları doldurun' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Şifre en az 8 karakter olmalıdır' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: userResponse });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    
    // Check for MongoDB specific errors
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
    }
    
    // Database permission error
    if (error.message && error.message.includes('not allowed to do action')) {
      return res.status(500).json({ 
        message: 'Veritabanı erişim hatası. Lütfen sistem yöneticisiyle iletişime geçin.' 
      });
    }
    
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
}