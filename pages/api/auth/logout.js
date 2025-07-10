import { signOut } from '../../../lib/supabase';
import { clearAuthCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Supabase ile çıkış yap
    await signOut();
    
    // Auth cookie'sini temizle (eğer hala kullanılıyorsa)
    clearAuthCookie(res);

    res.status(200).json({ message: 'Çıkış başarılı' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Çıkış yapılırken bir hata oluştu' });
  }
}