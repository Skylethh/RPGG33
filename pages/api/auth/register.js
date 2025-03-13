import { hash } from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: "Tüm alanlar zorunludur" });
  }

  if (password.length < 6) {
    return res.status(422).json({ message: "Şifre en az 6 karakter olmalıdır" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Kullanıcının zaten var olup olmadığını kontrol et
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: "Bu e-posta adresi zaten kullanımda" });
    }

    // Şifreyi hashle
    const hashedPassword = await hash(password, 12);

    // Yeni kullanıcı oluştur
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      emailVerified: null
    });

    res.status(201).json({ message: "Kullanıcı oluşturuldu", userId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin" });
  }
}