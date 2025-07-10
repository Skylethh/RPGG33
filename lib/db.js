import { supabase } from './supabase';

// Supabase'e geçiş için eski MySQL fonksiyonlarını yönlendiriyoruz
export async function query(sql, params) {
  console.warn('MySQL query fonksiyonu artık kullanılmıyor. Supabase kullanın.');
  throw new Error('MySQL artık desteklenmiyor. Supabase kullanın.');
}

// Supabase tabloları oluşturma
export async function initDB() {
  console.log('Supabase tabloları kontrol ediliyor...');
  
  // Supabase'de tablolar SQL Migration veya Dashboard üzerinden oluşturulmalıdır
  // Bu fonksiyon sadece uyarı amaçlıdır
  
  console.log('Supabase geçişi tamamlandı. Tablolar Supabase Dashboard üzerinden oluşturulmalıdır.');
  
  return { message: 'Supabase geçişi tamamlandı' };
}