import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { storeVerificationCode } from '../../../lib/verificationCodes';
import { sendVerificationEmail } from '../../../lib/email';
// Import your user authentication methods here

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Replace with your actual user authentication logic
        const user = await findUserByEmail(credentials.email);

        if (!user) {
          return null;
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        if (!user.emailVerified) {
          // Generate and store verification code
          const code = storeVerificationCode(user.email);
          
          // Send verification email
          await sendVerificationEmail({
            email: user.email,
            code,
            provider: {
              server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                  user: process.env.EMAIL_SERVER_USER,
                  pass: process.env.EMAIL_SERVER_PASSWORD,
                },
                secure: true,
              },
              from: process.env.EMAIL_FROM,
            }
          });
          
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
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
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  debug: process.env.NODE_ENV === 'development',
});

// These are placeholder functions - replace with your actual implementations
async function findUserByEmail(email) {
  // Implement your user lookup logic here
}

async function verifyPassword(plainPassword, hashedPassword) {
  // Implement your password verification logic here
}