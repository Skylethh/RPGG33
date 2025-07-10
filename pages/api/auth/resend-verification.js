// Supabase ile doğrulama otomatik olarak e-posta bağlantısı ile yapılıyor
// Bu endpoint artık kullanılmıyor

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json({ 
    message: 'Supabase kullanıldığı için doğrulama işlemi e-posta bağlantısı ile otomatik olarak yapılmaktadır. Bu endpoint artık kullanılmıyor.'
  });
}