import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    // Supabase ile mevcut kullanıcıyı al
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return res.status(401).json({ message: 'Oturum bulunamadı' });
    }
    
    // Kullanıcı bilgilerini döndür
    res.status(200).json(session.user);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}