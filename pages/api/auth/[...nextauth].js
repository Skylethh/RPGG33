import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import { compare } from 'bcryptjs';
import User from '../../../models/user';
import dbConnect from '../../../lib/dbConnect';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          provider: "google"
        }
      }
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
          provider: "discord"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        // Kullanıcıyı e-posta ile bul
        const user = await User.findOne({ email: credentials.email });
        
        // Kullanıcı bulunamadı
        if (!user) {
          throw new Error('E-posta veya şifre hatalı');
        }
        
        // Şifre karşılaştırma
        const isValid = await compare(credentials.password, user.password);
        
        // Şifre yanlış
        if (!isValid) {
          throw new Error('E-posta veya şifre hatalı');
        }
        
        // Giriş başarılı, kullanıcı nesnesini dön
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image || null,
          provider: "credentials"
        };
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün (varsayılan)
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    newUser: '/profile'
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // İlk giriş yapıldığında
      if (user) {
        token.id = user.id;
        token.provider = user.provider;
        
        // Kullanıcı hatırlanma süresini ayarla
        if (user.rememberMe === false) {
          token.rememberMe = false;
        } else {
          token.rememberMe = true;
        }
      }
      
      // session callback'inden gelen güncellemeyi kontrol et
      if (trigger === "update" && session) {
        if (session.user) {
          token.name = session.user.name || token.name;
          token.image = session.user.image || token.image;
        }
      }
      
      // Token süresini kontrol et (rememberMe false ise)
      if (token.rememberMe === false && token.exp) {
        // Bugün bitmesi için epoch tarihini kontrol et
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        if (Date.now() / 1000 > endOfDay.getTime() / 1000) {
          // Günün sonuna gelinmişse token'ı geçersiz kıl
          return { ...token, exp: 0 };
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    }
  },
});