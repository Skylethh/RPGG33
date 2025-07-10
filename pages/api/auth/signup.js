import { signUp } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  try {
    // Supabase ile kayıt ol
    const authData = await signUp({
      email,
      password,
      username,
      name: username // name yoksa username'i kullan
    });

    res.status(201).json({ 
      message: 'Kayıt başarılı. E-posta adresinize gönderilen bağlantı ile hesabınızı doğrulayın.',
      email,
      user: authData.user
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Hata mesajını belirle
    let errorMessage = 'Sunucu hatası';
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Yaygın hataları kontrol et
    if (error.message && error.message.includes('email')) {
      errorMessage = 'Bu e-posta adresi zaten kullanılıyor';
    }
    
    res.status(500).json({ message: errorMessage });
  }
}