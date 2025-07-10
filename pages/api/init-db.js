import { initDB } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await initDB();
    res.status(200).json({ message: 'Supabase geçişi tamamlandı', ...result });
  } catch (error) {
    console.error('Supabase geçişi sırasında hata:', error);
    res.status(500).json({ error: 'Supabase geçişi sırasında hata oluştu' });
  }
}