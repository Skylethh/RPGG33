import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { compare } from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email });
        
        if (!user) {
          throw new Error("Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı");
        }
        
        // Eğer bu bir Google hesabı ise ve şifresi yoksa
        if (user.accounts && user.accounts.some(acc => acc.provider === "google")) {
          throw new Error("Bu hesap Google ile bağlantılı, normal giriş yapılamaz");
        }
        
        const isValid = await compare(password, user.password);
        
        if (!isValid) {
          throw new Error("Şifre yanlış");
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
});