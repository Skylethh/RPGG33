import { signIn } from '../../../lib/supabase';
import { setAuthCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { emailOrUsername, password } = req.body;

  try {
    // Supabase ile giriş yap
    const authData = await signIn({
      email: emailOrUsername, // Supabase sadece email ile giriş yapıyor
      password
    });

    // Kullanıcı bilgilerini al
    const user = authData.user;

    // Auth cookie'sini ayarla (eğer hala kullanılıyorsa)
    if (req.body.rememberMe) {
      setAuthCookie(res, user.id, true);
    }

    res.status(200).json({ 
      user,
      message: 'Giriş başarılı'
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Hata mesajını belirle
    let errorMessage = 'Sunucu hatası';
    if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ message: errorMessage });
  }
}